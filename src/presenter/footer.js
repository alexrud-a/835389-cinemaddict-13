import FooterStatistics from "../view/count-films";
import {render, RenderPosition, replace} from "../utils";

export default class FooterPresenter {
  constructor(footerContainer, filmsModel) {
    this._footerContainer = footerContainer;
    this._filmsCount = null;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this.observeFilms.bind(this));
  }

  init(count) {
    this._filmsCount = count;
    this._renderFooter();
  }

  observeFilms(films) {
    this._filmsCount = films.length;
    this._renderFooter();
  }

  _renderFooter() {
    let prevFooter = this._footer;
    this._footer = new FooterStatistics(this._filmsCount);
    if (prevFooter) {
      replace(this._footer, prevFooter);
    } else {
      render(this._footerContainer, this._footer.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
