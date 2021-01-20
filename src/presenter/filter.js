import Menu from "../view/menu";
import SortPanel from "../view/sort-panel";
import {render, RenderPosition, replace} from "../utils";

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilter.bind(this));
    this._menu = null;
    this._sortPanel = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderSort();
  }

  observeFilter() {
    this.init();
  }

  _renderMenu() {
    const prevMenu = this._menu;
    this._menu = new Menu(this._filterModel.getSort(), this._filterModel.getSortType().filter);
    if (prevMenu) {
      replace(this._menu, prevMenu);
    } else {
      render(this._filterContainer, this._menu.getElement(), RenderPosition.BEFOREEND);
    }
    this._menu.setClickHandler(this._handleFilterItemClick);
  }

  _handleFilterItemClick(evt) {
    this._filterModel.setSortType(this._filterModel.getSortType().sort, evt.target.getAttribute(`data-sort`));
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
  }

  _renderSort() {
    const sortPanel = this._sortPanel;
    this._sortPanel = new SortPanel(this._filterModel.getSortType().sort);
    if (sortPanel) {
      replace(this._sortPanel, sortPanel);
    } else {
      render(this._filterContainer, this._sortPanel.getElement(), RenderPosition.BEFOREEND);
    }
    this._sortPanel.setClickHandler(this._handleSortItemClick);
  }

  _handleSortItemClick(evt) {
    this._filterModel.setSortType(evt.target.getAttribute(`data-sort`), this._filterModel.getSortType().filter);
    this._sortPanel.getActiveMenuLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
  }
}
