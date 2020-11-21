import dayjs from "dayjs";
import {nanoid} from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDate = () => {

  const randomYear = getRandomInteger(2000, dayjs().format(`YYYY`));
  const randomMonth = getRandomInteger(0, 11);
  const randomDay = getRandomInteger(0, 30);

  return dayjs().set(`year`, randomYear).set(`month`, randomMonth).set(`day`, randomDay).toDate();
};

const generateComment = () => {
  const comment = [
    {
      text: `Interesting setting and a good cast`,
      autor: `Tim Macoveev`,
      emotion: `smile`
    },
    {
      text: `Booooooooooring`,
      autor: `John Doe`,
      emotion: `sleeping`
    },
    {
      text: `Very very old. Meh`,
      autor: `Elis`,
      emotion: `puke`
    },
    {
      text: `Almost two hours? Seriously?`,
      autor: `Alex`,
      emotion: `angry`
    },
    {
      text: `Very very old. Meh`,
      autor: `Suzan`,
      emotion: `sleeping`
    }
  ];

  const randomIndex = getRandomInteger(0, info.length - 1);

  return comment[randomIndex];
};

export const comments = () => {
  return {
    id: nanoid(),
    info: generateComment(),
    date: generateDate(),
  };
};
