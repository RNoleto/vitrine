import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/views/Home.vue'
import Stores from '../components/views/Stores.vue'
import Contacts from '../components/views/Contacts.vue'
import StorePage from '../components/views/StorePage.vue'
import StoreContactsPage from '../components/views/StoreContactsPage.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/stores', name: 'Stores', component: Stores },
    { path: '/contacts', name: 'Contacts', component: Contacts },
    { path: '/stores/:id', name: 'StorePage', component: StorePage },
    { path: '/contacts/:id/contacts', name: 'StoreContactsPage', component: StoreContactsPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router