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
import Comments from "./view/comments";

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
const menu = new SiteMenu(sortInfo);
const sort = new SortPanel();
const siteFooterStatistics = document.querySelector(`.footer__statistics`);
const loadMore = new Loadmore();

render(siteMainElement, menu.getElement(), RenderPosition.BEFOREEND);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT).getElement(), RenderPosition.BEFOREEND);

const renderFilmCard = (container, film) => {
  const card = new CardFilm(film);
  render(container, card.getElement(), RenderPosition.BEFOREEND);
  card.setClickHandler(() => showPopup(film));
};

if (filteredFilms.length > 0) {
  render(siteMainElement, sort.getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, new FilmList().getElement(), RenderPosition.BEFOREEND);

  const filmList = siteMainElement.querySelector(`.js-film-list-main`);
  const filmListRated = siteMainElement.querySelector(`.js-film-list-rated`);
  const filmListCommented = siteMainElement.querySelector(`.js-film-list-commented`);
  const filmsContainer = siteMainElement.querySelector(`.js-films-container`);
  for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    renderFilmCard(filmList, filteredFilms[i]);
  }
  for (let i = 0; i < FILM_RATED_COUNT; i++) {
    renderFilmCard(filmListRated, filmsRated()[i]);
  }

  for (let i = 0; i < FILM_RATED_COUNT; i++) {
    renderFilmCard(filmListCommented, filmsCommented()[i]);
  }

  if (filteredFilms.length > FILM_PER_PAGE) {
    let renderedFilmsCount = FILM_PER_PAGE;
    render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
    const renderLoadMore = () => {
      loadMore.setClickHandler(() => {
        loadMoreFilms();
      });
    };
    const loadMoreFilms = () => {
      filteredFilms
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
        .forEach((film) => {
          renderFilmCard(filmList, film);
        });

      renderedFilmsCount += FILM_PER_PAGE;
      if (renderedFilmsCount >= filteredFilms.length) {
        loadMore.getElement().remove();
        loadMore.removeElement();
        renderedFilmsCount = FILM_PER_PAGE;
      }
    };

    renderLoadMore();

    menu.setClickHandler((evt) => {
      renderedFilmsCount = FILM_PER_PAGE;
      let param = evt.target.getAttribute(`data-sort`);
      menu.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
      filteredFilms = films.slice();
      if (filteredFilms.length > FILM_PER_PAGE) {
        render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
        renderLoadMore();
      }
      if (param !== `all`) {
        filteredFilms = filteredFilms.filter((film) => film[param] === true);
      }
      filmList.innerHTML = ``;

      for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        renderFilmCard(filmList, filteredFilms[i]);
      }
    });

    sort.setClickHandler((evt) => {
      sort.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      let param = evt.target.getAttribute(`data-sort`);
      if (filteredFilms.length > FILM_PER_PAGE) {
        render(filmsContainer, loadMore.getElement(), RenderPosition.BEFOREEND);
        renderLoadMore();
      }
      if (param !== `default`) {
        filteredFilms = filteredFilms.sort(compareValues(param, `desc`));
      } else {
        filteredFilms = filteredFilms.sort(compareValues(`id`, `asc`));
      }

      filmList.innerHTML = ``;

      for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        renderFilmCard(filmList, filteredFilms[i]);
      }
    });
  }
} else {
  render(siteMainElement, new EmptyFilms().getElement(), RenderPosition.BEFOREEND);
}

const showPopup = (film) => {
  const filmPopup = new Popup(film);
  render(siteBody, filmPopup.getElement(), RenderPosition.BEFOREEND);
  const commentsList = new Comments(film.comments);
  const commentsContainer = filmPopup.getElement().querySelector(`.film-details__bottom-container`);
  render(commentsContainer, commentsList.getElement(), RenderPosition.BEFOREEND);
  siteBody.classList.add(`hide-overflow`);
  filmPopup.setClickHandler(() => closePopup(filmPopup));
  document.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      closePopup(filmPopup);
    }
  });
};

const closePopup = (filmPopup) => {
  filmPopup.getElement().remove();
  filmPopup.removeElement();
  siteBody.classList.remove(`hide-overflow`);
};
