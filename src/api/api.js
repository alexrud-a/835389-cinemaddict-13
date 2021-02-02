import Films from "../model/films";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  static checkStatus(response) {
    if (response.status < SuccessHTTPStatusRange.MIN || response.status >= SuccessHTTPStatusRange.MAX) {
      throw new Error();
    }

    return response;
  }

  static catchError(err) {
    throw new Error(err);
  }

  static toJSON(response) {
    return response.json();
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((films) => films.map((film) => Films.adaptFilmToClient(film)));
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map((comment) => Films.adaptCommentToClient(comment)));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(Films.adaptFilmToServer(film)),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then(Api.toJSON)
      .then(Films.adaptFilmToClient);
  }

  createComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(Films.adaptCommentToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then(Api.toJSON)
      .then(({movie}) => Films.adaptFilmToClient(movie));
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: `/movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers}).then(Api.checkStatus).catch(Api.catchError);
  }
}
