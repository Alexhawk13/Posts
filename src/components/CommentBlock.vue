<template>
  <div v-if="isAuth">
    <AddComment :post="post" />
  </div>
  <div v-else class="text-center">
    To leave a comment you should
    <router-link :to="{ name: 'LogIn' }"><strong> Log In</strong></router-link>
    first
  </div>

  <div v-if="!isLoading">
    <div v-if="getComments.length">
      <CommentCard
        v-show="showAllComments"
        v-for="comment in createCommentsTree"
        :key="comment.id"
        :comment="comment"
      />
    </div>
    <div v-else class="text-center text-bold q-pb-lg">
      There are no comments yet
    </div>
  </div>
</template>

<script>
import CommentCard from '@/components/CommentCard.vue';
import AddComment from '@/components/AddComment.vue';
import { mapGetters } from 'vuex';
import { createTree } from '@/helpers/createTree';

export default {
  name: 'CommentBlock',
  components: { CommentCard, AddComment },
  props: {
    showAllComments: {
      type: Boolean,
      default: () => false,
    },
  },

  data() {
    return {
      isLoading: true,
      post: {},
    };
  },

  async mounted() {
    try {
      this.isLoading = true;

      const response = await this.$store.dispatch(
        'fetchDetailsPost',
        this.$route.params.id
      );
      this.post = response.data;

      await this.$store.dispatch('fetchComments', this.$route.params.id);
    } finally {
      this.isLoading = false;
    }
  },

  computed: {
    ...mapGetters(['getComments', 'isAuth']),

    createCommentsTree() {
      return createTree(this.getComments);
    },
  },
};
</script>
