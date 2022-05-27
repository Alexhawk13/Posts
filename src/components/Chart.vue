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

  <Line
    v-if="!isLoading"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import {
  getFullDate,
  getCurrentDayNumberInYear,
} from '@/helpers/convertDate.js';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js';
import api from '../services/api.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    chartId: {
      type: String,
      default: 'line-chart',
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
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
        year: '2022',
      },

      chartData: {
        datasets: [
          {
            data: [],
            label: 'How many posts been posted',
            backgroundColor: '#231ff1',
          },
        ],
      },
      chartOptions: {
        parsing: {
          xAxisKey: 'id',
          yAxisKey: 'quantity',
        },
      },
      isLoading: true,
      ownPosts: null,
      allPosts: null,
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      const authorId = this.$route.params.id;
      const payload = { id: authorId, limit: { params: { limit: 0 } } };
      const ownPosts = await this.$store.dispatch('fetchOwnPosts', payload);

      this.ownPosts = ownPosts;

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
    },
  },

  methods: {
    getFullDate,
    getCurrentDayNumberInYear,

    getChartData(belongsTo, dateType, chosenYear) {
      let posts;
      if (belongsTo === 'own posts') {
        posts = this.ownPosts;
      } else {
        posts = this.allPosts;
      }

      const postsDates = posts.map((el) => {
        return this.getFullDate(el.dateCreated);
      });

      let filteredByChosenYearPosts;
      let notCountedPostsObject = postsDates;

      if (chosenYear !== 'all') {
        filteredByChosenYearPosts = postsDates.filter((obj) => {
          return obj.year == chosenYear;
        });
        notCountedPostsObject = filteredByChosenYearPosts;
      }

      let years = {};
      let months = {};
      let days = {};

      for (let obj of notCountedPostsObject) {
        years[obj.year] = years[obj.year] ? years[obj.year] + 1 : 1;
        months[obj.month] = months[obj.month] ? months[obj.month] + 1 : 1;
        days[obj.day] = days[obj.day] ? days[obj.day] + 1 : 1;
      }

      let dateTypes = [years, months, days];

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

    dateObjToExtendedForm(dateObj, dateTypeIndex, chosenYear) {
      let changedYearsObj = {};
      let changedMonthsObj = {};
      let changedDaysObj = {};

      for (let dateType of dateObj) {
        if (dateObj.indexOf(dateType) === 0) {
          if (chosenYear === 'all') {
            for (let i = 2021; i <= new Date().getFullYear(); i++) {
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

        const MONTHS = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        let months = MONTHS;

        if (chosenYear == new Date().getFullYear()) {
          months.splice(new Date().getMonth() + 1);
        }

        if (dateObj.indexOf(dateType) === 1) {
          for (let month of months) {
            if (Object.keys(dateType).includes(month)) {
              changedMonthsObj[month] = dateType[month];
            } else {
              changedMonthsObj[month] = 0;
            }
          }
        }

        if (dateObj.indexOf(dateType) === 2) {
          let numberOfDays = 365;
          if (chosenYear == new Date().getFullYear()) {
            numberOfDays = getCurrentDayNumberInYear();
          }
          for (let i = 1; i <= numberOfDays; i++) {
            if (Object.keys(dateType).includes(i.toString())) {
              changedDaysObj[i] = dateType[i];
            } else {
              changedDaysObj[i] = 0;
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
</style>
