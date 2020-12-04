import AbstractView from "./abstract";

const createLoadmoreTemplate = () => {
  return `<button class="films-list__show-more js-loadmore">Show more</button>`;
};

export default class Loadmore extends AbstractView {

  getTemplate() {
    return createLoadmoreTemplate();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
