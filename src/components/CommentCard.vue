<template>
  <q-card-section class="q-pa-none">
    <div
      class="comment-wrapper row no-wrap items-start full-height q-py-sm q-px-none"
    >
      <q-avatar class="cursor-pointer q-mr-sm">
        <q-icon
          v-if="!author || !author.avatar"
          class="avatar comment__avatar"
          name="face"
          size="40px"
        ></q-icon>
        <img
          v-else
          @click="profileView()"
          class="avatar comment__avatar"
          :src="`${baseUrl + authorAvatar()}`"
        />
      </q-avatar>

      <div class="comment no-wrap q-pa-xs full-width">
        <div v-if="!isEditable">
          <div class="comment__text q-pa-sm text-body1">
            <p class="comment__text__author text-bold full-width">
              {{ author ? author.name : 'John Doe' }}
            </p>
            <p>{{ comment ? comment.text : '' }}</p>
          </div>
          <footer class="row items-center justify-between q-py-md">
            <div class="reply text-bold row cursor-pointer">
              <span @click="(reply = true), (isChildShown = true)">reply</span>
              <div v-if="isMyComment" class="q-pl-md">
                <span @click="isEditable = true">edit</span>
                <span @click="deleteComment" class="q-pl-md">delete</span>
              </div>
            </div>

            <div class="likes-wrapper text-right">
              <span class="q-pr-lg">{{ date }}</span>
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
            </div>
          </footer>
        </div>
        <div v-else>
          <div class="comment__text text-body1">
            <p class="comment__text__author text-bold q-px-sm q-mb-none">
              {{ author ? author.name : 'John Doe' }}
            </p>
            <q-input
              @keydown.enter.prevent="editComment()"
              v-model="message"
              autogrow
              type="text"
              class="q-px-sm text-bold"
            >
            </q-input>
          </div>
          <footer class="text-bold cursor-pointer">
            <span class="q-pr-lg" @click="editComment()">save changes</span>
            <span @click="cancelEdit()">cancel</span>
          </footer>
        </div>
        <div
          v-if="hasChildren"
          class="replies text-bold no-box-shadow q-pa-none cursor-pointer"
          @click="isChildShown = !isChildShown"
        >
          <span>
            {{ comment.children.length }}
            {{ comment.children.length > 1 ? 'Replies' : 'Reply' }}
          </span>
          <q-icon
            :name="isChildShown ? 'arrow_drop_down' : 'arrow_right'"
            size="sm"
          />
        </div>
      </div>
    </div>
    <div v-if="hasChildren" v-show="showReply">
      <CommentBlock
        v-for="child in comment.children"
        :key="child._id"
        :comment="child"
        class="q-pl-xl"
      />
    </div>
    <AddComment v-show="reply" :comment="comment" />
  </q-card-section>
</template>

<script>
import { Dialog } from 'quasar';
import { mapGetters } from 'vuex';
import convertDate from '@/helpers/convertDate.js';
import AddComment from './AddComment.vue';

export default {
  name: 'CommentsCard',
  components: { AddComment },
  props: {
    comment: {
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
      isChildShown: false,
      reply: false,
      isEditable: false,
      message: this.comment.text,
    };
  },

  async mounted() {
    if (this.comment && this.comment.commentedBy) {
      this.author = await this.$store.dispatch(
        'fetchAuthor',
        this.comment.commentedBy
      );
      this.likes = this.comment.likes;
    }
  },

  methods: {
    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },

    profileView() {
      this.$router.push({ name: 'AuthorView' });
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

        await this.$store.dispatch('commentLike', this.comment._id);

        if (!this.isLiked) {
          this.likes.push(this.getUserState._id);
        } else {
          this.likes.pop();
        }
        this.isLoading = false;
      }
    },

    editComment() {
      const text = this.message;
      const payload = { text, id: this.comment._id };

      if (this.comment.text !== text) {
        this.$store.dispatch('commentEdit', payload);
      }

      this.isEditable = false;
    },

    cancelEdit() {
      this.message = this.comment.text;
      this.isEditable = false;
    },

    deleteComment() {
      Dialog.create({
        dark: true,
        message: 'Are you sure to delete this comment?',
        persistent: true,
        class: 'text-h6 text-center',
        ok: {
          push: true,
          color: 'primary',
          label: 'Yes',
          padding: '7px 40px',
          class: 'q-mr-auto',
        },
        cancel: {
          push: true,
          color: 'negative',
          label: 'Cancel',
          padding: '7px 40px',
          class: 'q-ml-auto',
        },
      })
        .onOk(async () => {
          const id = this.comment._id;
          await this.$store.dispatch('commentRemove', id);
        })
        .onCancel(() => {});
    },
  },

  computed: {
    ...mapGetters(['getUserState', 'isAuth', 'getComments']),

    isLiked() {
      return this.comment && this.likes && this.getUserState
        ? this.likes.includes(this.getUserState._id)
        : '';
    },

    showReply() {
      return this.isChildShown;
    },

    date() {
      return convertDate(this.comment.dateCreated);
    },

    isMyComment() {
      if (this.comment && this.getUserState && this.getUserState._id) {
        return this.getUserState._id === this.comment.commentedBy;
      } else return false;
    },

    hasChildren() {
      return this.comment.children && this.comment.children.length;
    },
  },
};
</script>

<style lang="stylus">
.comment
  &__text
    border-radius 10px
    background-color #fffdfdde
.replies
  color #000000b3
.q-btn:before
  box-shadow none
</style>
