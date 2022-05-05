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
        <div class="likes-wrapper">
          <q-icon
            @click="like"
            :name="isLiked ? 'favorite' : 'favorite_border'"
            :color="isLiked ? 'red' : 'black'"
            :disable="isLoading"
            size="sm"
            class="likes q-pr-sm"
          />
          <span>{{ likes.length }}</span>
        </div>

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
import convertDate from '@/helpers/convertDate.js';
import { mapGetters } from 'vuex';
import { Dialog } from 'quasar';

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
      isLoading: false,
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
    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },

    async like() {
      if (!this.isAuth) {
        this.modal();
      } else {
        this.isLoading = true;
        await this.$store.dispatch('like', this.post._id);
        if (!this.isLiked) {
          this.likes.push(this.getUserState._id);
        } else {
          this.likes.pop();
        }
        this.isLoading = false;
      }
    },

    profileView() {
      this.$router.push({ name: 'AuthorView' });
    },
    modal() {
      Dialog.create({
        dark: true,
        message: 'Only authorized users are allowed to do that',
        persistent: true,
        class: 'text-h6 text-center',
        ok: {
          push: true,
          color: 'primary',
          label: 'Log In',
          padding: '7px 40px',
          class: 'q-mr-auto',
        },
        cancel: {
          push: true,
          color: 'negative',
          label: 'Dismiss',
          padding: '7px 40px',
          class: 'q-ml-auto',
        },
      })
        .onOk(() => {
          this.$router.push({ name: 'LogIn' });
        })
        .onCancel(() => {});
    },
  },
  computed: {
    ...mapGetters(['getUserState', 'isAuth']),
    date() {
      return this.post && this.post.dateCreated
        ? convertDate(this.post.dateCreated).split(' ')
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
.likes:hover
  cursor pointer
.avatar-wrapper:hover
  cursor pointer
</style>
