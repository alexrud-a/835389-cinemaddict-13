import {generateFilm} from "./mock/film";
import FilmsPresenter from "./presenter/films";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";

const FILM_COUNT = 0;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const sortInfo = {
  watchlist: films.filter((item) => item.isWatchlist).length,
  history: films.filter((item) => item.isViewed).length,
  favorites: films.filter((item) => item.isFavorite).length,
};


const siteBody = document.querySelector(`body`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterStatistics = siteBody.querySelector(`.footer__statistics`);

const filmsPresenter = new FilmsPresenter(siteMainElement);
const emptyPresenter = new EmptyPresenter(siteMainElement);


if (films.length > 0) {
  filmsPresenter.init(films, sortInfo);
} else {
  emptyPresenter.init(sortInfo);
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);
