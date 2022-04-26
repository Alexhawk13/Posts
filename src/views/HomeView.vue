<template>
  <div class="home"></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['isAuth']),
  },
};
</script>
