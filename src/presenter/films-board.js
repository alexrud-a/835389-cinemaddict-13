import FilmCard from "./filmCard";
import FilmPopup from "./filmPopup";
import SortPanel from "../view/sort-panel";
import FilmsView from "../view/films";
import FilmsEmpty from "../view/empty-films";
import LoadingView from "../view/loading";
import FilmsListView from "../view/films-list";
import LoadMore from "../view/loadmore";
import {render, RenderPosition, remove, filter, sortFilmDateDown, sortFilmRatingDown} from "../utils";
import {SortTypes, UpdateType, UserAction} from "../const";

const FILMS_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

const Esc = `Esc`;
const Escape = `Escape`;

const FilmsList = {
  ALL: `ALL`,
  TOP_RATED: `TOP_RATED`,
  MOST_COMMENTED: `MOST_COMMENTED`,
};

const FilmsListSettings = {
  ALL: {title: `All movies. Upcoming`, isExtra: false, isTitleHidden: true},
  TOP_RATED: {title: `Top rated`, isExtra: true, isTitleHidden: false},
  MOST_COMMENTED: {title: `Most commented`, isExtra: true, isTitleHidden: false},
};

export default class FilmsBoard {
  constructor(root, container, filmsModel, filterModel, api) {
    this._root = root;
    this._isLoading = true;
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._renderedFilmsCount = FILMS_PER_STEP;
    this._currentSortType = SortTypes.DEFAULT;

    this._allFilmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    this._filmsBoardComponent = new FilmsView();
    this._emptyFilms = new FilmsEmpty();
    this._loadingComponent = new LoadingView();
    this._loadMoreBtnComponent = new LoadMore();

    this._filmDetailsId = null;
    this._filmPopupPresenter = null;

    this._sortComponent = null;
    this._allFilmsListComponent = null;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._openFilmDetails = this._openFilmDetails.bind(this);
    this._getFilmById = this._getFilmById.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmsBoard();
  }

  destroy() {
    this._clearFilms({resetRenderedFilmCount: true, resetCurrentSortType: true, resetFilmDetails: true});
  }

  _getFilms() {
    const currentFilter = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms().slice();
    const filteredFilms = filter[currentFilter](films);

    switch (this._currentSortType) {
      case SortTypes.DATE:
        return filteredFilms.sort(sortFilmDateDown);
      case SortTypes.RATING:
        return filteredFilms.sort(sortFilmRatingDown);
    }

    return filteredFilms;
  }

