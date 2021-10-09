import { createApp } from 'vue'
import { router } from './modules/router'
import App from './App.vue'
// import 'tailwindcss/tailwind.css'

createApp(App).use(router).mount('#app')
