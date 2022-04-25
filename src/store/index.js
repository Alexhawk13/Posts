import { createStore } from 'vuex';
import api from '../services/api.js';

export default createStore({
  state: {
    name: '',
    isAuth: false,
  },
  getters: {
    loggedIn(state) {
      return state.isAuth;
    },
  },
  mutations: {
    addUserData(state, payload) {
      state.name = payload.name;
      state.isAuth = true;
    },
  },
  actions: {
    async register(_, credentials) {
      await api.post('/api/v1/users', credentials);
    },
    async getAuthToken({ dispatch }, credentials) {
      const token = await api.post('/api/v1/auth', credentials);
      localStorage.setItem('token', token.data.token);
      await dispatch('getUser');
    },
    async getUser({ commit }) {
      const response = await api.get('/api/v1/auth/user');
      commit('addUserData', response.data);
    },
  },
  modules: {},
});
