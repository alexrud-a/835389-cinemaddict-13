import AbstractView from "./abstract";
import {profileRating} from "./../utils";

const createProfileTemplate = (count) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${ profileRating(count) }</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

export default class Profile extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }
}
