import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import RegisterForm from '../views/RegisterForm.vue';
import DynamicForm from '../views/DynamicForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RegisterForm
  },
  {
    path: '/dynamic-form',
    component: DynamicForm
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
