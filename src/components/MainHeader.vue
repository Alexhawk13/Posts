<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title>
        <q-avatar>
          <q-btn flat round dense icon="satellite_alt" />
        </q-avatar>
        Swagger
      </q-toolbar-title>
      <q-space></q-space>
      <q-btn flat round dense icon="search" class="q-mr-xs" />
      <q-btn flat round dense icon="account_circle" />
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: 'MainHeader',
};
</script>
