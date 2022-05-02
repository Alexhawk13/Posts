import { createRouter, createWebHistory } from 'vue-router';

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
    path: '/',
    name: 'MainLayout',
    component: () => import('../layouts/mainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'HomeView',
        component: () => import('../views/HomeView.vue'),
        beforeRouteUpdate(to, from, next) {
          console.log('Leaving Route');
        },
        children: [
          {
            path: '/:id?',
            component: () => import('../components/PostsBlock.vue'),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
