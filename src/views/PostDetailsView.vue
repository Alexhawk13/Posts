<template>
  <div>
    <PostDetails v-if="isEmpty()" :post="post" />
  </div>
</template>

<script>
import PostDetails from '@/components/PostDetails.vue';
import api from '@/services/api.js';

export default {
  name: 'PostDetailsView',
  components: { PostDetails },
  data() {
    return {
      post: {
        type: Object,
        default: () => {},
      },
    };
  },
  async mounted() {
    const response = await api.get(`api/v1/posts/${this.$route.params.id}`);
    this.post = response.data;
  },
  methods: {
    isEmpty() {
      return !this.post.default;
    },
  },
};
</script>

<style></style>
