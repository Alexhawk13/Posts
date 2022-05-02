<template>
  <div v-for="post in this.posts ? this.posts.data : 0" :key="post.id">
    <Post :post="post" />
  </div>
  <Pagination :posts="posts" />
</template>

<script>
import Post from '@/components/Post.vue';
import { mapGetters } from 'vuex';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'PostsBlock',
  components: { Post, Pagination },
  computed: {
    ...mapGetters(['posts']),
  },
};
</script>

<style></style>
