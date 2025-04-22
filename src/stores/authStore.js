// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider, onAuthStateChanged, signInWithPopup, signOut } from '../services/firebase'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const router = useRouter()
  const isLoading = ref(true)
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
    isLoading.value = false
  }

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Busca o usuário no backend pelo UID
        const res = await api.get(`/usuarios/firebase/${firebaseUser.uid}`)
        const backendUser = res.data

        user.value = backendUser
        localStorage.setItem('user', JSON.stringify(backendUser))
      } catch (error) {
        console.error('Erro ao buscar usuário pelo Firebase UID:', error)
        user.value = null
        localStorage.removeItem('user')
      }
    } else {
      user.value = null
      localStorage.removeItem('user')
    }

    isLoading.value = false
  })

  async function loginWithGoogle() {
    isLoading.value = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      const idToken = await firebaseUser.getIdToken()
      // console.log("Firebase_uid do usuário logado", firebaseUser.uid);

      // Envia token para o backend (se necessário, mas parece que já está cuidando disso)
      await api.post('/login', { idToken })

      // Busca o usuário completo pelo firebase UID
      const res = await api.get(`/usuarios/firebase/${firebaseUser.uid}`)
      const backendUser = res.data

      // Atualiza store e localStorage com usuário completo (incluindo ID)
      user.value = backendUser
      localStorage.setItem('user', JSON.stringify(backendUser))
      localStorage.setItem('firebaseToken', idToken)

    } catch (err) {
      console.error('Erro no login com Google/backend:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)      
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('firebaseToken')
      router.push('/')
    }
  }

  const isLoggedIn = () => !!user.value

  return {
    user,
    isLoading,
    isLoggedIn,
    loginWithGoogle,
    logout,
  }
})
