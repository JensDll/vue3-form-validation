import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import LoginForm from '../views/LoginForm.vue';
import DynamicForm from '../views/DynamicForm.vue';
import ButtonDemo from '../views/ButtonDemo.vue';
import NestedForm from '../views/NestedForm.vue';
import TestForm from '../views/TestForm.vue';
import AnotherTestForm from '../views/AnotherTestForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login-form',
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
  },
  {
    path: '/test-form',
    component: TestForm
  },
  {
    path: '/another-test-form',
    component: AnotherTestForm
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
