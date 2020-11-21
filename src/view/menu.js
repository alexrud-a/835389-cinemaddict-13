export const createMenuTemplate = (filmsInfo) => {
  const {watchlist, history, favorites} = filmsInfo;
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-sort="all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-sort="isWatchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
      <a href="#history" data-sort="isViewed" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
      <a href="#favorites" data-sort="isFavorite" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
