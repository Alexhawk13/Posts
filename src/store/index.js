import { createStore } from 'vuex';
import api from '../services/api.js';

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async register(_, credentials) {
      await api.post('/api/v1/users', credentials);
    },
  },
  modules: {},
});
