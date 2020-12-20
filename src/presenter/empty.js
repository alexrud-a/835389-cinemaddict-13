import EmptyFilms from "../view/empty-films";
import SiteMenu from "../view/menu";
import {render, RenderPosition} from "../utils";

export default class EmptyPresenter {
  constructor(emptyContainer) {
    this._emptyContainer = emptyContainer;
    this._emptyFilms = new EmptyFilms();
    this._sort = null;
    this._menu = null;
  }

  init(sort) {
    this._sort = sort;
    this._menu = new SiteMenu(this._sort);
    this._renderEmpty();
  }

  _renderEmpty() {
    render(this._emptyContainer, this._menu.getElement(), RenderPosition.BEFOREEND);
    render(this._emptyContainer, this._emptyFilms.getElement(), RenderPosition.BEFOREEND);
  }
}
