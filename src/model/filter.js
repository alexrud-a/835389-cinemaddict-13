import Observer from "./observer";

export default class Filter extends Observer {
  constructor() {
    super();
    this._sort = null;
    this._sortType = {};
  }

  setSortType(sort, filter) {
    this._sortType = {
      sort,
      filter
    };
  }

  getSortType() {
    return this._sortType;
  }

  setSort(sort) {
    this._sort = sort;
  }

  getSort() {
    return this._sort;
  }

}
