import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import RegisterForm from '../views/RegisterForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RegisterForm
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
