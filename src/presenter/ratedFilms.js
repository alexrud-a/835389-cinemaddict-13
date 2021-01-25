import FilmListRated from "../view/films-list-rated";
import {compareValues, render, RenderPosition} from "../utils";
import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";
const siteBody = document.querySelector(`body`);

export default class RatedFilmsPresenter {
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage) {
    this._filterPresenter = filterPresenter;
    this._filmsContainer = filmsContainer;

    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._filterModel = filterModel;
    this._filterModel.addObserver(() => this.observeFilms(this._sourcedFilms, null));

    this._filterPresenter = filterPresenter;
    this._filmPresenter = {};

    this._sourcedFilms = [];
    this._films = [];
    this._filmsPerPage = filmsPerPage;
    this._renderedFilmsCount = filmsPerPage;
    this._filmList = new FilmListRated();
    this._mainFilmList = null;

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);

    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment);
  }

  init() {
    this._sourcedFilms = this._filmsModel.getFilms();
    this._films = this._sourcedFilms.slice().sort(compareValues(`rating`, `desc`));
    this._renderedFilmsCount = this._filmsPerPage;
    this._renderFilmsContainer();
  }

  observeFilms(films) {
    this._clearList();
    this._sourcedFilms = films.slice();
    let updatedFilms = this._sourcedFilms;

    this._films = updatedFilms.slice().sort(compareValues(`rating`, `desc`));
    this._renderFilms();
  }

  _renderFilmsContainer() {
    this._filterPresenter.init();
    render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-rated`);
    this._renderFilms();
  }

  _renderCard(film, container) {
    const filmPresenter = new FilmCardPresenter(container, this._handleFilmChange, this._handlePopupDisplay);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmList(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(film, this._mainFilmList));
  }

  _renderFilms() {
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));
  }

  _handleFilmChange(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
  }

  _handlePopupDisplay(film) {
    this._popup.init(film);
  }

  _handlePopupRemoveComment(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _handlePopupChange(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _handleAddComment(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _clearList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
  }
}
