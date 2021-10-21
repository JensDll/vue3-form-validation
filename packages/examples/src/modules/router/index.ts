import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import HomeForm from '~/pages/HomeForm.vue'
import BasicForm from '~/pages/BasicForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'
import SignupForm from '~/pages/SignupForm.vue'
import DynamicObjectForm from '~/pages/DynamicObjectForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeForm
  },
  {
    path: '/basic',
    name: 'basic',
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
  },
  {
    path: '/dynamic-object',
    name: 'dynamic-object',
    component: DynamicObjectForm
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
