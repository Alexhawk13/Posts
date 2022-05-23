<template>
  <q-form class="comment-form q-pb-lg row no-wrap">
    <q-avatar>
      <q-icon
        v-if="!getUserData || !getUserData.avatar"
        size="lg"
        name="face"
      />
      <img v-else :src="`${baseUrl + getUserData.avatar}`" />
    </q-avatar>

    <q-input
      @keydown.enter.prevent="createComment"
      bg-color="grey-1"
      type="text"
      autogrow
      rounded
      outlined
      class="comment-form__message full-width"
      v-model="text"
      placeholder="Write a comment"
      :error="v$.text.$error"
      :error-message="v$.text.$errors[0]?.$message"
    >
      <q-avatar @click="createComment">
        <q-icon name="send" />
      </q-avatar>
    </q-input>
  </q-form>
</template>

<script>
import { mapGetters } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { Dialog } from 'quasar';

export default {
  props: {
    post: {
      type: Object,
      default: () => {},
    },
    comment: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      text: '',
      baseUrl: process.env.VUE_APP_API,
      v$: useVuelidate(),
    };
  },

  validations() {
    return {
      text: { required, minLength: minLength(3) },
    };
  },

  methods: {
    async createComment() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
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
        let payload = {};

        if (this.isReplyToComment) {
          payload = {
            id: this.comment.postID,
            text: this.text,
            followedCommentID: this.comment._id,
          };
        } else {
          payload = {
            id: this.post._id,
            text: this.text,
            followedCommentID: null,
          };
        }
        await this.$store.dispatch('commentCreate', payload);

        this.text = '';
        this.$emit('replied');
      }
    },
  },

  computed: {
    ...mapGetters(['getUserData', 'isAuth']),

    isReplyToComment() {
      return this.comment;
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '@/styles/colors.styl'
.comment-form__message
  color $text-grey-2
</style>
