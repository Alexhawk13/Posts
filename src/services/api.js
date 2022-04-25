import axios from 'axios';

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
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default api;
