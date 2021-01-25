import Observer from "./observer";

export default class CommentsModel extends Observer {
  constructor() {
    super();
    this._commentList = [];
  }

  setCommentsFilm(comments, film) {
    this._commentList = comments.slice();
    this._notify(this._commentList, film);
  }

  getCommentsFilm() {
    return this._commentList;
  }

  addComment(comments, film) {
    this._commentList = comments.slice();

    this._notify(this._commentList, film);
  }

  removeComment(removed, film) {
    const index = this._commentList.findIndex((comment) => comment.id === removed.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._commentList.splice(index, 1);
    this._notify(this._commentList, film);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          info: {
            author: comment.author,
            text: comment.comment,
            emotion: comment.emotion,
          },
        }
    );

    delete adaptedComment.author;
    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "author": comment.info.author,
          "comment": comment.info.text,
          "emotion": comment.info.emotion,

        }
    );

    delete adaptedComment.info;

    return adaptedComment;
  }
}
