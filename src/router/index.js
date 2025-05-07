import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import Login from '../components/auth/Login.vue'
import Register from '../components/auth/Register.vue'
import Dashboard from '../components/Dashboard.vue'
import Home from '../components/views/Home.vue'
import Stores from '../components/views/Stores.vue'
import StoreDetail from '../components/views/StoreDetail.vue'
import Contacts from '../components/views/Contacts.vue'
import StorePage from '../components/views/StorePage.vue'
import StoreContactsPage from '../components/views/StoreContactsPage.vue'
import NotFound from '@/components/views/NotFound.vue'

// Rotas Admin
import AdminUser from '@/components/admin/AdminUser.vue'
import AdminSettings from '@/components/admin/AdminSettings.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminStores from '@/components/admin/AdminStores.vue'

import { useThemeStore } from '../stores/themeStore'
import { useLojaStore } from '../stores/lojaStore'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/404',
    name: 'NotFound'
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
        path: 'stores/:slug/detail',
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
    path: '/:slug([a-zA-Z0-9-]+)',
    name: 'StorePage',
    component: StorePage,
    beforeEnter: async (to, from, next) => {
      const lojaStore = useLojaStore();
      const themeStore = useThemeStore();
      
      const slug = to.params.slug?.toLowerCase().trim(); // Normaliza o slug
    
      try {
        const loja = await lojaStore.obterLojaPublica(slug);
        themeStore.applyTheme(loja.theme || 'default', loja.id);
        next();
      } catch (error) {
        console.error('Erro detalhado:', error);
        next({ name: 'NotFound' });
      }
    }
  },
  {
    path: '/:slug/contacts',
    name: 'StoreContactsPage',
    component: StoreContactsPage,
    beforeEnter: async (to, from, next) => {
      const themeStore = useThemeStore();
      const lojaStore = useLojaStore();

      try {
        const loja = await lojaStore.obterLojaPublica(to.params.slug);
        themeStore.applyTheme(loja.theme || 'default', loja.id);
        next();
      } catch (error) {
        next({ name: 'Login' });
      }
      
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'users',
        name: 'AdminUser',
        component: AdminUser
      },
      {
        path: 'stores',
        name: 'AdminStores',
        component: AdminStores
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: AdminSettings,
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    component: NotFound
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

  if (to.meta.requiresAdmin && !auth.isAdmin()) {
    return next({ name: 'Home' }) 
  }

  next()
})

export default router
