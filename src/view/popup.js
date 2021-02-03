import dayjs from "dayjs";
import he from "he";
import Smart from "./smart";
import {createCommentTemplate} from "./comment-item";
import {capitilizeString, getDuration} from "../utils";

const DEFAULT_LOCAL_COMMENT = {
  comment: ``,
  emoji: null,
};

const COMMENT_ID_ATRIBUTE = `data-comment-id`;

const generateGenreList = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
};

const createFilmDetailsTemplate = (film) => {
  const {
    title,
    originalTitle,
    totalRating,
    releaseDate,
    runtime,
    genres,
    posterUrl,
    ageRating,
    desc,
    comments,
    localComment,
    director,
    writers,
    actors,
    country,
    isWatchList,
    isWatched,
    isFavorite,
    isDisabled,
    deletingId,
  } = film;

  const {comment, emoji} = localComment;

  const commentsList = comments
    .sort((a, b) => {
      const date1 = dayjs(a.date);
      const date2 = dayjs(b.date);

      return date1.diff(date2);
    })
    .map((commentItem) => createCommentTemplate(commentItem, commentItem.id === deletingId))
    .join(``);

  const {hours, mins} = getDuration(runtime);
  const duration = `${hours}h ${mins}m`;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${posterUrl} alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${capitilizeString(title)}</h3>
                <p class="film-details__title-original">Original: ${capitilizeString(originalTitle)}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`,`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`,`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(releaseDate).format(`D MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${generateGenreList(genres)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${desc}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" data-type="isWatchList" ${
  isWatchList ? `checked` : ``
}>
           <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" data-type="isWatched" ${
  isWatched ? `checked` : ``
}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" data-type="isFavorite" ${
  isFavorite ? `checked` : ``
}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">
            Comments <span class="film-details__comments-count">${comments.length}</span>
          </h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}" />` : ``}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${
  isDisabled ? `disabled` : ``
}>${he.encode(comment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${
  emoji === `smile` ? `checked` : ``
} ${isDisabled ? `disabled` : ``}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${
  emoji === `sleeping` ? `checked` : ``
} ${isDisabled ? `disabled` : ``}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${
  emoji === `puke` ? `checked` : ``
} ${isDisabled ? `disabled` : ``}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"  ${
  emoji === `angry` ? `checked` : ``
} ${isDisabled ? `disabled` : ``}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends Smart {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);

    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._changeCommentEmojiHandler = this._changeCommentEmojiHandler.bind(this);
    this._inputCommentHandler = this._inputCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      localComment: DEFAULT_LOCAL_COMMENT,
      isDisabled: false,
      deletingId: null,
    });
  }

  static parseDataToCreateComment(data) {
    return {
      filmId: data.id,
      comment: Object.assign({}, data.localComment, {
        date: dayjs().toDate(),
      }),
    };
  }

  _getCloseBtnElement() {
    return this.getElement().querySelector(`.film-details__close-btn`);
  }

  _getCommentListElement() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  _changeCommentEmojiHandler(evt) {
    evt.preventDefault();

    this.updateData({
      localComment: Object.assign({}, this._data.localComment, {emoji: evt.target.value}),
    });
  }

  _inputCommentHandler(evt) {
    evt.preventDefault();

    this.updateData(
        {
          localComment: Object.assign({}, this._data.localComment, {comment: evt.target.value}),
        },
        true
    );
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.onCloseClick();
  }

  _formSubmitHandler() {
    if (this._data.isDisabled) {
      return;
    }

    const {comment, emoji} = this._data.localComment;
    if (!comment || !emoji) {
      return;
    }

    const update = Popup.parseDataToCreateComment(this._data);
    this._callback.formSubmit(update);
  }

  _documentKeyDownHandler(evt) {
    if (evt.key === `Enter` && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this._formSubmitHandler();
    }
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `BUTTON` && evt.target.textContent !== `Delete`) {
      return;
    }

    this._callback.deleteCommentClick(evt.target.dataset.commentId);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.film-details__emoji-item`)
      .forEach((item) => item.addEventListener(`change`, this._changeCommentEmojiHandler));

    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._inputCommentHandler);

    for (const control of this.getElement().querySelectorAll(`.film-details__control-input`)) {
      control.addEventListener(`change`, this._editClickHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseClickHandler(this._callback.onCloseClick);
    this.setEditClickHandler(this._callback.editClick);
    this.setCommentDeleteHandler(this._callback.deleteCommentClick);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data);
  }

  removeElement() {
    this._element = null;
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);
  }

  getCommentItemById(id) {
    const listChildren = this._getCommentListElement().children;
    const items = [...listChildren];
    return items.find((item) => item.querySelector(`[${COMMENT_ID_ATRIBUTE}="${id}"]`));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    document.addEventListener(`keydown`, this._documentKeyDownHandler);
  }

  setCommentDeleteHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this._getCommentListElement().addEventListener(`click`, this._commentDeleteClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.onCloseClick = callback;
    const closeBtnElement = this._getCloseBtnElement();
    closeBtnElement.addEventListener(`click`, this._closeBtnClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick(evt);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    for (const control of document.querySelectorAll(`.film-details__comment-input`)) {
      control.addEventListener(`change`, this._editClickHandler);
    }
  }
}
