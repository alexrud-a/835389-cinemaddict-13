import AbstractView from "./abstract";

const createLoadingTemplate = () => {
  return `<h2 className="films-list__title">Loading...</h2>`;
};

export default class Loading extends AbstractView {

  getTemplate() {
    return createLoadingTemplate();
  }
}
