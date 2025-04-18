// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, googleProvider, onAuthStateChanged, signInWithPopup, signOut } from '../services/firebase'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(true)

  // escuta mudanças de estado
  onAuthStateChanged(auth, u => {
    user.value = u
    isLoading.value = false
  })

  async function loginWithGoogle() {
    isLoading.value = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      const idToken = await firebaseUser.getIdToken()

      // Envia o token para o backend
      const res = await api.post('/login', {
        idToken,
      })

      console.log('Usuário do backend:', res.data.user)

      // Atualiza o estado local com o usuário do Firebase
      user.value = firebaseUser

    } catch(err){
      console.error('Erro no login com o backend:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await signOut(auth)
    user.value = null
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
