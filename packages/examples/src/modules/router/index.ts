import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import HomeForm from '~/pages/HomeForm.vue'
import KeyedForm from '~/pages/KeyedForm.vue'
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
    path: '/signup',
    name: 'signup',
    component: SignupForm
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicForm
  },
  {
    path: '/keyed',
    name: 'keyed',
    component: KeyedForm
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
