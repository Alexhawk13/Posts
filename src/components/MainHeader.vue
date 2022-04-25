<template>
  <q-header elevated class="bg-indigo-2 text-white">
    <q-toolbar>
      <q-toolbar-title>
        <q-avatar>
          <q-btn flat round dense icon="satellite_alt" />
        </q-avatar>
        Swagger
      </q-toolbar-title>
      <q-space></q-space>
      <q-btn
        class="searchDesktop q-mr-xs gt-xs"
        flat
        dense
        icon="search"
        label="Search"
      />
      <q-btn
        class="searchDesktop gt-xs"
        flat
        dense
        icon="account_circle"
        label="Account"
      />
      <router-link v-if="!loggedIn" class="signUpBtn" :to="{ name: 'SignUp' }"
        >Sign Up</router-link
      >
      <router-link v-if="loggedIn" class="signUpBtn" :to="{ name: 'HomePage' }"
        >Log Out</router-link
      >
      <q-btn class="burger xs" icon="menu">
        <q-menu
          fit
          anchor="bottom left"
          self="top start"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 100px" v-if="loggedIn">
            <q-item class="burger__item" clickable>
              <q-item-section>
                <q-btn
                  flat
                  round
                  dense
                  icon="search"
                  class="q-mr-xs"
                  label="Search"
                />
              </q-item-section>
            </q-item>
            <q-separator light />
            <q-item class="burger__item" clickable>
              <q-item-section
                ><q-btn flat round dense icon="account_circle" label="Account"
              /></q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MainHeader',
  computed: {
    ...mapGetters(['loggedIn']),
  },
};
</script>

<style lang="stylus" scoped>
.burger__item
  font-size 16px
  background-color: #008183;
.searchDesktop
  font-size 16px
  margin-right 5px
  background-color: #008183;
  padding: 7px 10px;
.q-item
  padding 0
.signUpBtn
  border-radius 3px
  text-decoration none
  font-size 20px
  font-weight bold
  background-color #1976D2
  color #fff
  margin-right -12px
  padding 10px 40px
.q-btn
  text-transform none
  &.burger
    margin-right -20px
    padding: 13px 20px;
    background-color #008183
  &:before
    box-shadow none
</style>
