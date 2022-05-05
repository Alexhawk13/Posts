import { createStore } from 'vuex';
import api from '../services/api.js';

export default createStore({
  state: {
    user: null,
    posts: null,
  },
  getters: {
    isAuth(state) {
      return !!state.user;
    },
    getUserState(state) {
      return state.user;
    },
    getPosts(state) {
      return state.posts;
    },
  },
  mutations: {
    SET_USER_DATA(state, user) {
      state.user = user;
    },
    CLEAR_USER_DATA(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
    SET_POSTS(state, posts) {
      state.posts = posts;
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
    logOut({ commit }) {
      commit('CLEAR_USER_DATA');
    },
    async fetchPosts({ commit }, payload) {
      const posts = await api.get(`/api/v1/posts`, payload);
      commit('SET_POSTS', posts.data);
    },
    async fetchDetailsPost(_, id) {
      const detailsPost = await api.get(`api/v1/posts/${id}`);
      return detailsPost;
    },
    async fetchAuthor(_, id) {
      const response = await api.get(`/api/v1/users/${id}`);
      return response.data;
    },
    async like(_, postId) {
      await api.put(`api/v1/posts/like/${postId}`);
    },
  },
  modules: {},
});
