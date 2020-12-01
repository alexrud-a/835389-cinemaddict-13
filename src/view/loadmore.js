import AbstractView from "./abstract";

const createLoadmoreTemplate = () => {
  return `<button class="films-list__show-more js-loadmore">Show more</button>`;
};

export default class Loadmore extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createLoadmoreTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
