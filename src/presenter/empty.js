import EmptyFilms from "../view/empty-films";
import {remove, render, RenderPosition} from "../utils";

export default class EmptyPresenter {
  constructor(emptyContainer) {
    this._emptyContainer = emptyContainer;
    this._emptyFilms = new EmptyFilms();
  }

  init() {
    this._renderEmpty();
  }

  _renderEmpty() {
    render(this._emptyContainer, this._emptyFilms.getElement(), RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._emptyFilms);
  }
}
