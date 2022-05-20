<template>
  <div class="window-height flex column justify-center">
    <h5 class="q-ma-none q-pb-xs text-center newPostHeader">Create new post</h5>
    <div class="newPost">
      <q-input
        autogrow
        v-model="title"
        label="Post Title"
        :error="v$.title.$error"
        :error-message="v$.title.$errors[0]?.$message"
      />
      <q-input
        autogrow
        v-model="description"
        label="Post Description"
        :error="v$.description.$error"
        :error-message="v$.description.$errors[0]?.$message"
      />
      <q-input
        autogrow
        v-model="fullText"
        label="Post Text"
        :error="v$.fullText.$error"
        :error-message="v$.fullText.$errors[0]?.$message"
      />
    </div>
    <q-btn class="postBtn q-mt-sm q-px-xl q-py-sm self-center" @click="post"
      >Post</q-btn
    >
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

const { withAsync } = helpers;

export default {
  name: 'NewPost',
  data() {
    return {
      v$: useVuelidate(),
      imgFile: null,
      title: '',
      description: '',
      fullText: '',
      sendImgFile: null,
      existedPostTitles: null,
    };
  },
  validations() {
    return {
      title: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(50),
        isUnique: helpers.withMessage(
          'Title should be unique',
          this.isTitleUnique
        ),
      },
      description: { required },
      fullText: {
        required,
        minLength: minLength(20),
        maxLength: maxLength(400),
      },
    };
  },

  methods: {
    handleUpload() {
      this.sendImgFile = this.imgFile;
      this.imgFile = URL.createObjectURL(this.imgFile);
    },

    async post() {
      this.getPostsTitles();
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
      const payload = {
        title: this.title,
        description: this.description,
        fullText: this.fullText,
      };
      const postId = await this.$store.dispatch('createPost', payload);

      this.$router.push({ name: 'PostDetailsView', params: { id: postId } });
    },

    async getPostsTitles() {
      this.existedPostTitles = await this.$store.dispatch('getPostsTitles');
    },

    isTitleUnique() {
      return !this.existedPostTitles.includes(this.title);
    },
  },
};
</script>

<style lang="stylus">
.uploader
  width 100%
  border 1px solid
.uploader .q-field__label.no-pointer-events.absolute.ellipsis
  width 100% !important
  text-align center !important
.newPost
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 15px;
  padding 0 10px
  background-color #fff
.postBtn
  border-radius 10px
  background-color #c5cae9
  transition-duration .4s
  color #313131
  &:hover
    background-color #b9b9ed
    color #fff
.newPostHeader
  color #313131
</style>
