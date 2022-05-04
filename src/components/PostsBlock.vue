<template>
  <div v-for="post in notEmptyPost" :key="post.id">
    <Post :post="post" />
  </div>
  <Pagination :posts="notEmptyPost" />
</template>

<script>
import Post from '@/components/Post.vue';
import { mapGetters } from 'vuex';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'PostsBlock',
  components: { Post, Pagination },
  computed: {
    ...mapGetters(['getPosts']),
    notEmptyPost() {
      return this.getPosts ? this.getPosts.data : '';
    },
  },
};
</script>

<style></style>
