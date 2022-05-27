<template>
  <AuthorCard v-if="author" :author="isOwnProfile ? getUserData : author" />
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

  mounted() {
    this.fetchAuthor();
  },

  methods: {
    async fetchAuthor() {
      try {
        this.author = await this.$store.dispatch(
          'fetchAuthor',
          this.$route.params.id
        );
      } catch (error) {
        this.$router.push({ name: 'NotFound' });
      }
    },
  },

  computed: {
    ...mapGetters(['getUserData']),

    isOwnProfile() {
      return this.getUserData
        ? this.author._id === this.getUserData._id
        : false;
    },
  },
};
</script>

<style></style>
