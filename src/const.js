export const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
export const AUTHORIZATION = `Basic s9KYnCvF66Xu8tUca`;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const SortTypes = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
};

export const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  NONE: `none`,
};

export const MenuItem = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATS: `stats`,
};

export const StatsFilterType = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

export const RatingName = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`,
};
