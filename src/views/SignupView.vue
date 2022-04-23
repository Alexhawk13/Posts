<template>
  <div class="container column flex flex-center">
    <h3 class="test">Sign Up</h3>
    <q-form class="flex flex-center column form" @submit.prevent="register">
      <p>
        <q-input
          class="input"
          v-model="email"
          type="email"
          standout="bg-teal text-white"
          label="Email"
        />
        <span
          class="error-message flex flex-center"
          v-if="v$.email.$errors.length"
        >
          {{ v$.email.$errors[0].$message }}
        </span>
      </p>
      <p>
        <q-input
          v-model="password"
          type="password"
          class="input"
          label="password"
          standout="bg-teal text-white"
        />
        <span
          class="error-message flex flex-center"
          v-if="v$.password.$errors.length"
        >
          {{ v$.password.$errors[0].$message }}
        </span>
      </p>
      <p>
        <q-input
          class="input"
          v-model="name"
          type="text"
          standout="bg-teal text-white"
          label="Name"
        />
        <span
          class="error-message flex flex-center"
          v-if="v$.name.$errors.length"
        >
          {{ v$.name.$errors[0].$message }}
        </span>
      </p>
      <q-btn class="button" type="submit" color="primary" label="Sign Up" />
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

        showSuccessMessage('User successufuly created');
      } catch (e) {
        showDangerMessage(e.response.data.error);
      }
    },
  },
};
</script>
