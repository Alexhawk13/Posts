<template>
  <div class="q-pa-md row items-start q-gutter-md card-wrapper">
    <q-card
      class="my-card card cursor-pointer full-width"
      @click="detailsPage(post._id)"
    >
      <div class="date-block">
        <strong>{{ date[1] }}</strong>
        <br />
        {{ date[0] }}
      </div>
      <img
        class="card__image"
        :src="
          !post.image
            ? 'https://cdn.quasar.dev/img/mountains.jpg'
            : `${baseUrl + post.image}`
        "
      />
      <q-card-section>
        <p class="title">
          {{ post.title ? post.title : '' }}
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="description">
          {{ post.description ? post.description : '' }}
        </p>
      </q-card-section>
      <q-card-section class="footer">
        <div class="text-subtitle2 avatar-wrapper">
          <q-icon
            v-if="!author || !author.avatar"
            class="avatar"
            name="face"
            size="25px"
          ></q-icon>
          <img v-else class="avatar" :src="`${baseUrl + authorAvatar()}`" />
          <span class="q-pl-sm">{{ author ? author.name : 'John Doe' }}</span>
        </div>
        <div>
          <q-icon class="q-pr-sm" name="forum" size="sm" />
          <span>{{ comments ? comments.length : 0 }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import convertDate from '@/helpers/convertDate.js';
import { mapGetters } from 'vuex';

export default {
  name: 'PostBlock',
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      author: null,
      comments: null,
      baseUrl: process.env.VUE_APP_API,
    };
  },

  mounted() {
    this.author = this.post.author;
    this.comments = this.post.comments;
  },

  watch: {
    post: {
      handler: function () {
        this.author = this.post.author;
        this.comments = this.post.comments;
      },
      deep: false,
      immediate: true,
    },
  },

  methods: {
    detailsPage(postId) {
      this.$router.push({ name: 'PostDetailsView', params: { id: postId } });
    },

    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },
  },
  computed: {
    ...mapGetters(['getUserState', 'isAuth']),

    date() {
      return this.post.dateCreated
        ? convertDate(this.post.dateCreated).split(' ')
        : '';
    },

    isLiked() {
      return this.isAuth ? this.post.likes.includes(this.getUserState._id) : '';
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card > img
  width initial
  margin 0 auto
  max-width 100%
</style>
