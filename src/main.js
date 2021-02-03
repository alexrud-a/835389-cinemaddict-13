import SiteMenuView from "./view/menu";
import FooterStatistics from "./view/count-films";
import Stats from "./view/stats";
import ProfilePresenter from "./presenter/profile";
import FiltersPresenter from "./presenter/filters";
import FilmsBoardPresenter from "./presenter/films-board";
import FilterModel from "./model/filter";
import FilmsModel from "./model/films";
import {remove, render, RenderPosition} from "./utils";
import {FilterType, MenuItem, UpdateType} from "./const";
import Api from "./api/api";
import Store from './api/store';
import Provider from './api/provider';

import {END_POINT, AUTHORIZATION, STORE_NAME} from "./const";

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterElement = siteBody.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();

const siteMenuComponent = new SiteMenuView();

const profilePresenter = new ProfilePresenter(siteHeaderElement, filmsModel);
const filtersPresenter = new FiltersPresenter(siteMenuComponent, filterModel, filmsModel);
const filmsBoardPresenter = new FilmsBoardPresenter(siteBody, siteMainElement, filmsModel, filterModel, apiWithProvider);

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ALL:
    case MenuItem.WATCHLIST:
    case MenuItem.HISTORY:
    case MenuItem.FAVORITES:
      remove(statsComponent);
      siteMenuComponent
        .getElement()
        .querySelector(`[data-anchor=stats]`)
        .classList.remove(`main-navigation__additional--active`);
      break;
    case MenuItem.STATS:
      filmsBoardPresenter.destroy();
      filterModel.setFilter(null, FilterType.NONE);
      statsComponent = new Stats(filmsModel.getFilms());
      render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent
        .getElement()
        .querySelector(`[data-anchor=stats]`)
        .classList.add(`main-navigation__additional--active`);
      break;
  }
};

siteMenuComponent.setMenuItemClickHandler(handleSiteMenuClick);

render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);

profilePresenter.init();
filtersPresenter.init();
filmsBoardPresenter.init();

api
  .getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  })
  .finally(() => {
    render(footerStatisticsElement, new FooterStatistics(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
  });


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
