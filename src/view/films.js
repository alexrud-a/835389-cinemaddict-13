import Base from "./abstract";

const createFilmsTemplate = () => {
  return `<section class="films"></section>`;
};

export default class Films extends Base {
  getTemplate() {
    return createFilmsTemplate();
  }
}
