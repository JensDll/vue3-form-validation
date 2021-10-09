import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import BasicForm from '~/pages/BasicForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: BasicForm
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicForm
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
