import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/auth/',
    name: 'AuthPage',
    component: () => import('../layouts/emptyLayout.vue'),
    children: [
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('../views/SignupView.vue'),
      },
      {
        path: 'login',
        name: 'LogIn',
        component: () => import('../views/LoginView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
