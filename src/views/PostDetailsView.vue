<template>
  <PostDetails
    @editMode="isEditing = !isEditing"
    @showAllComments="showAllComments = !showAllComments"
    v-if="!isLoading"
    :post="getDetailsPost"
    :comments="getComments"
  />

  <CommentBlock
    v-if="!isEditing && !isLoading"
    :showAllComments="showAllComments"
  />
</template>

<script>
import PostDetails from '@/components/PostDetails.vue';
import CommentBlock from '@/components/CommentBlock.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PostDetailsView',
  components: { PostDetails, CommentBlock },

  data() {
    return {
      isLoading: true,
      post: {},
      showAllComments: false,
      isEditing: false,
    };
  },

  async mounted() {
    try {
      this.isLoading = true;

      const response = await this.$store.dispatch(
        'fetchDetailsPost',
        this.$route.params.id
      );
    } finally {
      this.isLoading = false;
    }
  },

  computed: {
    ...mapGetters(['getComments', 'getUserState', 'getDetailsPost']),
  },
};
</script>

<style lang="stylus" scoped>
.showComments
.leaveComment
  padding: 16px;
  background-color: white;
  border-radius: 10px;
  color: blue;
  cursor: pointer;
</style>
