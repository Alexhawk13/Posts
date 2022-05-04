<template>
  <q-pagination
    :posts="getPosts"
    class="flex-center"
    v-model="currentPage"
    :max="this.getPosts ? Math.ceil(this.getPosts.pagination.total / 5) : 0"
    :max-pages="7"
    direction-links
  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PaginationBlock',
  data() {
    return {
      currentPage: +this.$route.query.page || 1,
    };
  },
  mounted() {
    this.addRouteParam();
    this.fetchPosts();
  },
  watch: {
    currentPage() {
      this.fetchPosts();
      this.addRouteParam();
    },
    '$route.query.page'() {
      if (this.$route.query.page == 1) {
        this.currentPage = 1;
      }
    },
  },
  computed: {
    ...mapGetters(['getPosts']),
  },
  methods: {
    async fetchPosts() {
      let payload = {
        params: {
          limit: 5,
          skip: this.currentPage !== 1 ? (this.currentPage - 1) * 5 : 0,
        },
      };

      await this.$store.dispatch('fetchPosts', payload);
    },
    addRouteParam() {
      this.$router.push({ query: { page: this.currentPage } });
    },
  },
};
</script>

<style></style>
