import Popup from "../view/popup";
import {remove, render, RenderPosition, replace} from "../utils";
import {UserAction, UpdateType} from "../const";

const State = {
  DISABLING: `DISABLING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

export default class FilmPopup {
  constructor(container, filmId, api, getFilmById, closeDetails, changeFilm) {
    this._container = container;
    this._filmId = filmId;
    this._api = api;
    this._getFilmById = getFilmById;
    this._closeDetails = closeDetails;
    this._changeFilm = changeFilm;

    this._popup = null;

    this._handleOnCloseBtnClick = this._handleOnCloseBtnClick.bind(this);
    this._handleClickFilmInfo = this._handleClickFilmInfo.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  init() {
    const film = this._getFilmById(this._filmId);

    if (!film) {
      this._closeDetails();
    }

    this._api
      .getComments(this._filmId)
      .then((comments) => Object.assign({}, film, {comments}))
      .then((filmWithComments) => {
        this._film = filmWithComments;
        this._renderFilmDetails();
      })
      .catch(() => {
        this._film = Object.assign({}, film, {comments: []});
      })
      .finally(() => this._renderFilmDetails());
  }

  destroy() {
    remove(this._popup);
  }

  _renderFilmDetails() {
    this._prevpopup = this._popup;
    this._popup = new Popup(this._film);

    this._popup.setCloseClickHandler(this._handleOnCloseBtnClick);
    this._popup.setEditClickHandler((evt) => this._handleClickFilmInfo(evt));
    this._popup.setFormSubmitHandler(this._handleFormSubmit);
    this._popup.setCommentDeleteHandler(this._handleCommentDeleteClick);

    if (this._prevpopup === null) {
      render(this._container, this._popup, RenderPosition.BEFOREEND);
      return;
    }

    const scrollTopPosition = this._prevpopup.getElement().scrollTop;

    replace(this._popup, this._prevpopup);
    this._popup.getElement().scrollTo(0, scrollTopPosition);

    remove(this._prevpopup);
  }

  _setViewState(state, payload) {
    const resetState = () => {
      this._popup.updateData({
        isDisabled: false,
        deletingId: null,
      });
    };

    switch (state) {
      case State.DISABLING:
        this._popup.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._popup.updateData({
          isDisabled: true,
          deletingId: payload,
        });
        break;
      case State.ABORTING:
        if (!payload) {
          this._popup.shake(resetState);
          return;
        }

        this._popup.shake(resetState, payload);
        break;
    }
  }

  _handleOnCloseBtnClick() {
    this._closeDetails();
  }

  _handleClickFilmInfo(evt) {
    let type = evt.target.getAttribute(`data-type`);
    this._changeFilm(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {
          [type]: !this._film[type],
          comments: this._film.comments.map((comment) => comment.id)
        }));
  }

  _handleFormSubmit({filmId, comment}) {
    this._setViewState(State.DISABLING);
    this._api
      .createComment(filmId, comment)
      .then((update) => {
        this._changeFilm(UserAction.UPDATE_FILM, UpdateType.MINOR, update);
      })
      .catch(() => this._setViewState(State.ABORTING));
  }

  _handleCommentDeleteClick(commentId) {
    this._setViewState(State.DELETING, commentId);
    this._api
      .deleteComment(commentId)
      .then(() => {
        const updateComments = this._film.comments.filter((comment) => comment.id.toString() !== commentId);

        this._changeFilm(
            UserAction.UPDATE_FILM,
            UpdateType.MINOR,
            Object.assign({}, this._film, {
              comments: updateComments.map((comment) => comment.id),
            })
        );
      })
      .catch(() => {
        const element = this._popup.getCommentItemById(commentId);
        this._setViewState(State.ABORTING, element);
      });
  }
}
