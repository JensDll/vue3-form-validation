import { createApp } from 'vue'

import { router } from './modules/router'
import { validation } from './modules/validation'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(validation)
app.mount('#app')

declare module 'vue3-form-validation' {
  interface CustomValidationBehaviorFunctions {
    change: any
    lazy: any
    lazier: any
    submit: any
  }
}
