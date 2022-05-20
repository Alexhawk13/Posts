<template>
  <div v-if="!isEditing" class="q-py-lg q-gutter-md card-wrapper">
    <q-card class="my-card card">
      <div class="settings-wrapper">
        <q-btn
          v-if="isOwnPost"
          @click="
            isEditing = !isEditing;
            $emit('editMode');
          "
          icon="settings"
          size="24px"
          class="cursor-pointer settings"
        />
      </div>

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
            @click="likePost"
            :disabled="isLoading"
          >
            <q-icon
              :name="isLiked(post) ? 'favorite' : 'favorite_border'"
              :color="isLiked(post) ? 'red' : 'black'"
              size="sm"
              class="likes cursor-pointer"
            />
          </q-btn>
          <span>{{ likes.length }}</span>

          <span
            class="showComments q-pl-sm cursor-pointer"
            @click="$emit('showAllComments')"
            ><q-icon class="q-pl-lg q-mr-sm" size="sm" name="message" />{{
              comments ? comments.length : 0
            }}
          </span>
        </div>
        <div
          @click="profileView"
          class="avatarNameWrapper flex flex-center no-wrap cursor-pointer"
        >
          <q-avatar class="text-subtitle2 avatar-wrapper">
            <q-icon
              v-if="!author || !author.avatar"
              class="avatar"
              name="face"
              size="40px"
            />

            <img v-else class="avatar" :src="`${baseUrl + authorAvatar()}`" />
          </q-avatar>
          <p class="q-pl-sm q-mb-none name">
            {{ !author || !author.name ? 'John Doe' : author.name }}
          </p>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <div v-else class="flex column justify-center updateCard">
    <img
      v-if="this.post.image || this.imgFile"
      class="block q-mx-auto"
      id="pic"
      :src="imgFile"
    />
    <q-file
      class="uploader cursor-pointer"
      accept=".jpg, .png, image/*"
      filled
      v-model="imgFile"
      @update:model-value="handleUpload"
    >
      Upload image for this post
    </q-file>
    <q-card class="my-card card">
      <q-card-section>
        <q-input autogrow class="title" v-model="title" label="Title" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          autogrow
          class="description"
          v-model="description"
          label="Description"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          label="Post Text"
          type="textarea"
          rows="10"
          cols="33"
          v-model="fullText"
          placeholder="Post Text"
        />
      </q-card-section>
    </q-card>
    <q-btn class="self-end q-px-lg q-my-md" color="primary" @click="updatePost"
      >Update</q-btn
    >
  </div>
</template>

<script>
import { monthAndDate } from '@/helpers/convertDate.js';
import { mapGetters } from 'vuex';
import { like, isLiked } from '@/helpers/like.js';

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
      isEditing: false,
      baseUrl: process.env.VUE_APP_API,
      isLoading: false,
      showAllComments: false,
      likes: this.post.likes,
      title: this.post.title,
      description: this.post.description,
      fullText: this.post.fullText,
      imgFile: null,
      sendImgFile: null,
      image: this.post.image,
    };
  },
  async mounted() {
    if (this.post.image) {
      this.imgFile = this.baseUrl + this.post.image;
    }

    let authorId = this.post ? this.post.postedBy : '';

    if (authorId) {
      this.author = await this.$store.dispatch('fetchAuthor', authorId);
    }
  },
  methods: {
    isLiked,
    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },

    async likePost() {
      this.isLoading = true;
      this.likes = await like('postLike', this.post);
      this.isLoading = false;
    },

    profileView() {
      this.$router.push({
        name: 'AuthorView',
        params: { id: this.author._id },
      });
    },

    handleUpload() {
      this.sendImgFile = this.imgFile;
      this.imgFile = URL.createObjectURL(this.imgFile);
    },

    async updatePost() {
      if (this.sendImgFile) {
        const formData = new FormData();

        formData.append('image', this.sendImgFile);

        const imagePayload = { id: this.post._id, img: formData };

        await this.$store.dispatch('updatePostImage', imagePayload);
      }

      const postFieldsArray = ['title', 'description', 'fullText'];

      const arrayOfChangedFields = postFieldsArray.filter(
        (el) => this[el] !== this.post[el]
      );
      const changedData = {};

      for (let key of arrayOfChangedFields) {
        changedData[key] = this[key];
      }

      const payload = { obj: changedData, id: this.post._id };

      if (Object.keys(changedData).length) {
        this.$store.dispatch('updatePost', payload);
      }

      this.isEditing = false;
    },
  },
  computed: {
    ...mapGetters(['getUserState', 'isAuth']),
    date() {
      return this.post && this.post.dateCreated
        ? monthAndDate(this.post.dateCreated).split(' ')
        : '';
    },
    isOwnPost() {
      return this.getUserState
        ? this.getUserState._id === this.post.postedBy
        : false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar-wrapper
  width: 40px;
  height: 40px;
.showComments:hover
  text-decoration underline
.q-card > img
  width initial
  margin 0 auto
  max-width 100%
#pic
  max-width 100%
.settings-wrapper
  position absolute
  top 5px
  right 5px
  background-color #ffffff8a
  border-radius 50% !important
.settings
  transition-duration 1s
  background none
  &:hover
    transform rotate(90deg)
    background none
.avatarNameWrapper
  max-width 35vw
  min-width 150px
.name
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
.updateCard
  min-height 100vh
.footer
  @media screen and (max-width: 600px)
    padding 0 0 10px 0
</style>
