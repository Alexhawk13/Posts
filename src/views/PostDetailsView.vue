<template>
  <div>
    <PostDetails v-if="!isLoading" :post="post" />
  </div>
</template>

<script>
import PostDetails from '@/components/PostDetails.vue';

export default {
  name: 'PostDetailsView',
  components: { PostDetails },
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
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
