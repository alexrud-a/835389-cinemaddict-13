import Popup from "../view/popup";
import Comments from "../view/comments";
import {remove, render, RenderPosition, replace} from "../utils";

export default class FilmPopupPresenter {
  constructor(container, changeData) {
    this._container = container;
    this._film = null;
    this._popup = null;
    this._changeData = changeData;
  }

  init(film) {
    this._film = film;

    const prevPopup = this._popup;
    this._popup = new Popup(this._film);

    if (prevPopup && this._container.classList.contains(`hide-overflow`)) {
      replace(this._popup, prevPopup);
      this._container.classList.add(`hide-overflow`);
      this._callbacks();
      this._renderComments();
      this._popup.restoreHandlers();
    } else {
      this._renderPopup();
      return;
    }

    remove(prevPopup);
  }

  _renderPopup() {
    render(this._container, this._popup.getElement(), RenderPosition.BEFOREEND);
    this._container.classList.add(`hide-overflow`);
    this._callbacks();
    this._renderComments();
  }

  _callbacks() {
    this._popup.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    this._popup.setClickHandler(() => this.close());
    document.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        this.close();
      }
    });
  }

  _renderComments() {
    const commentsList = new Comments(this._film.comments);
    render(this._popup.getCommentsContainer(), commentsList.getElement(), RenderPosition.BEFOREEND);
  }

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }

  close() {
    remove(this._popup);
    this._container.classList.remove(`hide-overflow`);
  }
}
