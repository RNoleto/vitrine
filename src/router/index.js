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

import { useThemeStore } from '../stores/themeStore'
import { useLojaStore } from '../stores/lojaStore'

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
    component: StorePage,
    beforeEnter: (to, from, next) => {
      const themeStore = useThemeStore();
      const lojaStore = useLojaStore();
      
      lojaStore.obterLojaPublica(to.params.id).then(loja => {
        themeStore.applyTheme(loja.theme || 'default', to.params.id);
        next();
      });
    }
  },
  {
    path: '/contacts/:id/contacts',
    name: 'StoreContactsPage',
    component: StoreContactsPage,
    beforeEnter: (to, from, next) => {
      const themeStore = useThemeStore();
      const lojaStore = useLojaStore();
      
      lojaStore.obterLojaPublica(to.params.id).then(loja => {
        themeStore.applyTheme(loja.theme || 'default', to.params.id);
        next();
      });
    }
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
