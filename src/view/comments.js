import dayjs from "dayjs";

const createCommentTemplate = (comment) => {
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji(comment.info.emotion)}" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.info.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.info.author}</span>
                <span class="film-details__comment-day">${dayjs(comment.date).format(`YYYY/MM/DD HH:mm`)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};

const emoji = (emotion) => {
  let imgComment;
  switch (emotion) {
    case `angry`:
      imgComment = `angry.png`;
      break;
    case `puke`:
      imgComment = `puke.png`;
      break;
    case `sleeping`:
      imgComment = `sleeping.png`;
      break;
    case `smile`:
      imgComment = `smile.png`;
      break;
  }
  return imgComment;
};

export const createCommentsTemplate = (comments) => {
  return `<ul class="film-details__comments-list">${comments.map((comment) => createCommentTemplate(comment)).join(``)}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>`;
};
