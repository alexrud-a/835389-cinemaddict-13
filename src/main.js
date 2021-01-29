import FilterPresenter from "./presenter/filter";
import FilmsPresenter from "./presenter/films";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";
import Films from "./model/films";
import Filter from "./model/filter";
import Api from "./api/api.js";
import Store from './api/store';
import Provider from './api/provider';

const AUTHORIZATION = `Basic s9KYnCvF66Xu8tUca`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

import {FilmsPerSection, sortType} from "./utils";

const siteBody = document.querySelector(`body`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterStatistics = siteBody.querySelector(`.footer__statistics`);

const filmsModel = new Films();

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
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, filterModel, filterPresenter, FilmsPerSection.MAIN, emptyPresenter, apiWithProvider);

api.getFilms().then((films) => {
  filmsModel.setFilms(films);
  filmsPresenter.init();
})
  .catch(() => {
    filmsModel.setFilms([]);
    filmsPresenter.init();
  });

const footerPresenter = new FooterPresenter(siteFooterStatistics, filmsModel);
footerPresenter.init(filmsModel.getFilms().length);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
