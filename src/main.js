import {generateFilm} from "./mock/film";
import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import RatedFilmsPresenter from "./presenter/ratedFilms";
import CommentedFilmsPresenter from "./presenter/commentedFilms";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";
import Films from "./model/films";
import Filter from "./model/filter";

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const sortType = {
  sort: `default`,
  filter: `all`,
  stats: false,
};

const sort = {
  watchlist: films.filter((item) => item.isWatchlist).length,
  history: films.filter((item) => item.isViewed).length,
  favorites: films.filter((item) => item.isFavorite).length,
};

const FilmsPerSection = {
  MAIN: 5,
  COMMENTED: 2,
  RATED: 2,
};

const siteBody = document.querySelector(`body`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterStatistics = siteBody.querySelector(`.footer__statistics`);

const filmsModel = new Films();
filmsModel.setFilms(films);
const filterModel = new Filter();
filterModel.setSortType(sortType.sort, sortType.filter, sortType.stats);
filterModel.setSort(sort);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel, filterPresenter, FilmsPerSection.MAIN);
const emptyPresenter = new EmptyPresenter(siteMainElement);

if (filmsModel.getFilms().length > 0) {
  filmsPresenter.init();
  const filmsExtraContainer = siteMainElement.querySelector(`.films`);
  const ratedFilmsPresenter = new RatedFilmsPresenter(filmsExtraContainer, filmsModel, filterModel, filterPresenter, FilmsPerSection.RATED);
  const commentedFilmsPresenter = new CommentedFilmsPresenter(filmsExtraContainer, filmsModel, filterModel, filterPresenter, FilmsPerSection.COMMENTED);
  ratedFilmsPresenter.init();
  commentedFilmsPresenter.init();
} else {
  emptyPresenter.init();
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);
