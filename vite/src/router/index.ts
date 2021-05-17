import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TextBinding from '../views/TextBinding.vue';
import ArrayBinding from '../views/ArrayBinding.vue';
import DynamicForm from '../views/DynamicForm.vue';
import InitialValueBinding from '../views/InitialValueBinding.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TextBinding
  },
  {
    path: '/array',
    component: ArrayBinding
  },
  {
    path: '/dynamic',
    component: DynamicForm
  },
  {
    path: '/initial-values',
    component: InitialValueBinding
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
