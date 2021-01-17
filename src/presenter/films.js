import Profile from "../view/profile";
import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import {render, RenderPosition, compareValues, remove, replace} from "../utils";

import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";

const siteBody = document.querySelector(`body`);

export default class FilmsPresenter {
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage) {
    this._filterPresenter = filterPresenter;
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._filterModel = filterModel;
    this._sortType = {
      sort: this._filterModel.getSortType().sort,
      filter: this._filterModel.getSortType().filter,
    };
    this._films = [];
    this._filmsPerPage = filmsPerPage;
    this._renderedFilmsCount = null;
    this._sourcedFilms = [];
    this._profile = null;
    this._filmPresenter = {};
    this._filmList = new FilmList();
    this._loadMore = new Loadmore();
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);
    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment);
  }

  init() {
    this._sourcedFilms = this._filmsModel.getFilms();
    this._films = this._filmsModel.getFilms();
    this._renderedFilmsCount = this._filmsPerPage;
    if (this._filterModel.getSort().history > 0) {
      this._renderProfile();
    }
    this._renderFilmsContainer();
  }

  observeFilms(films, updatedFilm) {
    this._clearList();
    this._sourcedFilms = films.slice();
    let updatedFilms = this._sourcedFilms;

    if (this._filterModel.getSort().history > 0) {
      this._renderProfile();
    }

    if (this._sortType.filter !== `all`) {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._sortType.filter]);
    }
    if (this._sortType.sort !== `default`) {
      updatedFilms.sort(compareValues(this._sortType.sort, `desc`));
    }

    if (updatedFilm === null) {
      return this._sourcedFilms;
    }

    this._films = updatedFilms;
    this._renderFilms();
  }

  _renderProfile() {
    const prevProfile = this._profile;
    this._profile = new Profile(this._filterModel.getSort.history);
    if (prevProfile) {
      replace(this._profile, prevProfile);
    } else {
      render(siteBody.querySelector(`.header`), this._profile.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _renderFilmsContainer() {
    this._filterPresenter.init();
    render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
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

  _renderLoadMore() {
    render(this._loadMoreContainer, this._loadMore.getElement(), RenderPosition.BEFOREEND);
    this._loadMore.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _handleLoadMoreButtonClick() {
    this._renderFilmList(this._renderedFilmsCount, this._renderedFilmsCount + this._filmsPerPage);
    this._renderedFilmsCount += this._filmsPerPage;

    if (this._renderedFilmsCount >= this._films.length) {
      this._loadMore.getElement().remove();
      this._loadMore.removeElement();
      this._renderedFilmsCount = this._filmsPerPage;
    }
  }

  _renderFilms() {
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));

    if (this._films.length > this._filmsPerPage) {
      this._renderLoadMore();
    }
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
    this._filterPresenter = {};
    remove(this._loadMore);
  }
}
