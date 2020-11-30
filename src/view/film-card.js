import dayjs from "dayjs";
import AbstractView from "./abstract";

const createCardFilmTemplate = (film) => {
  const {id, info, time, date, rating, isFavorite, isViewed, isWatchlist, genre, comments, description} = film;

  const year = dayjs(date).format(`YYYY`);

  const watchlistClassName = isWatchlist
    ? `film-card__controls-item--active`
    : ``;

  const watchedClassName = isViewed
    ? `film-card__controls-item--active`
    : ``;

  const favoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  const sliceDescription = () => {
    let slicedDescription;
    if (description.length > 140) {
      slicedDescription = description.slice(0, 139) + `...`;
    } else {
      slicedDescription = description;
    }
    return slicedDescription;
  };
  return `<article class="film-card" id="${id}">
          <h3 class="js-open-popup film-card__title">${info.title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${time}</span>
            <span class="film-card__genre">${genre[0]}</span>
          </p>
          <img src="./images/posters/${info.poster}" alt="" class="js-open-popup film-card__poster">
          <p class="film-card__description">${sliceDescription()}</p>
          <a class="js-open-popup film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class CardFilm extends AbstractView {
  constructor(film) {
    super();
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return createCardFilmTemplate(this._film);
  }
}
