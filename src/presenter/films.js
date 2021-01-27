import Profile from "../view/profile";
import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import Loading from "../view/loading";
import {render, RenderPosition, compareValues, remove, replace, profileRating} from "../utils";

import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";
import Stats from "../view/stats";

import CommentsModel from "../model/comments";

const siteBody = document.querySelector(`body`);

export default class FilmsPresenter {
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter, filmsPerPage, emptyPresenter, api) {
    this._filmsContainer = filmsContainer;
    this._isLoading = true;

    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._filterModel = filterModel;
    this._filterModel.addObserver(() => this.observeFilms(this._filmsModel.getFilms(), null));
    this._filterModel.addObserver(this.observeProfileHistory.bind(this));
    this._commentsModel = new CommentsModel();
    this._api = api;

    this._filmPresenter = {};
    this._emptyPresenter = emptyPresenter;
    this._filterPresenter = filterPresenter;

    this._sourcedFilms = [];
    this._films = [];
    this._filmsPerPage = filmsPerPage;
    this._renderedFilmsCount = filmsPerPage;
    this._profile = null;
    this._filmList = null;
    this._loadMore = new Loadmore();
    this._loadingComponent = new Loading();
    this._stats = null;
    this._mainFilmList = null;
    this._loadMoreContainer = null;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);
    this._handleStatsDisplay = this._handleStatsDisplay.bind(this);

    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment, this._commentsModel);
  }

  init() {
    this._sourcedFilms = this._filmsModel.getFilms().slice();
    this._films = this._sourcedFilms.slice();
    this._renderedFilmsCount = this._filmsPerPage;
    remove(this._loadingComponent);
    this._filterPresenter.init();
    if (this._sourcedFilms.length > 0) {
      this._renderFilmsContainer();
    } else {
      this._emptyPresenter.init();
    }
  }

  _renderLoading() {
    render(this._filmsContainer, this._loadingComponent.getElement(), RenderPosition.BEFOREEND);
  }

  observeFilms(films) {
    if (this._isLoading) {
      this._renderLoading();
      this.init();
    }
    this._clearList();
    this._sourcedFilms = films.slice();
    let updatedFilms = this._sourcedFilms;

    if (this._filterModel.getSortType().filter !== `all` || this._filterModel.getSortType().sort !== `default`) {
      const {filter, sort} = this._filterModel.getSortType();
      if (filter !== `all`) {
        updatedFilms = films.filter((film) => film[filter]);
      }
      if (sort !== `default`) {
        updatedFilms.sort(compareValues(sort, `desc`));
        if (sort !== `default`) {
          updatedFilms.sort(compareValues(sort, `desc`));
        }
      }
    }

    if (this._filterModel.getSortType().stats === true) {
      this._hide();
    } else {
      this._show();
    }

    this._films = updatedFilms;

    if (this._films.length > 0) {
      this._emptyPresenter.destroy();
      this._renderFilms();
    } else {
      this._emptyPresenter.init();
    }
  }

  observeProfileHistory({sort}) {
    if (sort.history > 0) {
      this._renderProfile();
    }
  }

  _renderProfile() {
    const prevProfile = this._profile;
    this._profile = new Profile(this._filterModel.getSort().history);
    if (prevProfile) {
      replace(this._profile, prevProfile);
    } else {
      render(siteBody.querySelector(`.header`), this._profile.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _renderFilmsContainer() {
    let prevList = this._filmList;
    this._filmList = new FilmList();

    if (prevList) {
      replace(this._filmList, prevList);
    } else {
      render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
    }
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);

    if (this._filterModel.getSort().history > 0) {
      this._renderProfile();
    }
    this._renderFilms();
    this._renderStats();

    this._stats.hide();
  }

  _renderStats() {
    let prevStats = this._stats;
    this._stats = new Stats(this._sourcedFilms, `ALL_TIME`, profileRating(this._filterModel.getSort().history));
    if (prevStats) {
      replace(this._stats, prevStats);
    } else {
      render(this._filmsContainer, this._stats.getElement(), RenderPosition.BEFOREEND);
    }
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

    if (this._films.length > this._renderedFilmsCount) {
      this._renderLoadMore();
    }
  }

  _handleFilmChange(updatedFilm) {
    this._api.updateFilm(updatedFilm).then((update) => {
      this._filmsModel.updateFilm(update);
    });
  }

  _handlePopupDisplay(film) {
    this._popup.init(film);
    this._api.getComments(film).then((comments) => {
      this._commentsModel.setCommentsFilm(comments, film);
    })
      .catch(() => {
        this._commentsModel.setCommentsFilm([], {});
      });
  }

  _handlePopupRemoveComment(updatedFilm, comment) {
    this._api.deleteComment(comment).then(() => {
      this._commentsModel.removeComment(comment, updatedFilm);
    });

    this._api.updateFilm(updatedFilm).then((update) => {
      this._filmsModel.updateFilm(update);
    });

    this._popup.init(updatedFilm, this._commentsModel.getCommentsFilm());
  }

  _handleStatsDisplay() {
    this._stats.show();
    this._filmList.hide();
  }

  _handlePopupChange(updatedFilm) {
    this._api.updateFilm(updatedFilm).then((update) => {
      this._filmsModel.updateFilm(update);
      this._popup.init(update);
    });
  }

  _handleAddComment(film, comment) {
    this._api.addComment(comment, film).then((update) => {
      this._commentsModel.addComment(update[1], update[0]);
      this._filmsModel.updateFilm(update[0]);
      this._popup.init(update[0], this._commentsModel.getCommentsFilm());
    });
  }

  _clearList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    remove(this._loadMore);
  }

  _hide() {
    if (this._stats !== null) {
      this._stats.show();
      this._filmList.hide();
    }
  }

  _show() {
    if (this._stats !== null) {
      this._stats.hide();
      this._filmList.show();
    }
  }
}
