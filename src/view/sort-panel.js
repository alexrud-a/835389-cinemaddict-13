import Base from "./abstract";
import {SortTypes} from "../const";

const createSortTemplate = (sortType) => {
  const activeClass = `sort__button--active`;

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${sortType === SortTypes.DEFAULT ? activeClass : ``}" data-sort-type="${
  SortTypes.DEFAULT
}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${sortType === SortTypes.DATE ? activeClass : ``}" data-sort-type="${
  SortTypes.DATE
}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${sortType === SortTypes.RATING ? activeClass : ``}" data-sort-type="${
  SortTypes.RATING
}">Sort by rating</a></li>
  </ul>`;
};

export default class SortPanel extends Base {
  constructor(sortType) {
    super();
    this._sortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeClickHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
