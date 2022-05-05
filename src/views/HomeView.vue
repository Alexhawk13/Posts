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
    let payload = {
      params: {
        limit: 5,
        skip: 0,
      },
    };
    await this.$store.dispatch('fetchPosts', payload);
  },
  computed: {
    ...mapGetters(['getPosts']),
  },
};
</script>
