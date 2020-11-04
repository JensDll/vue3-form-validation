import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginForm from '../views/LoginForm.vue';
import ButtonDemo from '../views/ButtonDemo.vue';
import SearchSelect from '../views/SearchSelect.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginForm
  },
  {
    path: '/button-demo',
    component: ButtonDemo
  },
  {
    path: '/search-select',
    component: SearchSelect
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
