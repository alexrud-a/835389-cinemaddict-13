import SiteMenu from "./view/menu";
import SortPanel from "./view/sort-panel";
import FilmList from "./view/films-list";
import FooterStatistics from "./view/count-films";
import CardFilm from "./view/film-card";
import Loadmore from "./view/loadmore";
import Popup from "./view/popup";
import EmptyFilms from "./view/empty-films";
import {generateFilm} from "./mock/film";
import {render, compareValues} from "./utils.js";

const FILM_COUNT = 48;
const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

let filteredFilms = films.slice().sort(compareValues(`id`, `asc`));

const filmsRated = () => {
  return filteredFilms.sort(compareValues(`rating`, `desc`)).slice(0, FILM_RATED_COUNT);
};

const filmsCommented = () => {
  return filteredFilms.sort(compareValues(`comments`, `desc`)).slice(0, FILM_RATED_COUNT);
};

const sortInfo = {
  watchlist: filteredFilms.filter((item) => item.isWatchlist),
  history: filteredFilms.filter((item) => item.isViewed),
  favorites: filteredFilms.filter((item) => item.isFavorite),
};


const siteBody = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatistics = document.querySelector(`.footer__statistics`);

render(siteMainElement, new SiteMenu(sortInfo).getElement(), `beforeend`);
render(siteMainElement, new SortPanel().getElement(), `beforeend`);
render(siteMainElement, new FilmList().getElement(), `beforeend`);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT).getElement(), `beforeend`);

const filmList = siteMainElement.querySelector(`.js-film-list-main`);
const filmListRated = siteMainElement.querySelector(`.js-film-list-rated`);
const filmListCommented = siteMainElement.querySelector(`.js-film-list-commented`);
const filmsContainer = siteMainElement.querySelector(`.js-films-container`);

if (filteredFilms.length > 0) {
  for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    render(filmList, new CardFilm(filteredFilms[i]).getElement(), `beforeend`);
  }
} else {
  render(filmList, new EmptyFilms().getElement(), `beforeend`);
}

if (filteredFilms.length > FILM_PER_PAGE) {
  let renderedFilmsCount = FILM_PER_PAGE;
  render(filmsContainer, new Loadmore().getElement(), `beforeend`);
  const loadMoreButton = filmsContainer.querySelector(`.js-loadmore`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filteredFilms
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
      .forEach((film) => render(filmList, new CardFilm(film).getElement(), `beforeend`));

    renderedFilmsCount += FILM_PER_PAGE;
    if (renderedFilmsCount >= filteredFilms.length) {
      loadMoreButton.style.display = `none`;
      renderedFilmsCount = FILM_PER_PAGE;
    }
  });
  const filterBtns = siteMainElement.querySelectorAll(`.main-navigation__item`);

  for (let btn of filterBtns) {
    btn.addEventListener(`click`, function (evt) {
      evt.preventDefault();

      renderedFilmsCount = FILM_PER_PAGE;
      let param = btn.getAttribute(`data-sort`);
      document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      btn.classList.add(`main-navigation__item--active`);
      filteredFilms = films.slice();
      if (filteredFilms.length > FILM_PER_PAGE) {
        loadMoreButton.style.display = `block`;
      }
      if (param !== `all`) {
        filteredFilms = filteredFilms.filter((film) => film[param] === true);
      }
      filmList.innerHTML = ``;

      for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        render(filmList, new CardFilm(filteredFilms[i]).getElement(), `beforeend`);
      }
    });
  }

  const sortedBtns = siteMainElement.querySelectorAll(`.sort__button`);

  for (let btn of sortedBtns) {
    btn.addEventListener(`click`, function (evt) {
      evt.preventDefault();

      document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      btn.classList.add(`sort__button--active`);
      let param = btn.getAttribute(`data-sort`);
      if (filteredFilms.length > FILM_PER_PAGE) {
        loadMoreButton.style.display = `block`;
      }
      if (param !== `default`) {
        filteredFilms = filteredFilms.sort(compareValues(param, `desc`));
      } else {
        filteredFilms = filteredFilms.sort(compareValues(`id`, `asc`));
      }

      filmList.innerHTML = ``;

      for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        render(filmList, new CardFilm(filteredFilms[i]).getElement(), `beforeend`);
      }
    });
  }
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  render(filmListRated, new CardFilm(filmsRated()[i]).getElement(), `beforeend`);
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  render(filmListCommented, new CardFilm(filmsCommented()[i]).getElement(), `beforeend`);
}

siteBody.addEventListener(`click`, function (event) {
  let target = event.target;
  if (target.classList.contains(`js-open-popup`) === true) {
    showpopup(target.closest(`.film-card`).getAttribute(`id`));
  }
});

const showpopup = (id) => {
  let film = films.filter((item) => item.id === id)[0];
  render(siteBody, new Popup(film).getElement(), `beforeend`);
  siteBody.classList.add(`hide-overflow`);
};

siteBody.addEventListener(`click`, (event) => {
  let target = event.target;
  if (target.classList.contains(`film-details__close-btn`) === true) {
    document.querySelector(`.film-details`).remove();
    siteBody.classList.remove(`hide-overflow`);
  }
});
