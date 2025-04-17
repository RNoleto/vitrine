import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style.css'
import App from './App.vue'
import router from './router'
import Button from './components/ui/Button.vue'

const pinia = createPinia()

const app = createApp(App)
app.component('Button', Button)
app.use(router)
app.use(pinia)
app.mount('#app')