  _getFilmById(filmId) {
    return this._filmsModel.getFilms().find((f) => f.id === filmId);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    if (this._getFilms().length === 0) {
      return;
    }

    this._sortComponent = new SortPanel(this._currentSortType);
    this._sortComponent.setSortTypeChangeClickHandler(this._handleSortTypeChange);

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsBoardContainer() {
    render(this._container, this._filmsBoardComponent, RenderPosition.BEFOREEND);
  }

  _handleEscKeyDown(evt) {
    if (evt.key === Escape || evt.key === Esc) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((updatedFilm) => {
          this._filmsModel.updateFilm(updateType, updatedFilm);
        });
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearFilms();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilms({resetRenderedFilmCount: true, resetCurrentSortType: true, resetFilmDetails: true});
        this._renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilms({resetRenderedFilmCount: true});
    this._renderFilmsBoard();
  }

  _toggleOverlay() {
    this._root.classList.toggle(`hide-overflow`);
  }

  _setDocumentEscKeyDownListener() {
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _unSetDocumentEscKeyDownListener() {
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _closeFilmDetails() {
    if (this._filmPopupPresenter === null) {
      return;
    }

    this._filmPopupPresenter.destroy();
    this._filmDetailsId = null;
    this._filmPopupPresenter = null;
    this._toggleOverlay();
    this._unSetDocumentEscKeyDownListener();
  }

  _openFilmDetails(filmId) {
    if (this._filmPopupPresenter !== null) {
      this._closeFilmDetails();
    }

    this._filmDetailsId = filmId;
    this._filmPopupPresenter = new FilmPopup(
        this._root,
        this._filmDetailsId,
        this._api,
        this._getFilmById,
        this._closeFilmDetails,
        this._handleViewAction
    );
    this._filmPopupPresenter.init();

    this._toggleOverlay();
    this._setDocumentEscKeyDownListener();
  }

  _renderFilmCard(film, dist) {
    const filmPresenter = new FilmCard(dist, this._openFilmDetails, this._handleViewAction);
    filmPresenter.init(film);

    return filmPresenter;
  }

  _renderFilmList(list) {
    const listComponent = new FilmsListView(FilmsListSettings[list]);
    render(this._filmsBoardComponent, listComponent, RenderPosition.BEFOREEND);

    return listComponent;
  }

  _renderAllFilms(films) {
    if (!this._allFilmsListComponent) {
      this._allFilmsListComponent = this._renderFilmList(FilmsList.ALL);
    }

    films.forEach((film) => {
      const presenter = this._renderFilmCard(film, this._allFilmsListComponent.getContainer());
      this._allFilmCardPresenter[film.id] = presenter;
    });
  }

  _renderTopRatedFilms(films) {
    if (!this._topRatedListComponent) {
      this._topRatedListComponent = this._renderFilmList(FilmsList.TOP_RATED);
    }

    films
      .filter((film) => film.totalRating)
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, EXTRA_FILM_COUNT)
      .forEach((film) => {
        const presenter = this._renderFilmCard(film, this._topRatedListComponent.getContainer());
        this._topRatedFilmCardPresenter[film.id] = presenter;
      });
  }

  _renderMostCommentedFilms(films) {
    const filmsWithComments = films.filter((film) => film.comments.length > 0);

    if (filmsWithComments.length === 0) {
      return;
    }

    if (!this._mostCommentedListComponent) {
      this._mostCommentedListComponent = this._renderFilmList(FilmsList.MOST_COMMENTED);
    }

    filmsWithComments
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_FILM_COUNT)
      .forEach((film) => {
        const presenter = this._renderFilmCard(film, this._mostCommentedListComponent.getContainer());
        this._mostCommentedFilmCardPresenter[film.id] = presenter;
      });
  }

  _renderLoading() {
    render(this._filmsBoardComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    render(this._filmsBoardComponent, this._emptyFilms, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreBtnClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderAllFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._loadMoreBtnComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreBtnComponent !== null) {
      this._loadMoreBtnComponent = null;
    }

    this._loadMoreBtnComponent = new LoadMore();
    this._loadMoreBtnComponent.setClickHandler(this._handleLoadMoreBtnClick);

    render(this._allFilmsListComponent, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);
  }

  _clearFilms({resetRenderedFilmCount = false, resetCurrentSortType = false, resetFilmDetails = false} = {}) {
    const filmsCount = this._getFilms().length;

    const presenters = [
      ...Object.values(this._allFilmCardPresenter),
      ...Object.values(this._topRatedFilmCardPresenter),
      ...Object.values(this._mostCommentedFilmCardPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroy());

    this._allFilmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    remove(this._sortComponent);
    remove(this._emptyFilms);
    remove(this._loadMoreBtnComponent);
    remove(this._allFilmsListComponent);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
    remove(this._filmsBoardComponent);

    this._allFilmsListComponent = null;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetCurrentSortType) {
      this._currentSortType = SortTypes.DEFAULT;
    }

    if (resetFilmDetails) {
      this._closeFilmDetails();
    }
  }

  _renderFilmsBoard() {
    const films = this._getFilms();
    const filmsCount = films.length;

    this._renderSort();
    this._renderFilmsBoardContainer();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (filmsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderAllFilms(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));

    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }

    this._renderTopRatedFilms(films);
    this._renderMostCommentedFilms(films);

    if (this._filmPopupPresenter) {
      this._filmPopupPresenter.init();
    }
  }
}
