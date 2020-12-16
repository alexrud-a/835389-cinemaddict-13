import Popup from "../view/popup";
import Comments from "../view/comments";
import {render, RenderPosition} from "../utils";

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
    this._popup.setEditClickHandler((evt) => this._clickFilmInfo(evt));

    if (prevPopup) {
      prevPopup.getElement().remove();
      prevPopup.removeElement();
    }

    this._renderPopup();
  }

  _renderPopup() {
    render(this._container, this._popup.getElement(), RenderPosition.BEFOREEND);
    const commentsList = new Comments(this._film.comments);
    render(this._popup.getCommentsContainer(), commentsList.getElement(), RenderPosition.BEFOREEND);
    this._container.classList.add(`hide-overflow`);
    this._popup.setClickHandler(() => this.close());
    this._popup.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    document.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        this.close();
      }
    });
  }

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }

  close() {
    this._popup.getElement().remove();
    this._popup.removeElement();
    this._container.classList.remove(`hide-overflow`);
  }
}
