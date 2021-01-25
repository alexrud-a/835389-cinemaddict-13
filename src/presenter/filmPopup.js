import Popup from "../view/popup";
import Comments from "../view/comments";
import {remove, render, RenderPosition, replace} from "../utils";
import {nanoid} from "nanoid";
import he from "he";

export default class FilmPopupPresenter {
  constructor(container, changeData, deleteComment, addComment) {
    this._container = container;
    this._film = null;
    this._popup = null;
    this._changeData = changeData;
    this._deleteComment = deleteComment;
    this._addComment = addComment;
    this._commentsList = null;
    this._posScroll = null;
  }

  init(film) {
    this._film = film;

    const prevPopup = this._popup;
    this._popup = new Popup(this._film);
    this._commentsList = new Comments(this._film.comments);

    if (prevPopup && this._container.classList.contains(`hide-overflow`)) {
      replace(this._popup, prevPopup);
      this._container.classList.add(`hide-overflow`);
      this.restoreHandlers();
      this._renderComments();
      this._popup.restoreHandlers();
      this._commentsList.restoreHandlers();
      document.querySelector(`.film-details`).scrollTop = this._posScroll;
    } else {
      this._renderPopup();
      return;
    }

    remove(prevPopup);
  }

  _renderPopup() {
    render(this._container, this._popup.getElement(), RenderPosition.BEFOREEND);
    this._container.classList.add(`hide-overflow`);
    this.restoreHandlers();
    this._handleFormSubmit();
    this._renderComments();

  }

  restoreHandlers() {
    this._popup.setEditClickHandler((evt) => this._clickFilmInfo(evt));
    this._popup.setClickHandler(() => this.close());
    this._commentsList.setDeleteCommentHandler((evt) => this._removeFilmComment(evt));
    this._commentsList.setAddCommentEmotionHandler((evt) => this._addFilmCommentEmotion(evt));
    document.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        this.close();
      }
    });
  }

  _handleFormSubmit() {
    document.addEventListener(`keydown`, (evt) => {
      if ((evt.ctrlKey) && (evt.code === `Enter`)) {
        evt.preventDefault();
        this.submitFormComments();
      }
    });
  }

  _renderComments() {
    render(this._popup.getCommentsContainer(), this._commentsList.getElement(), RenderPosition.BEFOREEND);
  }

  _clickFilmInfo(evt) {
    this._posScroll = this.getPositionScroll();
    let type = evt.target.getAttribute(`data-type`);
    this._changeData(Object.assign({}, this._film, {[type]: !this._film[type]}), this._posScroll);
  }

  _removeFilmComment(evt) {
    this._posScroll = this.getPositionScroll();
    let commentId = evt.target.closest(`.film-details__comment`).getAttribute(`id`);
    let commentInd = this._film.comments.findIndex((item) => item.id === commentId);
    this._film.comments.splice(commentInd, 1);
    this._deleteComment(Object.assign({}, this._film, {comments: this._film.comments}), this._posScroll);
  }

  _addFilmCommentEmotion(evt) {
    this._posScroll = this.getPositionScroll();
    const labelEmotion = this._commentsList.getElement().querySelector(`.film-details__add-emoji-label`);
    const emotion = evt.target.value;
    this._commentsList.renderEmotion(labelEmotion, emotion);
  }

  close() {
    remove(this._popup);
    this._container.classList.remove(`hide-overflow`);
  }

  getPositionScroll() {
    return document.querySelector(`.film-details`).scrollTop;
  }

  submitFormComments() {
    let posScroll = this.getPositionScroll();
    let text = this._popup.getElement().querySelector(`.film-details__comment-input`);
    const emotions = document.querySelectorAll(`.film-details__emoji-item`);
    let currentEmotion;
    for (let emotion of emotions) {
      if (emotion.checked) {
        currentEmotion = emotion.value;
      }
    }
    if (currentEmotion !== null && text) {
      let newComment = {
        id: nanoid(),
        info: {
          text: he.encode(text.value),
          author: ``,
          emotion: currentEmotion
        },
        date: new Date(),
      };
      this._film.comments.push(newComment);
      this._addComment(Object.assign({}, this._film, {comments: this._film.comments}), posScroll);
    }
  }
}
