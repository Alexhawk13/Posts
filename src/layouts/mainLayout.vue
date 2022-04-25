<template>
  <q-layout class="bg" view="hHh lpR fFf">
    <Header></Header>
    <q-page-container>
      <router-view />
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
