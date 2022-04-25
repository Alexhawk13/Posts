import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/auth/',
    name: 'AuthLayout',
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
  {
    path: '/main/',
    name: 'MainLayout',
    component: () => import('../layouts/mainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'HomePage',
        component: () => import('../views/HomeView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
