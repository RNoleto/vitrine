// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// suas views
import Login from '../components/auth/Login.vue'
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
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/stores',
    name: 'Stores',
    component: Stores,
    meta: { requiresAuth: true }
  },
  {
    path: '/stores/:id/detail',
    name: 'StoreDetail',
    component: StoreDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/stores/:id',
    name: 'StorePage',
    component: StorePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts/:id/contacts',
    name: 'StoreContactsPage',
    component: StoreContactsPage,
    meta: { requiresAuth: true }
  },
  // opcional: rota catch-all para 404
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

// 1) Cria o router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 2) Protege rotas que exigem login
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  // se a rota exige auth e o usuário NÃO estiver logado...
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return next({ name: 'Login' })
  }
  next()
})

export default router
