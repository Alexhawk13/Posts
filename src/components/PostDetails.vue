<template>
  <div class="q-pa-md row items-start q-gutter-md card-wrapper">
    <q-card class="my-card card">
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
          {{ post.title }}
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="description">
          {{ post.description }}
        </p>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <p class="description">
          {{ post.fullText }}
        </p>
      </q-card-section>
      <q-card-section class="footer">
        <q-btn
          id="like"
          @click="like"
          dense
          flat
          round
          :color="isLiked ? 'red' : 'black'"
          :icon="isLiked ? 'favorite' : 'favorite_border'"
          :label="likes.length"
          :disable="isLiked"
          class="likes q-pr-md"
        />
        <div class="text-subtitle2 avatar-wrapper" @click="profileView()">
          <q-icon
            v-if="!author || !author.avatar"
            class="avatar"
            name="face"
            size="25px"
          ></q-icon>
          <img v-else class="avatar" :src="`${baseUrl + authorAvatar()}`" />

          <span>{{ !author || !author.name ? 'John Doe' : author.name }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import convertDate from '@/helpers/methods/convertDate.js';
import { mapGetters } from 'vuex';

export default {
  name: 'PostDetails',
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      author: null,
      baseUrl: process.env.VUE_APP_API,
      likes: [],
    };
  },
  async mounted() {
    let authorId = this.post ? this.post.postedBy : '';

    if (authorId) {
      this.author = await this.$store.dispatch('fetchAuthor', authorId);
    }

    this.likes = this.post.likes;
  },
  methods: {
    convertDate,

    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },

    async like() {
      await this.$store.dispatch('like', this.post._id);
      this.likes.push(this.getUserState._id);
    },

    profileView() {
      this.$router.push({ name: 'AuthorView' });
    },
  },
  computed: {
    ...mapGetters(['getUserState']),
    date() {
      return this.post && this.post.dateCreated
        ? this.convertDate(this.post.dateCreated).split(' ')
        : '';
    },
    isLiked() {
      return this.post && this.post.likes && this.getUserState
        ? this.post.likes.includes(this.getUserState._id)
        : '';
    },
  },
};
</script>

<style lang="stylus" scoped>

.avatar-wrapper:hover
  cursor pointer
</style>
