import Profile from "../view/profile";
import SiteMenu from "../view/menu";
import SortPanel from "../view/sort-panel";
import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import {render, RenderPosition, compareValues, updateItem, remove, replace} from "../utils";

import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";

const FILM_PER_PAGE = 5;
const siteBody = document.querySelector(`body`);

export default class FilmsPresenter {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._films = null;
    this._profile = null;
    this._sort = {};
    this._menu = null;
    this._filmPresenter = {};
    this._sortPanel = new SortPanel();
    this._filmList = new FilmList();
    this._loadMore = new Loadmore();
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupDisplay = this._handlePopupDisplay.bind(this);
    this._handlePopupChange = this._handlePopupChange.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handlePopupRemoveComment = this._handlePopupRemoveComment.bind(this);
    this._popup = new FilmPopupPresenter(siteBody, this._handlePopupChange, this._handlePopupRemoveComment, this._handleAddComment);
    this._sortType = {
      sort: `default`,
      filter: `all`,
    };
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._sort = {
      watchlist: this._sourcedFilms.filter((item) => item.isWatchlist).length,
      history: this._sourcedFilms.filter((item) => item.isViewed).length,
      favorites: this._sourcedFilms.filter((item) => item.isFavorite).length,
    };
    if (this._sort.history > 0) {
      this._renderProfile();
    }
    this._renderFilmsContainer();
  }

  update(renderedFilms) {
    this._clearList();
    if (renderedFilms) {
      this._renderedFilmsCount = renderedFilms;
    }
    let updatedFilms = this._sourcedFilms;
    this._sort = {
      watchlist: this._sourcedFilms.filter((item) => item.isWatchlist).length,
      history: this._sourcedFilms.filter((item) => item.isViewed).length,
      favorites: this._sourcedFilms.filter((item) => item.isFavorite).length,
    };
    if (this._sort.history > 0) {
      this._renderProfile();
    }
    if (this._sortType.filter !== `all`) {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._sortType.filter]);
    }
    if (this._sortType.sort !== `default`) {
      updatedFilms.sort(compareValues(this._sortType.sort, `desc`));
    }
    this._films = updatedFilms;
    this._renderFilms();
  }

  _renderProfile() {
    const prevProfile = this._profile;
    this._profile = new Profile(this._sort.history);
    if (prevProfile) {
      replace(this._profile, prevProfile);
    } else {
      render(siteBody.querySelector(`.header`), this._profile.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _renderMenu() {
    const prevMenu = this._menu;
    this._menu = new SiteMenu(this._sort, this._sortType.filter);
    if (prevMenu) {
      this._sort = {
        watchlist: this._films.filter((item) => item.isWatchlist).length,
        history: this._films.filter((item) => item.isViewed).length,
        favorites: this._films.filter((item) => item.isFavorite).length,
      };
      replace(this._menu, prevMenu);
    } else {
      render(this._filmsContainer, this._menu.getElement(), RenderPosition.AFTERBEGIN);
    }
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
    this._renderFilmList(0, Math.min(this._films.length, this._renderedFilmsCount));

    if (this._films.length > FILM_PER_PAGE) {
      this._renderLoadMore();
    }
  }

  _handleFilmChange(updatedFilm) {
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._renderProfile();
    this._renderMenu(this._filmsContainer);
    if (!updatedFilm[this._sortType.filter]) {
      this.update(this._renderedFilmsCount);
    } else {
      this._filmPresenter[updatedFilm.id].forEach((item) => {
        item.init(updatedFilm);
      });
    }
  }

  _handlePopupDisplay(film) {
    this._popup.init(film);
  }

  _handlePopupRemoveComment(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _handlePopupChange(updatedFilm) {
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    if (!updatedFilm[this._sortType.filter]) {
      this.update();
    } else {
      this._filmPresenter[updatedFilm.id].init(updatedFilm);
    }
    this._renderProfile();
    this._renderMenu(this._filmsContainer);
    this._popup.init(updatedFilm);
  }

  _handleAddComment(updatedFilm) {
    this._films = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _clearList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_PER_PAGE;
    remove(this._loadMore);
  }
}
