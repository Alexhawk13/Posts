<template>
  <AuthorCard v-if="author" :author="isOwnProfile ? getUserState : author" />
  <AuthorPosts />
</template>

<script>
import AuthorCard from '@/components/AuthorCard.vue';
import AuthorPosts from '@/components/AuthorPosts.vue';
import { mapGetters } from 'vuex';

export default {
  components: { AuthorCard, AuthorPosts },
  data() {
    return {
      author: null,
    };
  },

  async mounted() {
    this.author = await this.$store.dispatch(
      'fetchUser',
      this.$route.params.id
    );
  },

  watch: {
    async '$route.params.id'() {
      this.author = await this.$store.dispatch(
        'fetchUser',
        this.$route.params.id
      );
    },
  },
  computed: {
    ...mapGetters(['getUserState']),

    isOwnProfile() {
      return this.getUserState
        ? this.author._id === this.getUserState._id
        : false;
    },
  },
};
</script>

<style></style>
