import Base from "./abstract";
import {MenuItem} from "../const";

const createSiteMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#${MenuItem.STATS}" data-anchor=${MenuItem.STATS} class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends Base {
  constructor() {
    super();

    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();
    const element = evt.target;

    if (element.tagName !== `A`) {
      return;
    }

    if (
      element.classList.contains(`main-navigation__additional--active`) ||
      element.classList.contains(`main-navigation__item--active`)
    ) {
      return;
    }

    this._callback.menuItemClick(element.dataset.anchor);
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuItemClick = callback;
    this.getElement().addEventListener(`click`, this._menuItemClickHandler);
  }
}
