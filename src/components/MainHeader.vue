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
      <div>
        <q-btn-dropdown
          class="glossy gt-xs"
          color="blue-grey-8"
          label="Account Settings"
        >
          <div class="row no-wrap q-pa-md">
            <div class="settings__column column items-center">
              <q-avatar size="72px">
                <q-img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ user ? user.name : 'John Doe' }}
              </div>
              <q-btn
                v-if="isAuth"
                class="dropdown__profile"
                color="blue-grey-6"
                icon-right="manage_accounts"
                label="Profile"
              />
              <q-btn
                v-if="isAuth"
                @click="logOut"
                class="q-mt-sm"
                color="primary"
                label="Logout"
                icon-right="logout"
                v-close-popup
              />
              <router-link v-if="!isAuth" :to="{ name: 'LogIn' }"
                ><q-btn
                  color="primary"
                  label="Log In"
                  icon-right="login"
                  v-close-popup
              /></router-link>
            </div>
          </div>
        </q-btn-dropdown>
      </div>
      <q-btn class="burger xs blue-grey-8" icon="menu">
        <q-menu
          fit
          anchor="bottom left"
          self="top start"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 100px">
            <div class="row no-wrap q-pa-md">
              <div class="settings__column column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs" v-if="isAuth">
                  {{ user.name }}
                </div>
                <q-btn
                  v-if="isAuth"
                  class="dropdown__profile"
                  color="blue-grey-6"
                  icon-right="manage_accounts"
                  label="Profile"
                  v-close-popup
                />
                <q-btn
                  v-if="isAuth"
                  class="q-mt-sm"
                  color="primary"
                  label="Logout"
                  icon-right="logout"
                  v-close-popup
                  @click="logOut"
                />
                <router-link v-if="!isAuth" :to="{ name: 'LogIn' }"
                  ><q-btn
                    size="xs"
                    class="q-mt-sm"
                    color="primary"
                    label="Log In"
                    icon-right="login"
                    v-close-popup
                /></router-link>
              </div>
            </div>
            <q-separator />
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'MainHeader',
  computed: {
    ...mapGetters(['isAuth']),
    ...mapState(['user']),
  },
  methods: {
    logOut() {
      setTimeout(() => {
        this.$store.dispatch('logOut');
      }, 100);
    },
  },
};
</script>

<style lang="stylus" scoped>
.settings__column
  margin 0 auto
.burger__item
  font-size 16px
.searchDesktop
  font-size 16px
  margin-right 5px
  background-color #008183
  padding 7px 10px
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
  &.burger
    margin-right -20px
    padding 13px 20px
  &:before
    box-shadow none
</style>
