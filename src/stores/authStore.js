// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  auth,
  googleProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from '../services/firebase'

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
      user.value = result.user
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
