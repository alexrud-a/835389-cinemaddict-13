import ProfileView from "../view/profile";
import {remove, render, RenderPosition, replace} from "../utils";
import {RatingName} from "../const";

const RatingMinValue = {
  [RatingName.NOVICE]: 1,
  [RatingName.FAN]: 11,
  [RatingName.MOVIE_BUFF]: 21,
};

export default class Profile {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._status = null;

    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._films = this._getFilms();
    this._status = this._getStatus();

    this._renderProfile();
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilms() {
    return this._filmsModel.getFilms();
  }

  _getStatus() {
    const watchedCount = this._films.reduce((count, film) => (film.isWatched ? count + 1 : count), 0);

    if (watchedCount >= RatingMinValue[RatingName.MOVIE_BUFF]) {
      return RatingName.MOVIE_BUFF;
    }

    if (watchedCount >= RatingMinValue[RatingName.FAN]) {
      return RatingName.FAN;
    }

    if (watchedCount >= RatingMinValue[RatingName.NOVICE]) {
      return RatingName.NOVICE;
    }

    return null;
  }

  _renderProfile() {
    if (!this._status && this._profileComponent) {
      remove(this._profileComponent);
      this._profileComponent = null;
      return;
    }

    if (!this._status) {
      return;
    }

    this._prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(this._status);

    if (this._prevProfileComponent === null) {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._profileComponent, this._prevProfileComponent);
    remove(this._prevProfileComponent);
  }
}
