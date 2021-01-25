import AbstractView from "./abstract";

const createFooterStatisticsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(count) {
    super();
    this._filmCount = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmCount);
  }
}
