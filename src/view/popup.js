import dayjs from "dayjs";
import Smart from "./smart";

const createGenresTemplate = (genre) => {
  return genre.map((item) => `<span class="film-details__genre">${item}</span>`).join(``);
};

const createTemplatePopupFilm = (film) => {
  const {info, time, date, rating, age, isFavorite, isViewed, isWatchlist, description, regisseur, screenwriters, actors, country, genre} = film;
  const fullDate = dayjs(date).format(`DD MMMM YYYY`);
  const watchlistCheck = isWatchlist
    ? `checked`
    : ``;

  const watchedCheck = isViewed
    ? `checked`
    : ``;

  const favoriteCheck = isFavorite
    ? `checked`
    : ``;
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${info.poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${info.title}</h3>
              <p class="film-details__title-original">Original: ${info.originTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${regisseur}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriters.map((item) => item).join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.map((item) => item).join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${fullDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${time}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${createGenresTemplate(genre)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" data-type="isWatchlist" ${watchlistCheck}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" data-type="isViewed" ${watchedCheck}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" data-type="isFavorite" ${favoriteCheck}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
    </div>
  </form>
</section>`;
};

export default class Popup extends Smart {
  constructor(film) {
    super();
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._film = film;
    this._data = Popup.parseFilmToData(film);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createTemplatePopupFilm(this._film);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setEditClickHandler(this._callback.editClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
    for (let control of this.getElement().querySelectorAll(`.film-details__control-input`)) {
      control.addEventListener(`change`, this._editClickHandler);
    }
  }

  getCommentsContainer() {
    return super.getElement().querySelector(`.film-details__bottom-container`);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    let type = evt.target.getAttribute(`data-type`);
    this._callback.editClick(evt, Popup.parseDataToFilm(this._data));
    this.updateData({
      [type]: !this._film[type]
    });
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    for (let control of this.getElement().querySelectorAll(`.film-details__control-input`)) {
      control.addEventListener(`change`, this._editClickHandler);
    }
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      isFavorite: film.isFavorite,
      isViewed: film.isViewed,
      isWatchlist: film.isWatchlist,
    });
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.isFavorite;
    delete data.isWatchlist;
    delete data.isViewed;

    return data;
  }
}

