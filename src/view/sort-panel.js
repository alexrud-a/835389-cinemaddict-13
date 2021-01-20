import AbstractView from "./abstract";

const createSortPanelTemplate = (sortType) => {
  const defaultClassName = (sortType === `default`)
    ? `sort__button--active`
    : ``;

  const dateClassName = (sortType === `date`)
    ? `sort__button--active`
    : ``;

  const ratingClassName = (sortType === `rating`)
    ? `sort__button--active`
    : ``;

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${defaultClassName}" data-sort="default">Sort by default</a></li>
    <li><a href="#" class="sort__button ${dateClassName}" data-sort="date">Sort by date</a></li>
    <li><a href="#" class="sort__button ${ratingClassName}" data-sort="rating">Sort by rating</a></li>
  </ul>`;
};

export default class SortPanel extends AbstractView {
  constructor(sortType) {
    super();
    this._sortType = sortType;
  }

  getTemplate() {
    return createSortPanelTemplate(this._sortType);
  }

  getActiveMenuLink() {
    return super.getElement().querySelector(`.sort__button--active`);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    for (let btn of this.getElement().querySelectorAll(`.sort__button`)) {
      btn.addEventListener(`click`, this._clickHandler);
    }
  }
}
