import SiteMenu from "./view/menu";
import SortPanel from "./view/sort-panel";
import FilmList from "./view/films-list";
import FooterStatistics from "./view/count-films";
import CardFilm from "./view/film-card";
import Loadmore from "./view/loadmore";
import Popup from "./view/popup";
import EmptyFilms from "./view/empty-films";
import {generateFilm} from "./mock/film";
import {render, RenderPosition, compareValues} from "./utils.js";

const FILM_COUNT = 22;
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
const loadMore = new Loadmore();

render(siteMainElement, new SiteMenu(sortInfo).getElement(), RenderPosition.BEFOREEND);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT).getElement(), RenderPosition.BEFOREEND);

if (filteredFilms.length > 0) {
  render(siteMainElement, new SortPanel().getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, new FilmList().getElement(), RenderPosition.BEFOREEND);

  const filmList = siteMainElement.querySelector(`.js-film-list-main`);
  const filmListRated = siteMainElement.querySelector(`.js-film-list-rated`);
  const filmListCommented = siteMainElement.querySelector(`.js-film-list-commented`);
  const filmsContainer = siteMainElement.querySelector(`.js-films-container`);
  for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    const card = new CardFilm(filteredFilms[i]);
    render(filmList, card.getElement(), RenderPosition.BEFOREEND);
  }
  for (let i = 0; i < FILM_RATED_COUNT; i++) {
    const card = new CardFilm(filmsRated()[i]);
    render(filmListRated, card.getElement(), RenderPosition.BEFOREEND);
  }

  for (let i = 0; i < FILM_RATED_COUNT; i++) {
    const card = new CardFilm(filmsCommented()[i]);
    render(filmListCommented, card.getElement(), RenderPosition.BEFOREEND);
  }

  if (filteredFilms.length > FILM_PER_PAGE) {
    render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
    let renderedFilmsCount = FILM_PER_PAGE;
    const loadMoreFilms = () => {
      filteredFilms
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
        .forEach((film) => render(filmList, new CardFilm(film).getElement(), RenderPosition.BEFOREEND));

      renderedFilmsCount += FILM_PER_PAGE;
      if (renderedFilmsCount >= filteredFilms.length) {
        loadMore.getElement().remove();
        loadMore.removeElement();
        renderedFilmsCount = FILM_PER_PAGE;
      }
    };
    loadMore.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      loadMoreFilms();
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
          render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
        }
        if (param !== `all`) {
          filteredFilms = filteredFilms.filter((film) => film[param] === true);
        }
        filmList.innerHTML = ``;

        for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
          render(filmList, new CardFilm(filteredFilms[i]).getElement(), RenderPosition.BEFOREEND);
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
          render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
        }
        if (param !== `default`) {
          filteredFilms = filteredFilms.sort(compareValues(param, `desc`));
        } else {
          filteredFilms = filteredFilms.sort(compareValues(`id`, `asc`));
        }

        filmList.innerHTML = ``;

        for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
          const card = new CardFilm(filteredFilms[i]);
          render(filmList, card.getElement(), RenderPosition.BEFOREEND);
        }
      });
    }
  }
} else {
  render(siteMainElement, new EmptyFilms().getElement(), RenderPosition.BEFOREEND);
}

const showPopup = (id) => {
  let film = films.filter((item) => item.id === id)[0];
  const filmPopup = new Popup(film);
  render(siteBody, filmPopup.getElement(), RenderPosition.BEFOREEND);
  siteBody.classList.add(`hide-overflow`);
  filmPopup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, function (evt) {
    evt.preventDefault();
    closePopup(filmPopup);
  });
};

siteBody.addEventListener(`click`, function (event) {
  let target = event.target;
  if (target.classList.contains(`js-open-popup`) === true) {
    showPopup(target.closest(`.film-card`).getAttribute(`id`));
  }
});

const closePopup = (filmPopup) => {
  filmPopup.getElement().remove();
  filmPopup.removeElement();
  siteBody.classList.remove(`hide-overflow`);
};
