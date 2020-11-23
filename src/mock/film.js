import dayjs from "dayjs";
import {nanoid} from 'nanoid';
import {generateComments} from "./comments";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRating = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1)).toFixed(1).replace(`,`, `.`);
};

const generateInfo = () => {
  const info = [
    {
      title: `The Dance of Life`,
      originTitle: `The Great Flamarion`,
      poster: `the-dance-of-life.jpg`,
    },
    {
      title: `Sagebrush Trail`,
      originTitle: `Sagebrush Trail`,
      poster: `sagebrush-trail.jpg`,
    },
    {
      title: `The Man with the Golden Arm`,
      originTitle: `The Great Flamarion`,
      poster: `made-for-each-other.png`,
    },
    {
      title: `Santa Claus Conquers the Martians`,
      originTitle: `Santa Claus`,
      poster: `santa-claus-conquers-the-martians.jpg`,
    },
    {
      title: `Popeye the Sailor Meets Sindbad the Sailor`,
      originTitle: `Popeye the Sailor Meets Sindbad the Sailor`,
      poster: `popeye-meets-sinbad.png`,
    }
  ];

  const randomIndex = getRandomInteger(0, info.length - 1);

  return info[randomIndex];
};

const generateRegisseur = () => {
  const regisseurs = [
    `Anthony Mann`,
    `Christopher Jonathan`,
    `Steven Spielberg`,
    `Martin Scorsese`,
    `Alfred Hitchcock`,
  ];

  const randomIndex = getRandomInteger(0, regisseurs.length - 1);

  return regisseurs[randomIndex];
};

const generateScreenwriters = () => {
  const screenwriters = [
    `Билли Уайлдер`,
    `Итан и Джоэл Коэны`,
    `Роберт Таун`,
    `Квентин Тарантино`,
    `Френсис Форд Коппола`,
  ];

  const screenwritersCount = getRandomInteger(1, screenwriters.length - 1);
  const randomScreenwriters = [];
  for (let i = 0; i < screenwritersCount; i++) {
    randomScreenwriters.push(screenwriters[getRandomInteger(1, screenwriters.length - 1)]);
  }
  return randomScreenwriters;
};

const generateActors = () => {
  const actors = [
    `Alan Rickman`,
    `Benedict Cumberbatch`,
    `Benicio del Toro`,
    `Vincent Cassel`,
    `Viggo Mortensen`,
  ];

  const actorsCount = getRandomInteger(1, actors.length - 1);
  const randomActors = [];
  for (let i = 0; i < actorsCount; i++) {
    randomActors.push(actors[getRandomInteger(1, actors.length - 1)]);
  }
  return randomActors;
};

const generateCountry = () => {
  const countries = [
    `USA`,
    `Great Britain`,
    `Canada`,
    `France`,
    `Russia`,
  ];

  const randomIndex = getRandomInteger(0, countries.length - 1);

  return countries[randomIndex];
};

const generateDescription = () => {
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.
  Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam
  faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed
  felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const arrDescriptions = description.split(`.`);
  const descCount = getRandomInteger(1, arrDescriptions.length - 1);
  const randomDescription = [];
  for (let i = 0; i < descCount; i++) {
    randomDescription.push(arrDescriptions[i]);
  }
  return randomDescription.join(`. `);
};

const generateDate = () => {

  const randomYear = getRandomInteger(1970, dayjs().format(`YYYY`));
  const randomMonth = getRandomInteger(0, 11);
  const randomDay = getRandomInteger(0, 30);

  return dayjs().set(`year`, randomYear).set(`month`, randomMonth).set(`day`, randomDay).toDate();
};

const generateTime = () => {

  const randomHour = getRandomInteger(0, 3);
  const randomMinutes = getRandomInteger(0, 59);

  return randomHour + `h ` + randomMinutes + `m`;
};

const generateGenre = () => {
  const genres = [
    `Comedy`,
    `Cartoon`,
    `Drama`,
    `Western`,
    `Musical`
  ];

  const genresCount = getRandomInteger(1, genres.length - 1);
  const randomGenres = [];
  for (let i = 0; i < genresCount; i++) {
    randomGenres.push(genres[getRandomInteger(1, genres.length - 1)]);
  }
  return randomGenres;
};

const generateRandomComments = () => {
  const COUNT_COMMENTS = getRandomInteger(0, 50);
  const randomComments = new Array(COUNT_COMMENTS).fill(null).map((_, index) => generateComments(index));
  return randomComments;
};

export const generateFilm = () => {
  return {
    id: nanoid(),
    info: generateInfo(),
    description: generateDescription(),
    time: generateTime(),
    date: generateDate(),
    genre: generateGenre(),
    comments: generateRandomComments(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isViewed: Boolean(getRandomInteger(0, 1)),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    rating: generateRating(0, 9),
    age: getRandomInteger(0, 18),
    regisseur: generateRegisseur(),
    screenwriters: generateScreenwriters(),
    actors: generateActors(),
    country: generateCountry(),
  };
};
