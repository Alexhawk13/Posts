<template>
  <div class="q-py-lg q-gutter-md card-wrapper">
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
          <q-btn
            round
            class="no-box-shadow"
            @click="like"
            :disabled="isLoading"
          >
            <q-icon
              :name="isLiked ? 'favorite' : 'favorite_border'"
              :color="isLiked ? 'red' : 'black'"
              size="sm"
              class="likes"
            />
          </q-btn>
          <span>{{ likes.length }}</span>

          <span class="showComments q-pl-sm" @click="$emit('showAllComments')"
            ><q-icon class="q-pl-lg q-mr-sm" size="sm" name="message" />{{
              comments ? comments.length : 0
            }}
            Comments</span
          >
        </div>

        <div class="text-subtitle2 avatar-wrapper" @click="profileView()">
          <q-icon
            v-if="!author || !author.avatar"
            class="avatar"
            name="face"
            size="25px"
          />

          <img v-else class="avatar" :src="`${baseUrl + authorAvatar()}`" />

          <span class="q-pl-sm">{{
            !author || !author.name ? 'John Doe' : author.name
          }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import convertDate from '@/helpers/convertDate.js';
import { Dialog } from 'quasar';
import { mapGetters } from 'vuex';

export default {
  name: 'PostDetails',
  props: {
    post: {
      type: Object,
      default: () => {},
    },
    comments: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      author: null,
      baseUrl: process.env.VUE_APP_API,
      isLoading: false,
      showAllComments: false,
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
    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },

    async like() {
      if (!this.isAuth) {
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
      } else {
        this.isLoading = true;
        await this.$store.dispatch('postLike', this.post._id);

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
.avatar-wrapper:hover
.showComments:hover
  cursor pointer
.showComments:hover
  text-decoration underline
.q-card > img
  width initial
  margin 0 auto
  max-width 100%
</style>
