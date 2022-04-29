<template>
  <router-view></router-view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutDefault',
  async created() {
    const token = localStorage.getItem('token');
    if (!this.isAuth && token) {
      await this.$store.dispatch('getUser');
    }
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
};
</script>
