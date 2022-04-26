import { createStore } from 'vuex';
import api from '../services/api.js';

export default createStore({
  state: {
    user: null,
  },
  getters: {
    isAuth(state) {
      return !!state.user;
    },
  },
  mutations: {
    SET_USER_DATA(state, payload) {
      state.user = payload;
    },
    CLEAR_USER_DATA(state) {
      state.user = null;
      localStorage.removeItem('token');
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
      commit('SET_USER_DATA', response.data);
    },
    async logOut({ commit }) {
      commit('CLEAR_USER_DATA');
    },
  },
  modules: {},
});
