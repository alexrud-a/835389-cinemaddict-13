import {createElement} from "../utils";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Base {
  constructor() {
    if (new.target === Base) {
      throw new Error(`Can't instantiate ${Base.name}, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
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

  shake(callback, element) {
    if (!element) {
      element = this.getElement();
    }

    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
