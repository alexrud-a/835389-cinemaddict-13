import AbstractView from "./abstract";

const createEmptyFilmsTemplate = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`;
};

export default class EmptyFilms extends AbstractView {

  getTemplate() {
    return createEmptyFilmsTemplate();
  }
}
