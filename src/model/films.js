import Observer from "./observer";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
    this._notify(this._films, null);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];
    this._notify(this._films, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          actors: film.film_info.actors,
          age: film.film_info.age_rating,
          info: {
            originTitle: film.film_info.alternative_title,
            poster: film.film_info.poster,
            title: film.film_info.title,
          },
          description: film.film_info.description,
          regisseur: film.film_info.director,
          genre: film.film_info.genre,
          date: film.film_info.release.date,
          country: film.film_info.release.release_country,
          time: film.film_info.runtime,
          rating: film.film_info.total_rating,
          screenwriters: film.film_info.writers,
          isWatchlist: film.user_details.watchlist,
          isViewed: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          watchedData: film.user_details.watching_date
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": {
            "actors": film.actors,
            "age_rating": film.age,
            "alternative_title": film.info.originTitle,
            "description": film.description,
            "director": film.regisseur,
            "genre": film.genre,
            "poster": film.info.poster,
            "release": {
              "date": film.date,
              "release_country": film.country,
            },
            "runtime": film.time,
            "title": film.info.title,
            "total_rating": film.rating,
            "writers": film.screenwriters
          },
          "user_details": {
            "watchlist": film.isWatchlist,
            "already_watched": film.isViewed,
            "favorite": film.isFavorite,
            "watching_date": film.watchedData
          }
        }
    );

    delete adaptedFilm.actors;
    delete adaptedFilm.age;
    delete adaptedFilm.info;
    delete adaptedFilm.description;
    delete adaptedFilm.regisseur;
    delete adaptedFilm.genre;
    delete adaptedFilm.date;
    delete adaptedFilm.country;
    delete adaptedFilm.time;
    delete adaptedFilm.rating;
    delete adaptedFilm.screenwriters;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isViewed;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchedData;

    return adaptedFilm;
  }
}
