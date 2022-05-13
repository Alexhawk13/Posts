<template>
  <q-header elevated class="bg-indigo-2 text-white">
    <q-toolbar>
      <q-toolbar-title>
        <q-btn :to="{ name: 'HomeView', query: { page: 1 } }"
          ><q-avatar>
            <q-btn flat round dense icon="satellite_alt" />
          </q-avatar>
          Swagger</q-btn
        >
      </q-toolbar-title>
      <div>
        <router-link class="gt-xs" v-if="!isAuth" :to="{ name: 'LogIn' }">
          <q-btn
            color="blue-grey-6 text-bold"
            icon-right="login"
            label="Log In"
          />
        </router-link>
        <q-btn-dropdown
          v-if="isAuth"
          auto-close
          class="glossy gt-xs"
          color="blue-grey-6"
          :label="getUserState ? getUserState.name : ''"
          icon="account_circle"
        >
          <div class="row no-wrap q-pa-md">
            <div class="settings__column q-mx-auto column items-center">
              <q-avatar size="72px">
                <q-img
                  :src="
                    getUserState && getUserState.avatar
                      ? getUserState.avatar
                      : 'https://cdn.quasar.dev/img/boy-avatar.png'
                  "
                />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ getUserState ? getUserState.name : 'John Doe' }}
              </div>
              <q-btn
                v-if="isAuth"
                class="dropdown__profile"
                color="blue-grey-6"
                icon-right="manage_accounts"
                label="Profile"
              />
              <q-btn
                :to="{ name: 'HomeView' }"
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
      <q-btn class="burger xs blue-grey-6" icon="menu">
        <q-menu
          auto-close
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
                  <q-img
                    :src="
                      getUserState && getUserState.avatar
                        ? getUserState.avatar
                        : 'https://cdn.quasar.dev/img/boy-avatar.png'
                    "
                  />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs" v-if="isAuth">
                  {{ getUserState ? getUserState.name : '' }}
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
import { mapGetters } from 'vuex';

export default {
  name: 'MainHeader',
  computed: {
    ...mapGetters(['isAuth', 'getUserState']),
  },

  methods: {
    logOut() {
      this.$store.dispatch('logOut');
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-btn
  &.burger
    padding 13px 20px
  &:before
    box-shadow none
</style>
