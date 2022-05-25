<template>
  <Bar
    v-if="!isLoading"
    :chart-options="chartOptions"
    :chart-data="chartDataUser"
    :chart-id="chartIdUser"
    :dataset-id-key="datasetIdKeyUser"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
  <Bar
    v-if="!isLoading"
    :chart-options="chartOptions"
    :chart-data="chartDataAllUsers"
    :chart-id="chartIdAllUsers"
    :dataset-id-key="datasetIdKeyAllUsers"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { getFullDate } from '@/helpers/convertDate.js';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import api from '../services/api.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartIdUser: {
      type: String,
      default: 'bar-chart',
    },
    datasetIdKeyUser: {
      type: String,
      default: 'label',
    },
    chartIdAllUsers: {
      type: String,
      default: 'bar-chart',
    },
    datasetIdKeyAllUsers: {
      type: String,
      default: 'label',
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
      chartDataUser: {
        datasets: [
          {
            data: [],
            label: 'Posts in year',
            backgroundColor: '#a12345',
          },
          {
            data: [],
            label: 'Posts in Month',
            backgroundColor: '#a45678',
          },
          {
            data: [],
            label: 'Posts in Weak',
            backgroundColor: '#8c8cc5',
          },
          {
            data: [],
            label: 'Posts in Day',
            backgroundColor: '#c6c6e6',
          },
        ],
      },
      chartDataAllUsers: {
        datasets: [
          {
            data: [],
            label: 'Posts in year',
            backgroundColor: '#a12345',
          },
          {
            data: [],
            label: 'Posts in Month',
            backgroundColor: '#a45678',
          },
          {
            data: [],
            label: 'Posts in Weak',
            backgroundColor: '#8c8cc5',
          },
          {
            data: [],
            label: 'Posts in Day',
            backgroundColor: '#2b2152',
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
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      const authorId = this.$route.params.id;
      const payload = { id: authorId, limit: { params: { limit: 0 } } };
      const myPosts = await this.$store.dispatch('fetchOwnPosts', payload);

      const response = await api.get(`/api/v1/posts`, { params: { limit: 0 } });
      const allPosts = response.data.data;

      this.getChartData(myPosts, this.chartDataUser);
      this.getChartData(allPosts, this.chartDataAllUsers);
    } catch (error) {
      console.error(error);
    }
    this.isLoading = false;
  },

  methods: {
    getFullDate,

    pushObjToData(dates, datasetNumber, chartData) {
      let arr = [];
      for (let el of Object.entries(dates)) {
        arr.push({ id: el[0], quantity: el[1] });
      }
      for (let el of arr) {
        chartData.datasets[datasetNumber].data.push(el);
      }
    },

    getChartData(posts, chartData) {
      const myPostsDates = posts.map((el) => {
        return this.getFullDate(el.dateCreated);
      });

      let years = {};
      let months = {};
      let weeks = {};
      let days = {};

      for (let obj of myPostsDates) {
        years[obj.year] = years[obj.year] ? years[obj.year] + 1 : 1;
        months[obj.month] = months[obj.month] ? months[obj.month] + 1 : 1;
        weeks[obj.weak] = weeks[obj.weak] ? weeks[obj.weak] + 1 : 1;
        days[obj.day] = days[obj.day] ? days[obj.day] + 1 : 1;
      }

      let dateTypes = [years, months, weeks, days];

      for (let el of dateTypes) {
        this.pushObjToData(el, dateTypes.indexOf(el), chartData);
      }
    },
  },

  computed: {
    getSet() {
      return this.setts;
    },
  },
};
</script>
