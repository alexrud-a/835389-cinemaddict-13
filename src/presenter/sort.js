import SortPanel from "../view/sort-panel";
import {render, RenderPosition} from "../utils";

export default class SortPresenter {
  constructor(sortContainer) {
    this._sortContainer = sortContainer;
    this._sortPanel = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
  }

  init() {
    this._sortPanel = new SortPanel();
    this._renderSort();
  }

  _renderSort() {
    render(this._sortContainer, this._sortPanel.getElement(), RenderPosition.BEFOREEND);
    this._sortPanel.setClickHandler((evt) => this._handleSortItemClick(evt));
  }

  _handleSortItemClick(evt) {
    this._sortPanel.getActiveMenuLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    let param = evt.target.getAttribute(`data-sort`);
    //тут должен быть вызов метода сортировки из презентера films который осуществит фильтрацию, туда передадим param
  }
}
