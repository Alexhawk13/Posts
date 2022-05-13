import { createStore } from 'vuex';
import api from '../services/api.js';
import {
  getAuthorsOfPosts,
  getPostsComments,
  mergeData,
  mergeComments,
} from '@/helpers/mergeData.js';

export default createStore({
  state: {
    user: null,
    posts: null,
    comments: null,
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

    getComments(state) {
      return state.comments;
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

    SET_COMMENTS(state, comments) {
      state.comments = comments;
    },

    CREATE_COMMENT(state, newComment) {
      state.comments.push(newComment);
    },

    EDIT_COMMENT(state, response) {
      const prevComment = state.comments.findIndex(
        (comment) => comment._id === response._id
      );

      state.comments.splice(prevComment, 1, response);
    },

    REMOVE_COMMENT(state, id) {
      state.comments = state.comments.filter((comment) => {
        return comment._id !== id;
      });
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
      const response = await api.get(`/api/v1/posts`, payload);
      const users = await getAuthorsOfPosts(response.data.data);
      const comments = await getPostsComments(response.data.data);
      const mergedUsers = mergeData(response.data.data, users);
      const mergedComments = mergeComments(mergedUsers, comments);

      const posts = {
        pagination: response.data.pagination,

        data: {
          ...mergedComments,
        },
      };
      commit('SET_POSTS', posts);
    },

    async fetchDetailsPost(_, id) {
      const detailsPost = await api.get(`api/v1/posts/${id}`);
      return detailsPost;
    },

    async fetchAuthor(_, id) {
      const response = await api.get(`/api/v1/users/${id}`);
      return response.data;
    },

    async postLike(_, postId) {
      await api.put(`api/v1/posts/like/${postId}`);
    },

    async fetchComments({ commit }, postId) {
      const result = await api.get(`/api/v1/comments/post/${postId}`);
      commit('SET_COMMENTS', result.data);
      return result.data;
    },

    async commentLike(_, commentId) {
      await api.put(`api/v1/comments/like/${commentId}`);
    },

    async commentCreate({ commit }, payload) {
      const id = payload.id;
      const text = payload.text;
      const followedCommentID = payload.followedCommentID;
      const newComment = await api.post(`api/v1/comments/post/${id}`, {
        text,
        followedCommentID,
      });

      commit('CREATE_COMMENT', newComment.data);
    },

    async commentEdit({ commit }, payload) {
      const id = payload.id;
      const text = payload.text;

      const response = await api.patch(`api/v1/comments/${id}`, { text });
      commit('EDIT_COMMENT', response.data);
    },

    async commentRemove({ commit }, id) {
      commit('REMOVE_COMMENT', id);
      await api.delete(`api/v1/comments/${id}`);
    },
  },
  modules: {},
});
