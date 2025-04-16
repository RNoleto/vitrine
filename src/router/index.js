import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/views/Home.vue'
import Stores from '../components/views/Stores.vue'
import Contacts from '../components/views/Contacts.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/stores', component: Stores },
    { path: '/contacts', component: Contacts },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router