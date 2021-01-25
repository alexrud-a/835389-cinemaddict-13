import Observer from "./observer";

export default class Filter extends Observer {
  constructor() {
    super();
    this._sort = null;
    this._sortType = {};
  }

  setSortType(sort, filter, stats) {
    this._sortType = {
      sort,
      filter,
      stats
    };
    this._notifyChanges();
  }

  getSortType() {
    return this._sortType;
  }

  setSort(sort) {
    this._sort = sort;
    this._notifyChanges();
  }

  getSort() {
    return this._sort;
  }

  _notifyChanges() {
    this._notify({sortType: this._sortType, sort: this._sort});
  }

}
