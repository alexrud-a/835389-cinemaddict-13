import SiteMenu from "../view/menu";
import SortPanel from "../view/sort-panel";
import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import {render, RenderPosition, compareValues, updateItem} from "../utils";

import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";

const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;
const siteBody = document.querySelector(`body`);

export default class FilmsPresenter {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._films = null;
    this._sort = {};
    this._menu = {};
    this._filmPresenter = {};
    this._sortPanel = new SortPanel();
    this._filmList = new FilmList();
    this._loadMore = new Loadmore();
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);
    this._topRatedFilmList = this._filmList.getElement().querySelector(`.js-film-list-rated`);
    this._topCommentedFilmList = this._filmList.getElement().querySelector(`.js-film-list-commented`);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange);
    this._sortType = {
      sort: `default`,
      filter: `all`,
    };
  }

  init(films, sortInfo) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._sort = sortInfo;
    this._menu = new SiteMenu(this._sort);
    this._renderFilmsContainer();
  }

  update() {
    this._mainFilmList.innerHTML = ``;
    let updatedFilms = this._sourcedFilms;
    if (this._sortType.filter !== `all`) {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._sortType.filter]);
    }
    if (this._sortType.sort !== `default`) {
      updatedFilms.sort(compareValues(this._sortType.sort, `desc`));
    }
    this._films = updatedFilms;
    this._renderFilms();
  }

  _renderMenu() {
    render(this._filmsContainer, this._menu.getElement(), RenderPosition.AFTERBEGIN);
    this._menu.setClickHandler((evt) => this._handleFilterItemClick(evt));
  }

  _handleFilterItemClick(evt) {
    this._sortType.filter = evt.target.getAttribute(`data-sort`);
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    this.update();
  }

  _renderSort() {
    render(this._filmsContainer, this._sortPanel.getElement(), RenderPosition.AFTERBEGIN);
    this._sortPanel.setClickHandler((evt) => this._handleSortItemClick(evt));
  }

  _handleSortItemClick(evt) {
    this._sortPanel.getActiveMenuLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    this._sortType.sort = evt.target.getAttribute(`data-sort`);
    this.update();
  }

  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
    this._renderSort(this._filmsContainer);
    this._renderMenu(this._filmsContainer);
    this._renderFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
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
    this._renderFilmList(this._renderedFilmsCount, this._renderedFilmsCount + FILM_PER_PAGE);
    this._renderedFilmsCount += FILM_PER_PAGE;

    if (this._renderedFilmsCount >= this._films.length) {
      this._loadMore.getElement().remove();
      this._loadMore.removeElement();
      this._renderedFilmsCount = FILM_PER_PAGE;
    }
  }

  _renderFilms() {
    this._renderFilmList(0, Math.min(this._films.length, FILM_PER_PAGE));

    if (this._films.length > FILM_PER_PAGE) {
      this._renderLoadMore();
    }
  }

  _renderRatedFilms() {
    for (let i = 0; i < FILM_RATED_COUNT; i++) {
      this._renderCard(this._filmsRated()[i], this._topRatedFilmList);
    }
  }

  _renderCommentedFilms() {
    for (let i = 0; i < FILM_RATED_COUNT; i++) {
      this._renderCard(this._filmsCommented()[i], this._topCommentedFilmList);
    }
  }

  _filmsRated() {
    return this._films.slice().sort(compareValues(`rating`, `desc`)).slice(0, FILM_RATED_COUNT);
  }

  _filmsCommented() {
    return this._films.slice().sort(compareValues(`comments`, `desc`)).slice(0, FILM_RATED_COUNT);
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handlePopupDisplay(film) {
    this._popup.init(film);
  }

  _handlePopupChange(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popup.init(updatedFilm);
  }
}
