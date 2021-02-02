import FiltersListView from "../view/filter-list";
import {remove, render, RenderPosition, replace, filter} from "../utils";
import {FilterType, UpdateType, MenuItem} from "../const";

export default class Filters {
  constructor(container, filterModel, filmsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._currentFilter = null;

    this._filtersListComponent = null;

    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    this._filters = this._getFilters();

    this._prevFiltersListComponent = this._filtersListComponent;

    this._filtersListComponent = new FiltersListView(this._filters, this._currentFilter);
    this._filtersListComponent.setFilterChangeClickHandler(this._handleFilterChange);

    if (this._prevFiltersListComponent === null) {
      render(this._container, this._filtersListComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filtersListComponent, this._prevFiltersListComponent);
    remove(this._prevFiltersListComponent);
  }

  _handleFilterChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        anchor: MenuItem.ALL,
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        anchor: MenuItem.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        anchor: MenuItem.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        anchor: MenuItem.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
