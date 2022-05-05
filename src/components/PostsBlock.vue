<template>
  <div v-for="post in getPosts.data" :key="post.id">
    <Post :post="post" />
  </div>
  <Pagination />
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
  },
};
</script>
