<template>
  <div class="form-wrapper">
    <h3 class="heading">Sign Up</h3>
    <q-form class="form" @submit.prevent="register">
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
        v-model="password"
        type="password"
        class="form__input"
        label="Password"
        filled
        :error="v$.password.$error"
        :error-message="v$.password.$errors[0]?.$message"
      />
      <q-input
        class="form__input"
        v-model="name"
        type="text"
        label="Name"
        filled
        :error="v$.name.$error"
        :error-message="v$.name.$errors[0]?.$message"
      />
      <q-btn
        class="form__button"
        type="submit"
        color="primary"
        label="Sign Up"
      />
      <p>
        Already have an account?<router-link :to="{ name: 'LogIn' }"
          ><strong> Log In</strong></router-link
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
  name: 'SignUp',
  data() {
    return {
      v$: useVuelidate(),
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

        showSuccessMessage('User successufully created');
      } catch (e) {
        showDangerMessage(e.response.data.error);
      }
    },
  },
};
</script>
