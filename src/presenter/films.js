import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import {render, RenderPosition, compareValues} from "../utils";

import FilmCardPresenter from "./filmCard";

const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

export default class FilmsPresenter {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._films = null;
    this._filmList = new FilmList();
    this._loadMore = new Loadmore();
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);
    this._topRatedFilmList = this._filmList.getElement().querySelector(`.js-film-list-rated`);
    this._topCommentedFilmList = this._filmList.getElement().querySelector(`.js-film-list-commented`);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films;
    this._renderFilmsContainer();
  }

  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmList.getElement(), RenderPosition.BEFOREEND);
    this._renderFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }

  _renderCard(film, container) {
    const cardPresenter = new FilmCardPresenter(container);
    cardPresenter.init(film);
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

  filteredFilms(param) {
    if (this._films.length > FILM_PER_PAGE) {
      this._renderLoadMore();
    }
    if (param !== `default`) {
      let filteredFilms = this._films.slice().sort(compareValues(param, `desc`));
    }
  }
}
