import jwtDecode from 'jwt-decode';
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
  {
    path: '/auth/',
    name: 'AuthLayout',
    component: () => import('@/layouts/emptyLayout.vue'),
    children: [
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/views/SignupView.vue'),
      },
      {
        path: 'login',
        name: 'LogIn',
        component: () => import('@/views/LoginView.vue'),
      },
    ],
  },
  {
    path: '/',
    redirect: { name: 'HomeView' },
    name: 'MainLayout',
    component: () => import('@/layouts/mainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'HomeView',
        component: () => import('@/views/HomeView.vue'),
        children: [
          {
            path: '/:page?',
            component: () => import('@/components/PostsBlock.vue'),
          },
        ],
      },
      {
        path: 'post/:id',
        name: 'PostDetailsView',
        component: () => import('@/views/PostDetailsView.vue'),
      },
      {
        path: 'author/:id',
        name: 'AuthorView',
        component: () => import('@/views/AuthorView.vue'),
      },
      {
        path: 'new-post',
        name: 'NewPost',
        component: () => import('@/views/NewPostView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = jwtDecode(token);

    if (Date.now() >= decodedToken.exp * 1000) {
      store.dispatch('logOut');
      router.push({ name: 'HomeView' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
