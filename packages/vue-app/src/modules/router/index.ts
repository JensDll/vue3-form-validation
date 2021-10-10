import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import BasicForm from '~/pages/BasicForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'
import SignupForm from '~/pages/SignupForm.vue'

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
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupForm
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
