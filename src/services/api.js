import axios from 'axios';
import { Loading } from 'quasar';
import store from '../store';

const baseURL = process.env.VUE_APP_API;

const api = axios.create({
  baseURL,
  headers: {
    accept: 'application/json',
  },
});

api.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    Loading.show({
      delay: 400,
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (config) => {
    Loading.hide();
    return config;
  },
  function (error) {
    Loading.hide();
    if (error.response && error.response.status === 403) {
      store.dispatch('logOut');
    }
    return Promise.reject(error.response.data.error);
  }
);

export default api;
