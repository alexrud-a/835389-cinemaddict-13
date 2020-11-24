import {createMenuTemplate} from "./view/menu";
import {createSortPanelTemplate} from "./view/sort-panel";
import {createFilmListTemplate} from "./view/films-list";
import {createFooterStatisticsTemplate} from "./view/count-films";
import {createCardFilmTemplate} from "./view/film-card";
import {generateFilm} from "./mock/film";
import {createLoadmoreTemplate} from "./view/loadmore";
import {createTemplatePopupFilm} from "./view/popup";

const FILM_COUNT = 48;
const FILM_PER_PAGE = 5;
const FILM_RATED_CONT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const compareValues = (key, order) => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === `string`)
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === `string`)
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === `desc`) ? (comparison * -1) : comparison
    );
  };
};

let filteredFilms = films.sort(compareValues(`id`, `asc`));

const filmsRated = () => {
  return films.sort(compareValues(`rating`, `desc`)).slice(0,FILM_RATED_CONT);
};

const filmsCommented = () => {
  return films.sort(compareValues(`comments`, `desc`)).slice(0,FILM_RATED_CONT);
};

const filmsInfoSort = () => {
  const filmsInfo = {
    watchlist: films.filter((item) => item.isWatchlist === true),
    history: films.filter((item) => item.isViewed === true),
    favorites: films.filter((item) => item.isFavorite === true),
  };

  return filmsInfo;
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBody = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatistics = document.querySelector(`.footer__statistics`);

render(siteMainElement, createMenuTemplate(filmsInfoSort()), `beforeend`);
render(siteMainElement, createSortPanelTemplate(), `beforeend`);
render(siteMainElement, createFilmListTemplate(), `beforeend`);
render(siteFooterStatistics, createFooterStatisticsTemplate(FILM_COUNT), `beforeend`);

const filmList = siteMainElement.querySelector(`.js-film-list-main`);
const filmListRated = siteMainElement.querySelector(`.js-film-list-rated`);
const filmListCommented = siteMainElement.querySelector(`.js-film-list-commented`);
const filmsContainer = siteMainElement.querySelector(`.js-films-container`);

render(filmList, createCardFilmTemplate(filteredFilms[0]), `beforeend`);

for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
  render(filmList, createCardFilmTemplate(films[i]), `beforeend`);
}

if (filteredFilms.length > FILM_PER_PAGE) {
  let renderedFilmsCount = FILM_PER_PAGE;
  render(filmsContainer, createLoadmoreTemplate(), `beforeend`);
  const loadMoreButton = filmsContainer.querySelector(`.js-loadmore`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filteredFilms
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
      .forEach((film) => render(filmList, createCardFilmTemplate(film), `beforeend`));

    renderedFilmsCount += FILM_PER_PAGE;
    if (renderedFilmsCount >= filteredFilms.length) {
      loadMoreButton.style.display = `none`;
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
      filteredFilms = films;
      if (filteredFilms.length > FILM_PER_PAGE) {
        loadMoreButton.style.display = `block`;
      }
      if (param !== `all`) {
        filteredFilms = filteredFilms.filter((film) => film[param] === true);
      }
      filmList.innerHTML = ``;

      render(filmList, createCardFilmTemplate(filteredFilms[0]), `beforeend`);

      for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        render(filmList, createCardFilmTemplate(filteredFilms[i]), `beforeend`);
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

      render(filmList, createCardFilmTemplate(filteredFilms[0]), `beforeend`);

      for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        render(filmList, createCardFilmTemplate(filteredFilms[i]), `beforeend`);
      }
    });
  }
}

for (let i = 0; i < FILM_RATED_CONT; i++) {
  render(filmListRated, createCardFilmTemplate(filmsRated()[i]), `beforeend`);
}

for (let i = 0; i < FILM_RATED_CONT; i++) {
  render(filmListCommented, createCardFilmTemplate(filmsCommented()[i]), `beforeend`);
}

siteBody.addEventListener(`click`, function (event) {
  let target = event.target;
  if (target.classList.contains(`js-open-popup`) === true) {
    showpopup(target.closest(`.film-card`).getAttribute(`id`));
  }
});

const showpopup = (id) => {
  let film = films.filter((item) => item.id === id)[0];
  render(siteBody, createTemplatePopupFilm(film), `beforeend`);
};

siteBody.addEventListener(`click`, (event) => {
  let target = event.target;
  if (target.classList.contains(`film-details__close-btn`) === true) {
    document.querySelector(`.film-details`).remove();
  }
});
