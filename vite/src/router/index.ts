import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginForm from '../views/LoginForm.vue';
import DynamicForm from '../views/DynamicForm.vue';
import ArrayBinding from '../views/ArrayBinding.vue';
import DynamicRules from '../views/DynamicRules.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginForm
  },
  {
    path: '/array-binding',
    component: ArrayBinding
  },
  {
    path: '/dynamic-form',
    component: DynamicForm
  },
  {
    path: '/dynamic-rules',
    component: DynamicRules
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
