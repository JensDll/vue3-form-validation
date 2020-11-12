import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginForm from '../views/LoginForm.vue';
import DynamicForm from '../views/DynamicForm.vue';
import ButtonDemo from '../views/ButtonDemo.vue';
import NestedForm from '../views/NestedForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginForm
  },
  {
    path: '/dynamic-form',
    component: DynamicForm
  },
  {
    path: '/button-demo',
    component: ButtonDemo
  },
  {
    path: '/nested-form',
    component: NestedForm
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
