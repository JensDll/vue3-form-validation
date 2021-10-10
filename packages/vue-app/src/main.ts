import { createApp } from 'vue'
import { router } from './modules/router'
import { configureValidation } from 'vue3-form-validation'
import App from './App.vue'

const validation = configureValidation({
  defaultValidationBehavior: 'lazier'
})

createApp(App).use(router).use(validation).mount('#app')
