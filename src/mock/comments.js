import {nanoid} from 'nanoid';
import {getRandomInteger} from "./random";

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
    date: new Date(getRandomInteger(0, new Date())),
  };
};
