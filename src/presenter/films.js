import Profile from "../view/profile";
import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import {render, RenderPosition, compareValues, remove, replace, profileRating} from "../utils";

import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";
import Stats from "../view/stats";

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
    this._filterModel.addObserver(() => this.observeFilms(this._sourcedFilms, null));
    this._filterModel.addObserver(this.observeProfileHistory.bind(this));

    this._filterPresenter = filterPresenter;
    this._filmPresenter = {};

    this._sourcedFilms = [];
    this._films = [];
    this._filmsPerPage = filmsPerPage;
    this._renderedFilmsCount = filmsPerPage;
    this._profile = null;
    this._filmList = new FilmList();
    this._loadMore = new Loadmore();
    this._stats = null;
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);
    this._handleStatsDisplay = this._handleStatsDisplay.bind(this);

    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment);
  }

  init() {
    this._sourcedFilms = this._filmsModel.getFilms().slice();
    this._films = this._sourcedFilms.slice();
    this._renderedFilmsCount = this._filmsPerPage;
    this._stats = new Stats(this._sourcedFilms, `ALL_TIME`, profileRating(this._filterModel.getSort().history));
    this._renderFilmsContainer();
  }

  observeFilms(films) {
    this._sortType = this._filterModel.getSortType();
    this._sourcedFilms = films.slice();
    this._clearList();
    let updatedFilms = this._sourcedFilms;

    if (this._sortType.filter !== `all` || this._sortType.sort !== `default`) {
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

    if (this._sortType.stats === true) {
      this._hide();
    } else {
      this._show();
    }

    this._films = updatedFilms;
    this._renderFilms();
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
    this._filterPresenter.init();
    render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
    if (this._filterModel.getSort().history > 0) {
      this._renderProfile();
    }
    this._renderFilms();
    render(this._filmsContainer, this._stats.getElement(), RenderPosition.BEFOREEND);
    this._stats.hide();
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
    this._filmsModel.updateFilm(updatedFilm);
    this._filterModel.setSort({
      watchlist: this._filmsModel.getFilms().slice().filter((item) => item.isWatchlist).length,
      history: this._filmsModel.getFilms().slice().filter((item) => item.isViewed).length,
      favorites: this._filmsModel.getFilms().slice().filter((item) => item.isFavorite).length,
    });
  }

  _handlePopupDisplay(film) {
    this._popup.init(film);
  }

  _handlePopupRemoveComment(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _handleStatsDisplay() {
    this._stats.show();
    this._filmList.hide();
    this._filterPresenter.hideSort();
  }

  _handlePopupChange(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._popup.init(updatedFilm);
    this._filterModel.setSort({
      watchlist: this._filmsModel.getFilms().slice().filter((item) => item.isWatchlist).length,
      history: this._filmsModel.getFilms().slice().filter((item) => item.isViewed).length,
      favorites: this._filmsModel.getFilms().slice().filter((item) => item.isFavorite).length,
    });
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

  _hide() {
    this._stats.show();
    this._filmList.hide();
  }

  _show() {
    this._stats.hide();
    this._filmList.show();
  }
}
