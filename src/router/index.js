import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/views/Home.vue'
import Stores from '../components/views/Stores.vue'
import Contacts from '../components/views/Contacts.vue'
import StoreDetail from '../components/views/StoreDetail.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/stores', component: Stores },
    { path: '/contacts', component: Contacts },
    { path: '/stores/:id', name: 'StoreDetail', component: StoreDetail },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router