<template>
  <PostsBlock v-if="getPosts" />
  <div v-else class="text-center q-mt-md">Sorry there are no posts</div>
</template>

<script>
import PostsBlock from '@/components/PostsBlock.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  components: { PostsBlock },
  async mounted() {
    const currentPage = +this.$route.query.page || 1;
    let payload = {
      params: {
        limit: 5,
        skip: currentPage !== 1 ? (currentPage - 1) * 5 : 0,
      },
    };
    await this.$store.dispatch('fetchPosts', payload);
  },
  computed: {
    ...mapGetters(['getPosts']),
  },
};
</script>
