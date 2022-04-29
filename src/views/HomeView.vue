<template>
  <PostsPage />
</template>

<script>
import PostsPage from '@/components/PostsBlock.vue';

export default {
  name: 'HomeView',
  components: { PostsPage },
  mounted() {
    this.$store.dispatch('getPosts', { params: { limit: 5, skip: 0 } });
  },
};
</script>
