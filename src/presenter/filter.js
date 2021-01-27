import Menu from "../view/menu";
import SortPanel from "../view/sort-panel";
import {render, RenderPosition, replace} from "../utils";

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
    this._menu = null;
    this._sortPanel = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleStatsItemClick = this._handleStatsItemClick.bind(this);
  }

  init() {
    this._renderSort();
    this._renderMenu();
  }

  observeFilms(films) {
    this._filterModel.setSort({
      watchlist: films.slice().filter((item) => item.isWatchlist).length,
      history: films.slice().filter((item) => item.isViewed).length,
      favorites: films.slice().filter((item) => item.isFavorite).length,
    });
    this.init();
  }

  _renderMenu() {
    const prevMenu = this._menu;
    this._menu = new Menu(this._filterModel.getSort(), this._filterModel.getSortType().filter);
    if (prevMenu) {
      replace(this._menu, prevMenu);
    } else {
      render(this._filterContainer, this._menu.getElement(), RenderPosition.AFTERBEGIN);
    }
    this._menu.setClickHandler(this._handleFilterItemClick);
    this._menu.setClickStatsHandler(this._handleStatsItemClick);
  }

  _handleFilterItemClick(evt) {
    this._showSort();
    this._filterModel.setSortType(this._filterModel.getSortType().sort, evt.target.getAttribute(`data-sort`), false);
  }

  _handleStatsItemClick() {
    this._filterModel.setSortType(this._filterModel.getSortType().sort, this._filterModel.getSortType().filter, true);
    this._hideSort();
  }

  _renderSort() {
    const sortPanel = this._sortPanel;
    this._sortPanel = new SortPanel(this._filterModel.getSortType().sort);
    if (sortPanel) {
      replace(this._sortPanel, sortPanel);
    } else {
      render(this._filterContainer, this._sortPanel.getElement(), RenderPosition.AFTERBEGIN);
    }
    this._sortPanel.setClickHandler(this._handleSortItemClick);
  }

  _handleSortItemClick(evt) {
    this._filterModel.setSortType(evt.target.getAttribute(`data-sort`), this._filterModel.getSortType().filter, false);
  }

  _hideSort() {
    this._sortPanel.hide();
  }

  _showSort() {
    this._sortPanel.show();
  }
}
