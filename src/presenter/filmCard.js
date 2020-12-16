import {render, RenderPosition} from "../utils";
import CardFilm from "../view/film-card";

export default class FilmCardPresenter {
  constructor(filmContainer, changeData, showPopup) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._card = null;
    this._changeData = changeData;
    this._showPopup = showPopup;
  }

  init(film) {
    this._film = film;

    const prevCard = this._card;
    this._card = new CardFilm(this._film);
    this._card.setClickHandler(() => this._showPopup(this._film));
    this._card.setEditClickHandler((evt) => this._clickFilmInfo(evt));

    if (prevCard) {
      prevCard.getElement().remove();
      prevCard.removeElement();
    }

    this._renderCard();
  }

  _renderCard() {
    render(this._filmContainer, this._card.getElement(), RenderPosition.BEFOREEND);
  }

  _clickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}));
  }
}
