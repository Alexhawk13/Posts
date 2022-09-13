<template>
  <div class="row flex-center">
    <q-select
      class="ChartSelector"
      :options="selector.belongsToOptions"
      v-model="selector.belongsTo"
      label="belongs to"
      stack-label
    >
    </q-select>
    <q-select
      class="ChartSelector"
      :options="selector.typeOfDateOptions"
      v-model="selector.typeOfDate"
      :disable="selector.year === 'all'"
      label="year/m/d"
      stack-label
    >
    </q-select>
    <q-select
      class="ChartSelector"
      :options="selector.yearOptions"
      v-model="selector.year"
      label="year"
      stack-label
    >
    </q-select>
  </div>
  <div class="chart-wrapper">
    <Line
      v-if="!isLoading && !showBar"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :width="500"
      :height="500"
    />
    <Bar
      v-if="!isLoading && showBar"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :width="500"
      :height="500"
    />
  </div>
</template>

<script>
import {
  getFullDate,
  daysInMonth,
  stringToDate,
} from '@/helpers/convertDate.js';
import { Line, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
} from 'chart.js';
import api from '../services/api.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'LineChart',
  components: { Line, Bar },
  props: {
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    chartId: {
      type: String,
      default: 'line-chart',
    },
    plugins: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selector: {
        belongsToOptions: ['own posts', 'all posts'],
        typeOfDateOptions: ['year', 'month', 'day'],
        yearOptions: ['2021', '2022', 'all'],
        belongsTo: 'own posts',
        typeOfDate: 'month',
        year: '2021',
      },

      chartData: {
        datasets: [
          {
            data: [],
            label: 'How many posts been posted',
            backgroundColor: '#1976d2',
          },
        ],
      },
      chartOptions: {
        parsing: {
          xAxisKey: 'id',
          yAxisKey: 'quantity',
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
            },
          },
        },
      },

      isLoading: true,
      ownPosts: null,
      allPosts: null,
      MONTHS: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      showBar: false,
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      const authorId = this.$route.params.id;
      const payload = { id: authorId, limit: { params: { limit: 0 } } };
      this.ownPosts = await this.$store.dispatch('fetchOwnPosts', payload);

      const response = await api.get(`/api/v1/posts`, { params: { limit: 0 } });
      const allPosts = response.data.data;

      this.allPosts = allPosts;

      this.getChartData(
        this.selector.belongsTo,
        this.selector.typeOfDate,
        this.selector.year
      );
    } catch (error) {
      console.error(error);
    }
    this.isLoading = false;
  },

  watch: {
    getSelectorData() {
      if (
        this.selector.belongsTo &&
        this.selector.typeOfDate &&
        this.selector.year
      ) {
        this.getChartData(
          this.selector.belongsTo,
          this.selector.typeOfDate,
          this.selector.year
        );
      }
      if (this.selector.year === 'all') {
        this.selector.typeOfDate = 'year';
      }
      if (this.selector.year && this.selector.typeOfDate == 'year') {
        this.showBar = true;
      } else {
        this.showBar = false;
      }
    },
  },

  methods: {
    getChartData(belongsTo, dateType, chosenYear) {
      let posts;
      if (belongsTo === 'own posts') {
        posts = this.ownPosts;
      } else {
        posts = this.allPosts;
      }

      const postsDates = posts.map((el) => {
        return getFullDate(el.dateCreated);
      });

      let filteredByChosenYearPosts;
      let notCountedPostsObject = postsDates;
      //filter posts by chosen year
      if (chosenYear !== 'all') {
        filteredByChosenYearPosts = postsDates.filter((obj) => {
          return obj.year == chosenYear;
        });
        notCountedPostsObject = filteredByChosenYearPosts;
      }

      let years = {};
      let months = {};
      let days = {};
      //counting how many times of each day/month/year posts been posted
      for (let obj of notCountedPostsObject) {
        years[obj.year] = years[obj.year] ? years[obj.year] + 1 : 1;
        months[obj.month] = months[obj.month] ? months[obj.month] + 1 : 1;
        days[obj.day] = days[obj.day] ? days[obj.day] + 1 : 1;
      }

      let dateTypes = [years, months, days];
      //depending on the dateType that user has chosen - choosing the correct index for dateTypes array ^
      let dateTypeIndex;
      switch (dateType) {
        case 'year':
          dateTypeIndex = 0;
          break;
        case 'month':
          dateTypeIndex = 1;
          break;
        case 'day':
          dateTypeIndex = 2;
          break;
      }

      this.dateObjToExtendedForm(dateTypes, dateTypeIndex, chosenYear);
    },

    dateObjToExtendedForm(
      dateObj,
      dateTypeIndex,
      chosenYear,
      startYear = 2021
    ) {
      let changedYearsObj = {};
      let changedMonthsObj = {};
      let changedDaysObj = {};

      for (let dateType of dateObj) {
        // if dateType is Year
        if (dateObj.indexOf(dateType) === 0) {
          if (chosenYear === 'all') {
            for (let i = startYear; i <= new Date().getFullYear(); i++) {
              if (Object.keys(dateType).includes(i.toString())) {
                changedYearsObj[i] = dateType[i];
              } else {
                changedYearsObj[i] = 0;
              }
            }
          } else {
            changedYearsObj[chosenYear] = dateType[chosenYear];
          }
        }

        // if dateType is Month
        if (dateObj.indexOf(dateType) === 1) {
          let months = this.MONTHS.map((el) => {
            return el;
          });
          // if chosen Year is equal to current year then we are showing only passed months
          if (chosenYear == new Date().getFullYear()) {
            months.splice(new Date().getMonth() + 1);
          }

          for (let month of months) {
            if (Object.keys(dateType).includes(month)) {
              changedMonthsObj[month] = dateType[month];
            } else {
              changedMonthsObj[month] = 0;
            }
          }
        }
        // if dateType is Day
        if (dateObj.indexOf(dateType) === 2) {
          let monthArray = [];
          if (chosenYear != new Date().getFullYear()) {
            //creating array with strings, type: 'day/month/year' to parse it to Date after
            for (let i = 1; i <= 12; i++) {
              monthArray.push(`1/${i}/${chosenYear}`);
            }
          } else {
            //if chosen Year is equal to current than pass only months till current
            for (let i = 1; i <= new Date().getMonth() + 1; i++) {
              monthArray.push(`1/${i}/${chosenYear}`);
            }
          }
          // in this object we will have a number of every days in a months for chosen year
          let year = { [chosenYear]: [] };

          for (let i = 0; i <= monthArray.length; i++) {
            if (
              chosenYear == new Date().getFullYear() &&
              i === monthArray.length - 1
            ) {
              //if chosen year = current year then as latest number we need current date
              year[chosenYear].push(new Date().getDate());
            } else {
              // checking how many days has each month
              year[chosenYear].push(daysInMonth(stringToDate(monthArray[i])));
            }
          }

          for (let i = 0; i <= year[chosenYear].length; i++) {
            for (let j = 1; j <= year[chosenYear][i]; j++) {
              if (
                Object.keys(dateType).includes(
                  `${j} ${this.MONTHS[i]} ${chosenYear}`
                )
              ) {
                changedDaysObj[`${j} ${this.MONTHS[i]}`] =
                  dateType[`${j} ${this.MONTHS[i]} ${chosenYear}`];
              } else {
                changedDaysObj[`${j} ${this.MONTHS[i]}`] = 0;
              }
            }
          }
        }
      }
      let arrayOfChangedObjects = [];

      arrayOfChangedObjects.push(
        changedYearsObj,
        changedMonthsObj,
        changedDaysObj
      );
      this.pushValidObjToChart(arrayOfChangedObjects[dateTypeIndex], 0);
    },

    pushValidObjToChart(arr) {
      let newObj = [];
      for (let pair of Object.entries(arr)) {
        newObj.push({ id: pair[0], quantity: pair[1] });
      }
      this.chartData.datasets[0].data = newObj;
    },
  },

  computed: {
    getSelectorData() {
      return `${this.selector.belongsTo},
        ${this.selector.typeOfDate},
        ${this.selector.year}`;
    },
  },
};
</script>

<style lang="stylus" scoped>
.ChartSelector
  min-width 100px
  margin-left 20px

  @media screen and (max-width: 600px)
    min-width 70px
    margin-left 5px

.chart-wrapper
  flex-grow: 1;
  min-height: 0;
  100vh
  &> div {
    position: relative;
    overflow: auto
  }
</style>
