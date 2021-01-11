import {generateFilm} from "./mock/film";
import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import RatedFilmsPresenter from "./presenter/ratedFilms";
import CommentedFilmsPresenter from "./presenter/commentedFilms";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";
import Films from "./model/films";
import Filter from "./model/filter";

const FILM_COUNT = 22;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const sortType = {
  sort: `default`,
  filter: `all`,
};

const sort = {
  watchlist: films.filter((item) => item.isWatchlist).length,
  history: films.filter((item) => item.isViewed).length,
  favorites: films.filter((item) => item.isFavorite).length,
};

const siteBody = document.querySelector(`body`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterStatistics = siteBody.querySelector(`.footer__statistics`);

const filmsModel = new Films();
filmsModel.setFilms(films);
const filterModel = new Filter();
filterModel.setSortType(sortType.sort, sortType.filter);
filterModel.setSort(sort);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel, filterPresenter);
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
