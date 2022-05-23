<template>
  <div class="wrapper">
    <div class="text-center">
      <h1 class="text-italic">Page not found</h1>
      <router-link :to="{ name: 'HomeView' }">
        <h3 class="cursor-pointer text-bold home-link q-pt-xl">Go Home</h3>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
.wrapper
  height 100vh
  width 100vw
  display flex
  justify-content center
  align-items center
  background-image url(../assets/wall.jpg)
  color white
  text-shadow 6px 4px 15px black
.home-link
  color #fff
</style>
