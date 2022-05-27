<template>
  <q-layout view="hHh lpR fFf">
    <Header />
    <q-page-container class="container">
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from '@/components/MainHeader.vue';
export default {
  name: 'MainLayout',
  components: { Header },
};
</script>
