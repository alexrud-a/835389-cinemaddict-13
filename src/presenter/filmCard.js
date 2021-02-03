import FilmCardView from "../view/film-card";
import {render, replace, remove, RenderPosition} from "../utils";
import {UserAction, UpdateType} from "../const";

export default class FilmCard {
  constructor(container, openDetails, changeFilm) {
    this._container = container;
    this._openDetails = openDetails;
    this._changeFilm = changeFilm;

    this._filmCardComponent = null;

    this._handleOnFilmCardClick = this._handleOnFilmCardClick.bind(this);
    this._handleClickFilmInfo = this._handleClickFilmInfo.bind(this);
  }

  init(film) {
    this._film = film;

    this._prevFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardView(this._film);

    this._filmCardComponent.setClickHandler(this._handleOnFilmCardClick);
    this._filmCardComponent.setEditClickHandler((evt) => this._handleClickFilmInfo(evt));

    if (this._prevFilmCardComponent === null) {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, this._prevFilmCardComponent);
    remove(this._prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _handleOnFilmCardClick() {
    this._openDetails(this._film.id);
  }

  _handleClickFilmInfo(evt) {
    const type = evt.target.getAttribute(`data-type`);
    this._changeFilm(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {[type]: !this._film[type]}));
  }
}
