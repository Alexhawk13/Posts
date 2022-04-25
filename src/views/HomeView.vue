<template>
  <div v-if="loggedIn" class="home">
    <h1>Hello</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['loggedIn']),
  },
};
</script>
