<template>
  <q-card-section class="q-pa-none">
    <div class="comment row no-wrap items-start full-height q-py-sm q-px-none">
      <q-avatar @click="profileView" class="cursor-pointer q-mr-sm">
        <q-icon
          v-if="!author || !author.avatar"
          class="avatar comment__avatar"
          name="face"
          size="40px"
        ></q-icon>
        <img
          v-else
          class="avatar comment__avatar"
          :src="`${baseUrl + authorAvatar()}`"
        />
      </q-avatar>

      <div class="no-wrap q-pa-xs full-width">
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
                @click="likeComment"
                :disabled="isLoading"
              >
                <q-icon
                  :name="isLiked(comment) ? 'favorite' : 'favorite_border'"
                  :color="isLiked(comment) ? 'red' : 'black'"
                  size="sm"
                  class="likes"
                />
              </q-btn>

              <span>{{ likes.length }}</span>
            </div>
          </footer>
        </div>
        <div v-else>
          <div class="comment__text">
            <p class="comment__text__author text-bold q-px-sm q-mb-none">
              {{ author ? author.name : 'John Doe' }}
            </p>
            <q-input
              @keydown.enter.prevent="editComment"
              v-model="message"
              autogrow
              type="text"
              class="q-px-sm text-bold"
            >
            </q-input>
          </div>
          <footer class="text-bold cursor-pointer">
            <span class="q-pr-lg" @click="editComment">save changes</span>
            <span @click="cancelEdit">cancel</span>
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
    <div v-show="showReply">
      <div v-if="hasChildren">
        <CommentCard
          v-for="child in comment.children"
          :key="child._id"
          :comment="child"
          class="q-pl-xl"
        />
      </div>
    </div>

    <AddComment @replied="reply = false" v-show="reply" :comment="comment" />
  </q-card-section>
</template>

<script>
import { remove } from '@/helpers/deleteConfirmation';
import { mapGetters } from 'vuex';
import { monthAndDate } from '@/helpers/convertDate.js';
import AddComment from './AddComment.vue';
import { like, isLiked } from '@/helpers/like.js';

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
      likes: this.comment.likes,
      message: this.comment.text,
      isLoading: false,
      isChildShown: false,
      reply: false,
      isEditable: false,
    };
  },

  async mounted() {
    if (this.comment && this.comment.commentedBy) {
      this.author = await this.$store.dispatch(
        'fetchAuthor',
        this.comment.commentedBy
      );
    }
  },

  methods: {
    isLiked,
    remove,

    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },

    profileView() {
      this.$router.push({
        name: 'AuthorView',
        params: { id: this.author._id },
      });
    },

    async likeComment() {
      this.isLoading = true;
      this.likes = await like('commentLike', this.comment);
      this.isLoading = false;
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
      remove('comment', this.comment._id, 'commentRemove');
    },
  },

  computed: {
    ...mapGetters(['getUserData', 'isAuth', 'getComments']),

    showReply() {
      return this.isChildShown;
    },

    date() {
      return monthAndDate(this.comment.dateCreated);
    },

    isMyComment() {
      if (this.comment && this.getUserData && this.getUserData._id) {
        return this.getUserData._id === this.comment.commentedBy;
      } else return false;
    },

    hasChildren() {
      return this.comment.children && this.comment.children.length;
    },
  },
};
</script>

<style lang="stylus">
@import '@/styles/colors.styl'
@import '@/styles/variables.styl'
.comment__text
  border-radius 10px
  background-color $grey-1
  font-size $font-size-medium
  word-break break-all
  &__author
    overflow hidden
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 2
    line-clamp 2
    -webkit-box-orient vertical
.replies
  color $text-grey-2
.q-btn:before
  box-shadow none
</style>
