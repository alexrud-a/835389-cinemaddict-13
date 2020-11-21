import dayjs from "dayjs";

export const createCardFilmTemplate = (film) => {
  const {info, time, date, rating, isFavorite, isViewed, isWatchlist, genre, comments} = film;

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

  return `<article class="film-card">
          <h3 class="film-card__title">${info.title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${time}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="./images/posters/${info.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${info.description}</p>
          <a class="film-card__comments">${comments} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};
