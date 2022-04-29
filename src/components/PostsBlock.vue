<template>
  <div v-for="post in posts" :key="post.id">
    <Post :post="post" />
  </div>
</template>

<script>
import Post from '@/components/Post.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PostsBlock',
  components: { Post },
  computed: {
    ...mapGetters(['posts']),
  },
  methods: {
    detailsPage() {
      this.$router.push({ name: 'HomeView' });
    },
  },
};
</script>

<style></style>
