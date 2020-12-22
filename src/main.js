import {generateFilm} from "./mock/film";
import FilmsPresenter from "./presenter/films";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";

const FILM_COUNT = 22;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteBody = document.querySelector(`body`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterStatistics = siteBody.querySelector(`.footer__statistics`);

const filmsPresenter = new FilmsPresenter(siteMainElement);
const emptyPresenter = new EmptyPresenter(siteMainElement);


if (films.length > 0) {
  filmsPresenter.init(films);
} else {
  emptyPresenter.init();
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);
