import dayjs from "dayjs";
import relatimeTimePlugin from "dayjs/plugin/relativeTime";

dayjs.extend(relatimeTimePlugin);

export const createCommentTemplate = (comment, isDeleting) => {
  const {id, emoji, text, author, date} = comment;

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
        <button data-comment-id=${id} type='button' class="film-details__comment-delete" ${isDeleting ? `disabled` : ``}>
            ${isDeleting ? `Deleting...` : `Delete`}
        </button>
      </p>
    </div>
  </li>`;
};
