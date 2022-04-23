<template>
  <router-view></router-view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'LayoutDefault',

  components: {},

  setup() {
    return {
      leftDrawerOpen: ref(false),
    };
  },
};
</script>

<style scoped lang="stylus"></style>
