import {generateFilm} from "./mock/film";
import FilmsPresenter from "./presenter/films";
import EmptyPresenter from "./presenter/empty";
import FooterPresenter from "./presenter/footer";

const FILM_COUNT = 22;

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
  // if (filteredFilms.length > FILM_PER_PAGE) {
  // menu.setClickHandler((evt) => {
  //   renderedFilmsCount = FILM_PER_PAGE;
  //   let param = evt.target.getAttribute(`data-sort`);
  //   menu.getActiveMenuLink().classList.remove(`main-navigation__item--active`);
  //   evt.target.classList.add(`main-navigation__item--active`);
  //   filteredFilms = films.slice();
  //   if (filteredFilms.length > FILM_PER_PAGE) {
  //     render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
  //     renderLoadMore();
  //   }
  //   if (param !== `all`) {
  //     filteredFilms = filteredFilms.filter((film) => film[param] === true);
  //   }
  //   filmList.innerHTML = ``;
  //
  //   for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
  //     renderFilmCard(filmList, filteredFilms[i]);
  //   }
  // });

  // sort.setClickHandler((evt) => {
  //   sort.getActiveMenuLink().classList.remove(`sort__button--active`);
  //   evt.target.classList.add(`sort__button--active`);
  //   let param = evt.target.getAttribute(`data-sort`);
  //   if (filteredFilms.length > FILM_PER_PAGE) {
  //     render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
  //     renderLoadMore();
  //   }
  //   if (param !== `default`) {
  //     filteredFilms = filteredFilms.sort(compareValues(param, `desc`));
  //   } else {
  //     filteredFilms = filteredFilms.sort(compareValues(`id`, `asc`));
  //   }
  //
  //   filmList.innerHTML = ``;
  //
  //   for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
  //     renderFilmCard(filmList, filteredFilms[i]);
  //   }
  // });
  // }
} else {
  emptyPresenter.init();
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);
