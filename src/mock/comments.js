import dayjs from "dayjs";
import {nanoid} from 'nanoid';
import {getRandomInteger} from "./random";

const generateDate = () => {

  const randomYear = getRandomInteger(2000, dayjs().format(`YYYY`));
  const randomMonth = getRandomInteger(0, 11);
  const randomDay = getRandomInteger(0, 30);

  return dayjs().set(`year`, randomYear).set(`month`, randomMonth).set(`day`, randomDay).toDate();
};

const generateComment = () => {
  const comments = [
    {
      text: `Interesting setting and a good cast`,
      author: `Tim Macoveev`,
      emotion: `smile`
    },
    {
      text: `Booooooooooring`,
      author: `John Doe`,
      emotion: `sleeping`
    },
    {
      text: `Very very old. Meh`,
      author: `Elis`,
      emotion: `puke`
    },
    {
      text: `Almost two hours? Seriously?`,
      author: `Alex`,
      emotion: `angry`
    },
    {
      text: `Very very old. Meh`,
      author: `Suzan`,
      emotion: `sleeping`
    }
  ];

  const randomIndex = getRandomInteger(0, comments.length - 1);

  return comments[randomIndex];
};

export const generateComments = () => {
  return {
    id: nanoid(),
    info: generateComment(),
    date: generateDate(),
  };
};
