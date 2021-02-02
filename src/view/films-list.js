import Base from "./abstract";

const createFilmListTemplate = (title, isExtra = false, isTitleHidden = false) => {
  return `<section class="films-list ${isExtra ? `films-list--extra` : ``}">
    <h2 class="films-list__title ${isTitleHidden ? `visually-hidden` : ``}">${title}</h2>
    <div class="films-list__container"></div>
  </section>`;
};

export default class FilmsList extends Base {
  constructor({title, isExtra = false, isTitleHidden = false}) {
    super();

    this._title = title;
    this._isExtra = isExtra;
    this._isTitleHidden = isTitleHidden;
    this._container = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._title, this._isExtra, this._isTitleHidden);
  }

  getContainer() {
    if (!this._container) {
      this._container = this.getElement().querySelector(`.films-list__container`);
    }

    return this._container;
  }
}
