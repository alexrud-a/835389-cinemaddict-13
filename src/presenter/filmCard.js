import {render, RenderPosition} from "../utils";
import CardFilm from "../view/film-card";
import FilmPopupPresenter from "./filmPopup";

const siteBody = document.querySelector(`body`);

export default class FilmCardPresenter {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._card = null;
  }

  init(film) {
    this._film = film;
    this._card = new CardFilm(this._film);
    this._renderCard();
  }

  _renderCard() {
    render(this._filmContainer, this._card.getElement(), RenderPosition.BEFOREEND);
    this._card.setClickHandler(() => this._showPopup());
  }

  _showPopup() {
    const popup = new FilmPopupPresenter(siteBody);
    popup.init(this._film);
  }
}
