import Smart from "./smart";

const createFilmListTemplate = () => {
  return `<section class="films">
    <section class="films-list js-films-container">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container js-film-list-main">
      </div>

    </section>

  </section>`;
};

export default class FilmList extends Smart {
  getTemplate() {
    return createFilmListTemplate();
  }
}
