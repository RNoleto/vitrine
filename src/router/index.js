import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/views/Home.vue'
import Stores from '../components/views/Stores.vue'
import Contacts from '../components/views/Contacts.vue'
import StoreDetail from '../components/views/StoreDetail.vue'
import StoreContacts from '../components/views/StoreContacts.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/stores', name: 'Stores', component: Stores },
    { path: '/contacts', name: 'Contacts', component: Contacts },
    { path: '/stores/:id', name: 'StoreDetail', component: StoreDetail },
    { path: '/contacts/:id/contacts', name: 'StoreContacts', component: StoreContacts },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router