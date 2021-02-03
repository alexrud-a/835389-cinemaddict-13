import dayjs from "dayjs";
import Base from "./view/abstract";
import {FilterType} from "./const";
import isBetween from "dayjs/plugin/isBetween";
import {StatsFilterType} from "./const";

dayjs.extend(isBetween);

export const capitilizeString = (string) => {
  return string
    .split(` `)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(` `);
};

export const getDuration = (minutes) => {
  const date1 = dayjs();
  const date2 = date1.add(minutes, `minute`);

  const hours = date2.diff(date1, `hour`);
  const mins = date2.subtract(hours, `hour`).diff(date1, `minute`);

  return {
    hours,
    mins,
  };
};

export const isOnline = () => {
  return window.navigator.onLine;
};

export const sortFilmDateDown = (filmA, filmB) => {
  const dateA = dayjs(filmA.releaseDate);
  const dateB = dayjs(filmB.releaseDate);

  return dateB.diff(dateA);
};

export const sortFilmRatingDown = (filmA, filmB) => {
  return filmB.totalRating - filmA.totalRating;
};

export const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const renderTemplate = (container, template, place) => {
  if (container instanceof Base) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const render = (container, child, place) => {
  if (container instanceof Base) {
    container = container.getElement();
  }

  if (child instanceof Base) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Base)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
  if (newChild instanceof Base) {
    newChild = newChild.getElement();
  }

  if (oldChild instanceof Base) {
    oldChild = oldChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (!parent || !newChild || !oldChild) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const countFilmsByGenres = (films) => {
  const genres = films.map((film) => [...film.genres]).flat();
  const uniqGenres = [...new Set(genres)];
  const result = {};

  uniqGenres.forEach((genre) => {
    const total = films.reduce((counter, film) => {
      const isExist = film.genres.includes(genre);
      return isExist ? counter + 1 : counter;
    }, 0);

    result[genre] = total;
  });

  return result;
};

export const filterWatchedFilmsInDateRange = (films, dateFrom, dateTo) => {
  return films.filter((film) => {
    if (!film.watchingDate) {
      return false;
    }

    if (
      dayjs(film.watchingDate).isSame(dateFrom) ||
      dayjs(film.watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(film.watchingDate).isSame(dateTo)
    ) {
      return true;
    }

    return false;
  });
};

export const filterInRange = {
  [StatsFilterType.ALL_TIME]: (films) => films.filter((film) => film.isWatched),
  [StatsFilterType.TODAY]: (films) =>
    filterWatchedFilmsInDateRange(films, dayjs().startOf(`day`).toDate(), dayjs().toDate()),
  [StatsFilterType.WEEK]: (films) =>
    filterWatchedFilmsInDateRange(films, dayjs().subtract(1, `week`).toDate(), dayjs().toDate()),
  [StatsFilterType.MONTH]: (films) =>
    filterWatchedFilmsInDateRange(films, dayjs().subtract(1, `month`).toDate(), dayjs().toDate()),
  [StatsFilterType.YEAR]: (films) =>
    filterWatchedFilmsInDateRange(films, dayjs().subtract(1, `year`).toDate(), dayjs().toDate()),
};
