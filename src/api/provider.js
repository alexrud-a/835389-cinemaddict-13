import Films from "../model/films";
import {isOnline} from "../utils";

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(Films.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(Films.adaptToClient));
  }

  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film);
    }

    return Promise.reject(new Error(`Upload comment failed`));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, Films.adaptFilmToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, Films.adaptFilmToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  createComment(comment, film) {
    if (isOnline()) {
      return this._api.createComment(comment, film);
    }

    return Promise.reject(new Error(`Add comment failed`));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment);
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const createdFilms = getSyncedFilms(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
