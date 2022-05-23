<template>
  <q-pagination
    class="flex-center"
    v-model="currentPage"
    :max="this.getPosts.data ? Math.ceil(getTotalPages) : 0"
    :max-pages="5"
    direction-links
  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PaginationBlock',
  data() {
    return {
      currentPage: +this.$route.query.page,
    };
  },

  mounted() {
    this.currentPage = +this.$route.query.page || 1;
    this.addRouteParam();
    if (
      !this.$route.query.page ||
      this.$route.query.page > this.getTotalPages
    ) {
      this.currentPage = 1;
    } else {
      this.$route.query.page;
    }
  },

  watch: {
    currentPage() {
      this.addRouteParam();
    },
    '$route.query.page'() {
      if (this.$route.name === 'HomeView') {
        this.currentPage
          ? (this.currentPage = +this.$route.query.page)
          : (this.currentPage = 1);
        this.fetchPosts();
      }
    },
  },
  computed: {
    ...mapGetters(['getPosts']),

    getTotalPages() {
      return this.getPosts.pagination.total / 5;
    },
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
      this.$router.push({
        name: 'HomeView',
        query: { page: this.currentPage },
      });
    },
  },
};
</script>

<style></style>
