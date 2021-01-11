import Profile from "../view/profile";
import FilmList from "../view/films-list";
import Loadmore from "../view/loadmore";
import {render, RenderPosition, compareValues, remove, replace} from "../utils";

import FilmCardPresenter from "./filmCard";
import FilmPopupPresenter from "./filmPopup";

const FILM_PER_PAGE = 5;
const siteBody = document.querySelector(`body`);

export default class FilmsPresenter {
  constructor(filmsContainer, filmsModel, filterModel, filterPresenter) {
    this._filterPresenter = filterPresenter;
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._films = [];
    this._renderedFilmsCount = FILM_PER_PAGE;
    this._sourcedFilms = [];
    this._profile = null;
    this._filmPresenter = {};
    this._filmList = new FilmList();
    this._loadMore = new Loadmore();
    this._mainFilmList = this._filmList.getElement().querySelector(`.js-film-list-main`);
    this._loadMoreContainer = this._filmList.getElement().querySelector(`.js-films-container`);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    //this._handleSortItemClick = this._handleSortItemClick.bind(this);
    //this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
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
    if (this._filterModel.getSort().history > 0) {
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
    this._filterModel.setSort({
      watchlist: this._sourcedFilms.filter((item) => item.isWatchlist).length,
      history: this._sourcedFilms.filter((item) => item.isViewed).length,
      favorites: this._sourcedFilms.filter((item) => item.isFavorite).length,
    });
    if (this._filterModel.getSort.history > 0) {
      this._renderProfile();
    }
    if (this._filterModel.getSortType().filter !== `all`) {
      updatedFilms = this._sourcedFilms.filter((film) => film[this._filterModel.getSortType().filter]);
    }
    if (this._filterModel.getSortType().sort !== `default`) {
      updatedFilms.sort(compareValues(this._filterModel.getSortType().sort, `desc`));
    }
    this._films = updatedFilms;
    this._filterPresenter.init();
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


  _handleFilterItemClick() {
    this._filterPresenter.init();
    this.update();
  }

  _handleSortItemClick() {
    this._filterPresenter.init();
    this.update();
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
    this._filmsModel.updateFilm(updatedFilm);
    this._sourcedFilms = this._filmsModel.getFilms();
    this._renderProfile();
    this._filterPresenter.init();
    if (!updatedFilm[this._filterModel.getSortType().filter]) {
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
    this._filmsModel.updateFilm(updatedFilm);
    this._sourcedFilms = this._filmsModel.getFilms();
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._popup.init(updatedFilm);
  }

  _handlePopupChange(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._sourcedFilms = this._filmsModel.getFilms();
    if (!updatedFilm[this._filterModel.getSortType().filter]) {
      this.update();
    } else {
      this._filmPresenter[updatedFilm.id].init(updatedFilm);
    }
    this._renderProfile();
    this._filterPresenter.init();
    this._popup.init(updatedFilm);
  }

  _handleAddComment(updatedFilm) {
    this._filmsModel.updateFilm(updatedFilm);
    this._sourcedFilms = this._filmsModel.getFilms();
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
