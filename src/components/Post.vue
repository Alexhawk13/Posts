<template>
  <div class="q-pa-md row items-start card-wrapper">
    <q-card
      class="card cursor-pointer full-width text-center"
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
        <p class="card__title">
          {{ post.title ? post.title : '' }}
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="card__description">
          {{ post.description ? post.description : '' }}
        </p>
      </q-card-section>
      <q-card-section class="card__footer">
        <div>
          <q-icon class="q-pr-sm" name="forum" size="sm" />
          <span>{{ post.comments ? post.comments.length : 0 }}</span>
        </div>
        <div
          class="text-subtitle2 flex items-center flex-end no-wrap card__footer__author"
        >
          <q-avatar class="card__footer__author__avatar">
            <q-icon
              v-if="!post.author || !post.author.avatar"
              class="avatar"
              name="face"
              size="40px"
            ></q-icon>
            <img v-else class="avatar" :src="`${baseUrl + authorAvatar()}`" />
          </q-avatar>
          <span class="q-pl-sm card__footer__author__name">{{
            post.author ? post.author.name : 'John Doe'
          }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { monthAndDate } from '@/helpers/convertDate.js';
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
      baseUrl: process.env.VUE_APP_API,
    };
  },

  methods: {
    detailsPage(postId) {
      this.$router.push({ name: 'PostDetailsView', params: { id: postId } });
    },

    authorAvatar() {
      if (this.post.author && this.post.author.avatar)
        return this.post.author.avatar;
    },
  },
  computed: {
    ...mapGetters(['getUserData', 'isAuth']),

    date() {
      return this.post.dateCreated
        ? monthAndDate(this.post.dateCreated).split(' ')
        : '';
    },

    isLiked() {
      return this.isAuth ? this.post.likes.includes(this.getUserData._id) : '';
    },
  },
};
</script>
