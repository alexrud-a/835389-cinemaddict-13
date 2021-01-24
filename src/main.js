import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import RatedFilmsPresenter from "./presenter/ratedFilms";
import CommentedFilmsPresenter from "./presenter/commentedFilms";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";
import Films from "./model/films";
import Filter from "./model/filter";
import Api from "./api.js";

const AUTHORIZATION = `Basic s9KYnCvF66Xu8tUca`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const sortType = {
  sort: `default`,
  filter: `all`,
  stats: false,
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

api.getFilms().then((films) => {
  filmsModel.setFilms(films);
})
  .catch(() => {
    filmsModel.setFilms([]);
  });

const sort = {
  watchlist: filmsModel.getFilms().filter((item) => item.isWatchlist).length,
  history: filmsModel.getFilms().filter((item) => item.isViewed).length,
  favorites: filmsModel.getFilms().filter((item) => item.isFavorite).length,
};

const filterModel = new Filter();
filterModel.setSortType(sortType.sort, sortType.filter, sortType.stats);
filterModel.setSort(sort);

const emptyPresenter = new EmptyPresenter(siteMainElement);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel, filterPresenter, FilmsPerSection.MAIN, emptyPresenter, api);

if (filmsModel.getFilms().length > 0) {
  filmsPresenter.init();
  const filmsExtraContainer = siteMainElement.querySelector(`.films`);
  const ratedFilmsPresenter = new RatedFilmsPresenter(filmsExtraContainer, filmsModel, filterModel, FilmsPerSection.RATED, api);
  const commentedFilmsPresenter = new CommentedFilmsPresenter(filmsExtraContainer, filmsModel, filterModel, FilmsPerSection.COMMENTED, api);
  ratedFilmsPresenter.init();
  commentedFilmsPresenter.init();
} else {
  emptyPresenter.init();
}

const footerPresenter = new FooterPresenter(siteFooterStatistics, filmsModel);
footerPresenter.init(filmsModel.getFilms().length);
