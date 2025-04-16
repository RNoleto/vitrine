import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

createApp(App)
.use(router)
.use(pinia)
.mount('#app')

