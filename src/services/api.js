import axios from 'axios';

const baseURL = process.env.VUE_APP_API;

const api = axios.create({
  baseURL,
  headers: {
    accept: 'application/json',
  },
});
// api.interceptors
export default api;
