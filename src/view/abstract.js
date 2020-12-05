import {createElement} from "../utils";

export default class Base {
  constructor() {
    if (new.target === Base) {
      throw new Error(`Can't instantiate ${Base.name}, only concrete one.`);
    }
    this._callback = {};
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: ${this.getTemplate.name}`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
