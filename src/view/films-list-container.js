import Base from "./abstract";

const createFilmListTemplate = () => {
  return `<div class="films-list__container"></div>`;
};

export default class FilmsListContainer extends Base {
  getTemplate() {
    return createFilmListTemplate();
  }
}
