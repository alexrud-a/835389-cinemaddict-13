import SiteMenu from "../view/menu";
import {render, RenderPosition} from "../utils";

export default class MenuPresenter {
  constructor(menuContainer) {
    this._menuContainer = menuContainer;
    this._sortInfo = null;
    this._menu = null;
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
  }

  init(sortInfo) {
    this._sortInfo = sortInfo;
    this._menu = new SiteMenu(this._sortInfo);
    this._renderMenu();
  }

  _renderMenu() {
    render(this._menuContainer, this._menu.getElement(), RenderPosition.BEFOREEND);
    this._menu.setClickHandler((evt) => this._handleFilterItemClick(evt));
  }

  _handleFilterItemClick(evt) {
    let param = evt.target.getAttribute(`data-sort`);
    this._menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    //тут должен быть вызов метода фильтрации из презентера films который осуществит фильтрацию, туда передадим param
  }
}
