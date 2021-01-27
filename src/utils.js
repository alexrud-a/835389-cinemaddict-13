import Base from "./view/abstract";

const UserRank = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BAFF: `Movie Buff`
};

export const formatDuration = (time) => {
  let hours = Math.trunc(time / 60);
  let minutes = time % 60;
  return hours + `h ` + minutes + ` m`;
};

export const profileRating = (count) => {
  if (count > 1 && count <= 10) {
    return UserRank.NOVICE;
  } else if (count > 10 && count <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BAFF;
  }
};

export const StatPeriodMap = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Base) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Base) {
    newChild = newChild.getElement();
  }

  if (oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  const parent = oldChild.parentElement;

  parent.replaceChild(newChild, oldChild);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`); // 1
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const compareValues = (key, order) => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === `string`)
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === `string`)
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === `desc`) ? (comparison * -1) : comparison
    );
  };
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const remove = (component) => {
  if (!(component instanceof Base)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};

export const isOnline = () => {
  return window.navigator.onLine;
};
