import { createStore } from 'vuex';
import api from '../services/api.js';
import {
  getAuthorsOfPosts,
  getPostsComments,
  mergeData,
  mergeComments,
} from '@/helpers/mergeData.js';
import { showLoggedOutMessage } from '../helpers/notifications.js';

export default createStore({
  state: {
    user: null,
    posts: null,
    comments: null,
    detailsPost: null,
  },
  getters: {
    isAuth(state) {
      return !!state.user;
    },

    getUserData(state) {
      return state.user;
    },

    getPosts(state) {
      return state.posts;
    },

    getDetailsPost(state) {
      return state.detailsPost;
    },

    getComments(state) {
      return state.comments;
    },
  },
  mutations: {
    SET_USER_DATA(state, user) {
      state.user = user;
    },

    UPDATE_USER_DATA(state, updatedUser) {
      state.user = updatedUser;
    },

    CLEAR_USER_DATA(state) {
      state.user = null;
      localStorage.removeItem('token');
      console.log(state.user);
    },

    DELETE_USER_DATA(state) {
      state.user = null;
    },

    SET_POSTS(state, posts) {
      state.posts = posts;
    },

    SET_DETAILS_POST(state, detailsPost) {
      state.detailsPost = detailsPost;
    },

    UPDATE_DETAILS_POST(state, detailsPost) {
      state.detailsPost = detailsPost;
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
      showLoggedOutMessage();
    },

    deleteUser({ commit, getters }) {
      const id = getters.getUserData._id;
      commit('DELETE_USER_DATA');
      api.delete(`/api/v1/users/${id}`);
      return true;
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

    async fetchOwnPosts(_, payload) {
      const response = await api.get(`api/v1/posts`, payload.limit);

      const filteredPosts = response.data.data.filter((el) => {
        return el.postedBy === payload.id;
      });

      return filteredPosts;
    },

    async fetchDetailsPost({ commit }, id) {
      const detailsPost = await api.get(`api/v1/posts/${id}`);
      commit('SET_DETAILS_POST', detailsPost.data);
      return detailsPost;
    },

    async fetchAuthor(_, id) {
      try {
        const response = await api.get(`/api/v1/users/${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
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

    async updateAvatar({ commit }, payload) {
      const img = payload.img;
      const id = payload.id;
      const response = await api.put(`api/v1/users/upload/${id}`, img, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      commit('UPDATE_USER_DATA', response.data);
    },

    async updateUser({ getters, commit }, payload) {
      const userId = getters.getUserData._id;
      const response = await api.patch(`api/v1/users/${userId}`, payload);

      commit('UPDATE_USER_DATA', response.data);
    },

    async updatePostImage({ commit }, payload) {
      const img = payload.img;
      const id = payload.id;
      const response = await api.put(`api/v1/posts/upload/${id}`, img, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      commit('UPDATE_DETAILS_POST', response.data);
    },

    async updatePost({ commit }, payload) {
      const obj = payload.obj;
      const id = payload.id;
      const response = await api.patch(`api/v1/posts/${id}`, obj);

      commit('UPDATE_DETAILS_POST', response.data);
    },

    async createPost(_, payload) {
      const response = await api.post(`api/v1/posts`, payload);
      return response.data._id;
    },

    deletePost(_, id) {
      api.delete(`api/v1/posts/${id}`);
    },
  },
  modules: {},
});
