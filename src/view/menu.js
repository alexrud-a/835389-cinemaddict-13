import AbstractView from "./abstract";

const createMenuTemplate = (sortInfo) => {
  const {watchlist, history, favorites} = sortInfo;
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-sort="all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-sort="isWatchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
      <a href="#history" data-sort="isViewed" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
      <a href="#favorites" data-sort="isFavorite" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(sortInfo) {
    super();
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._sortInfo = sortInfo;
  }

  getTemplate() {
    return createMenuTemplate(this._sortInfo);
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

