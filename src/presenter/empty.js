import EmptyFilms from "../view/empty-films";
import SiteMenu from "../view/menu";
import {remove, render, RenderPosition} from "../utils";

export default class EmptyPresenter {
  constructor(emptyContainer) {
    this._emptyContainer = emptyContainer;
    this._emptyFilms = new EmptyFilms();
    this._sort = {
      watchlist: 0,
      history: 0,
      favorites: 0,
    };
    this._menu = null;
  }

  init() {
    this._menu = new SiteMenu(this._sort);
    this._renderEmpty();
  }

  _renderEmpty() {
    render(this._emptyContainer, this._menu.getElement(), RenderPosition.BEFOREEND);
    render(this._emptyContainer, this._emptyFilms.getElement(), RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._menu);
    remove(this._emptyFilms);
  }
}
