import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import Login from '../components/auth/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Home from '../components/views/Home.vue'
import Stores from '../components/views/Stores.vue'
import StoreDetail from '../components/views/StoreDetail.vue'
import Contacts from '../components/views/Contacts.vue'
import StorePage from '../components/views/StorePage.vue'
import StoreContactsPage from '../components/views/StoreContactsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'stores',
        name: 'Stores',
        component: Stores
      },
      {
        path: 'stores/:id/detail',
        name: 'StoreDetail',
        component: StoreDetail
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: Contacts
      }
    ]
  },
  {
    path: '/store/:id',
    name: 'StorePage',
    component: StorePage
  },
  {
    path: '/contacts/:id/contacts',
    name: 'StoreContactsPage',
    component: StoreContactsPage
  },
  // fallback 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return next({ name: 'Login' })
  }
  next()
})

export default router
