<template>
  <div class="column flex flex-center">
    <div class="form-wrapper">
      <h3>Sign Up</h3>
      <q-form class="flex flex-center column form" @submit.prevent="register">
        <div class="input-wrapper">
          <q-input
            class="input"
            v-model="email"
            type="email"
            label="Email"
            filled
            :error="v$.email.$error"
            :error-message="v$.email.$errors[0]?.$message"
          />
        </div>
        <div class="input-wrapper">
          <q-input
            v-model="password"
            type="password"
            class="input"
            label="password"
            filled
            :error="v$.password.$error"
            :error-message="v$.password.$errors[0]?.$message"
          />
        </div>
        <div class="input-wrapper">
          <q-input
            class="input"
            v-model="name"
            type="text"
            label="Name"
            filled
            :error="v$.name.$error"
            :error-message="v$.name.$errors[0]?.$message"
          />
        </div>
        <q-btn class="button" type="submit" color="primary" label="Sign Up" />
        <p>
          Already have an account?<router-link :to="{ name: 'LogIn' }"
            ><strong> Log In</strong></router-link
          >
        </p>
      </q-form>
    </div>
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
  name: 'SignUp',
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      email: '',
      password: '',
      name: '',
    };
  },
  validations() {
    return {
      email: { required, email },
      password: { required, minLength: minLength(5) },
      name: { required },
    };
  },
  methods: {
    async register() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      try {
        const data = {
          email: this.email,
          password: this.password,
          name: this.name,
          extra_details: '',
          skills: '',
          profession: '',
          details: '',
        };
        await this.$store.dispatch('register', data);

        this.$router.push({ name: 'LogIn' });

        showSuccessMessage('User successufuly created');
      } catch (e) {
        showDangerMessage(e.response.data.error);
      }
    },
  },
};
</script>
