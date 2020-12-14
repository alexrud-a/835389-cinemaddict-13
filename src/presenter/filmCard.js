import {render, RenderPosition} from "../utils";
import CardFilm from "../view/film-card";
import FilmPopupPresenter from "./filmPopup";

const siteBody = document.querySelector(`body`);

export default class FilmCardPresenter {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._card = null;
    this._popup = new FilmPopupPresenter(siteBody);
    this._changeData = changeData;
  }

  init(film) {
    this._film = film;

    const prevCard = this._card;
    this._card = new CardFilm(this._film);
    this._card.setClickHandler(() => this._showPopup());
    this._card.setEditClickHandler((evt) => this._clickFilmInfo(evt));

    if (prevCard === null) {
      this._renderCard();
      return;
    }

    prevCard.getElement().remove();
    prevCard.removeElement();
  }

  _renderCard() {
    render(this._filmContainer, this._card.getElement(), RenderPosition.BEFOREEND);
  }

  _showPopup() {
    this._popup.init(this._film);
  }

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }
}
