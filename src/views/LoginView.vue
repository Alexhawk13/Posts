<template>
  <div class="form-wrapper">
    <h3 class="heading">Log In</h3>
    <q-form class="form" @submit.prevent="getAuthToken">
      <q-input
        class="form__input"
        v-model="email"
        type="email"
        label="Email"
        filled
        :error="v$.email.$error"
        :error-message="v$.email.$errors[0]?.$message"
      />
      <q-input
        class="form__input"
        v-model="password"
        type="password"
        label="Password"
        filled
        :error="v$.password.$error"
        :error-message="v$.password.$errors[0]?.$message"
      />
      <q-btn
        class="form__button"
        type="submit"
        color="primary"
        label="Log In"
      />
      <p class="form__footer">
        New to Swagger?<router-link :to="{ name: 'SignUp' }"
          ><strong> Sign Up</strong></router-link
        >
      </p>
    </q-form>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import {
  showDangerMessage,
  showSuccessMessage,
} from '../helpers/notifications.js';

export default {
  name: 'LogIn',
  data() {
    return {
      v$: useVuelidate(),
      email: '',
      password: '',
    };
  },
  validations() {
    return {
      email: { required, email },
      password: { required, minLength: minLength(5) },
    };
  },
  methods: {
    async getAuthToken() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
      try {
        const data = {
          email: this.email,
          password: this.password,
        };
        await this.$store.dispatch('getAuthToken', data);

        this.$router.push({ name: 'home' });

        showSuccessMessage('Hello');
      } catch (e) {
        showDangerMessage(e.response.data.error);
      }
    },
  },
};
</script>
