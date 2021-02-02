import SmartView from "./smart";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {countFilmsByGenres, filterInRange, getDuration} from "../utils";
import {StatsFilterType} from "../const";

const BAR_HEIGHT = 50;

const renderChart = (statisticCtx, {films}) => {
  const filmsCountByGenres = countFilmsByGenres(films);
  const sortedGenresByCount = Object.entries(filmsCountByGenres).sort((a, b) => b[1] - a[1]);

  const labels = sortedGenresByCount.map((genre) => genre[0]);
  const values = sortedGenresByCount.map((genre) => genre[1]);

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * labels.length;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...labels],
      datasets: [
        {
          data: [...values],
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 24,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return myChart;
};

const createStatsTemplate = ({films, filter}) => {
  const filmsCount = films.length;
  let topGenre = ``;

  const filmsCountByGenres = countFilmsByGenres(films);
  const sortedGenresByCount = Object.entries(filmsCountByGenres).sort((a, b) => b[1] - a[1]);
  if (sortedGenresByCount.length > 0 && sortedGenresByCount[0][1] > 0) {
    topGenre = sortedGenresByCount[0][0];
  }

  const totalMins = films.reduce((mins, film) => mins + film.runtime, 0);
  const {hours, mins} = getDuration(totalMins);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${
  filter === StatsFilterType.ALL_TIME ? `checked` : ``
}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${
  filter === StatsFilterType.TODAY ? `checked` : ``
}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${
  filter === StatsFilterType.WEEK ? `checked` : ``
}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${
  filter === StatsFilterType.MONTH ? `checked` : ``
}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${
  filter === StatsFilterType.YEAR ? `checked` : ``
}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${mins} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = films.slice();
    this._chart = null;
    this._data = {
      films: filterInRange[StatsFilterType.ALL_TIME](films),
      filter: StatsFilterType.ALL_TIME,
    };

    this._dateRangeChangeHandler = this._dateRangeChangeHandler.bind(this);

    this._setCharts();
    this._setDateRangeChangeHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this._setDateRangeChangeHandler();
  }

  _dateRangeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    const filter = evt.target.value;
    this.updateData({films: filterInRange[filter](this._films), filter});
  }

  _setDateRangeChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._dateRangeChangeHandler);
  }

  _setCharts() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderChart(statisticCtx, this._data);
  }
}
