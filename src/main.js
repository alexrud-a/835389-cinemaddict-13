import {generateFilm} from "./mock/film";
import FilmsPresenter from "./presenter/films";
import RatedFilmsPresenter from "./presenter/ratedFilms";
import CommentedFilmsPresenter from "./presenter/commentedFilms";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";
import Films from "./model/films";

const FILM_COUNT = 22;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteBody = document.querySelector(`body`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterStatistics = siteBody.querySelector(`.footer__statistics`);

const filmsModel = new Films();
filmsModel.setFilms(films);

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);
const emptyPresenter = new EmptyPresenter(siteMainElement);

if (films.length > 0) {
  filmsPresenter.init();
  const ratedFilmsPresenter = new RatedFilmsPresenter(siteMainElement, filmsModel);
  const commentedFilmsPresenter = new CommentedFilmsPresenter(siteMainElement, filmsModel);
  ratedFilmsPresenter.init();
  commentedFilmsPresenter.init();
} else {
  emptyPresenter.init();
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);
