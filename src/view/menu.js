import AbstractView from "./abstract";

const createMenuTemplate = (sortInfo, sortType) => {
  const {watchlist, history, favorites} = sortInfo;

  const allFilmsClassName = (sortType === `all`)
    ? `main-navigation__item--active`
    : ``;

  const watchlistClassName = (sortType === `isWatchlist`)
    ? `main-navigation__item--active`
    : ``;

  const watchedClassName = (sortType === `isViewed`)
    ? `main-navigation__item--active`
    : ``;

  const favoriteClassName = (sortType === `isFavorite`)
    ? `main-navigation__item--active`
    : ``;

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-sort="all" class="main-navigation__item ${allFilmsClassName}">All movies</a>
      <a href="#watchlist" data-sort="isWatchlist" class="main-navigation__item ${watchlistClassName}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" data-sort="isViewed" class="main-navigation__item ${watchedClassName}">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" data-sort="isFavorite" class="main-navigation__item ${favoriteClassName}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(sortInfo, sortType) {
    super();
    this._sortInfo = sortInfo;
    this._sortType = sortType;
  }

  getTemplate() {
    return createMenuTemplate(this._sortInfo, this._sortType);
  }

  getActiveMenuLink() {
    return super.getElement().querySelector(`.main-navigation__item--active`);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    for (let btn of this.getElement().querySelectorAll(`.main-navigation__item`)) {
      btn.addEventListener(`click`, this._clickHandler);
    }
  }
}

