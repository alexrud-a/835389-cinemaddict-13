import Menu from "../view/menu";
import SortPanel from "../view/sort-panel";
import {render, RenderPosition, replace} from "../utils";

export default class FilterPresenter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._menu = null;
    this._sortPanel = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderSort();
  }

  _renderMenu() {
    const prevMenu = this._menu;
    this._menu = new Menu(this._filterModel.getSort(), this._filterModel.getSortType().filter);
    if (prevMenu) {
      replace(this._menu, prevMenu);
    } else {
      render(this._filterContainer, new Menu(this._filterModel.getSort(), this._filterModel.getSortType().filter).getElement(), RenderPosition.BEFOREEND);
    }
    this._menu.setClickHandler((evt) => this._handleFilterItemClick(evt));
  }

  _handleFilterItemClick(evt) {
    this._filterModel.setSortType(this._filterModel.getSortType().sort, evt.target.getAttribute(`data-sort`));
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    //this.update();
  }

  _renderSort() {
    const sortPanel = this._sortPanel;
    this._sortPanel = new SortPanel();
    if (sortPanel) {
      replace(this._sortPanel, sortPanel);
    } else {
      render(this._filterContainer, new SortPanel().getElement(), RenderPosition.BEFOREEND);
    }
    this._sortPanel.setClickHandler((evt) => this._handleSortItemClick(evt));
  }

  _handleSortItemClick(evt) {
    this._filterModel.setSortType(evt.target.getAttribute(`data-sort`), this._filterModel.getSortType().filter);
    this._sortPanel.getActiveMenuLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    //this.update();
  }
}
