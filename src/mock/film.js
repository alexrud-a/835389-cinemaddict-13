import dayjs from "dayjs";

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
      poster: `the-dance-of-life.jpg`,
      description: `Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…`,
    },
    {
      title: `Sagebrush Trail`,
      poster: `sagebrush-trail.jpg`,
      description: `Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant's narrow escap…`,
    },
    {
      title: `The Man with the Golden Arm`,
      poster: `made-for-each-other.png`,
      description: `Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…`,
    },
    {
      title: `Santa Claus Conquers the Martians`,
      poster: `santa-claus-conquers-the-martians.jpg`,
      description: `The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…`,
    },
    {
      title: `Popeye the Sailor Meets Sindbad the Sailor`,
      poster: `popeye-meets-sinbad.png`,
      description: `In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…`,
    }
  ];

  const randomIndex = getRandomInteger(0, info.length - 1);

  return info[randomIndex];
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

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

export const generateFilm = () => {
  return {
    info: generateInfo(),
    time: generateTime(),
    date: generateDate(),
    genre: generateGenre(),
    comments: getRandomInteger(0, 100),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isViewed: Boolean(getRandomInteger(0, 1)),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    rating: generateRating(0,9),
    age: generateRating(0,18),
    regisseur: ``,
    screenwriters: ``,
    actors: ``,
    country: ``
  };
};
