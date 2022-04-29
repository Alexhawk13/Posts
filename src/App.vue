<template>
  <router-view></router-view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutDefault',
  mounted() {
    if (localStorage.getItem('token')) {
      this.$store.dispatch('getUser');
    }
  },
  computed: {
    ...mapGetters(['isAuth']),
  },
};
</script>
