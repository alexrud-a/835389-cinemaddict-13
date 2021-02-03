import Base from "./abstract";

const createFilterItem = (filter, currentFilterType) => {
  const {type, name, anchor, count} = filter;
  const countElement = count !== undefined ? `<span class="main-navigation__item-count">${count}</span>` : ``;
  const activeClass = currentFilterType === anchor ? `main-navigation__item--active` : ``;

  return `<a href="#${anchor}" data-type=${type} data-anchor=${anchor} class="main-navigation__item ${activeClass}">
    ${name}
    ${countElement}
  </a>`;
};

const createFilterListTemplate = (filters, currentFilterType) => {
  const filterItemsTemlate = filters.map((filter) => createFilterItem(filter, currentFilterType)).join(``);

  return `<div class="main-navigation__items">
      ${filterItemsTemlate}
    </div>`;
};

export default class FilterList extends Base {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._handleFilterChangeClick = this._handleFilterChangeClick.bind(this);
  }

  getTemplate() {
    return createFilterListTemplate(this._filters, this._currentFilter);
  }

  _handleFilterChangeClick(evt) {
    evt.preventDefault();
    this._callback.typeFilterChange(evt.currentTarget.dataset.type);
  }

  setFilterChangeClickHandler(callback) {
    this._callback.typeFilterChange = callback;
    const filterItems = this.getElement().querySelectorAll(`.main-navigation__item`);
    filterItems.forEach((item) => item.addEventListener(`click`, this._handleFilterChangeClick));
  }
}
