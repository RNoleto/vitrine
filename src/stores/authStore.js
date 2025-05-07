// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signOut } from '../services/firebase'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const router = useRouter()
  const isLoading = ref({
    global: true,
    email: false,
    google: false
  })
  const storedUser = localStorage.getItem('user')

  const isAdmin = () => user.value?.role === 'admin'

  if (storedUser) {
    user.value = JSON.parse(storedUser)
    isLoading.value.global = false
  }

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (localStorage.getItem('pendingSync')) return
    isLoading.value.global = true
    if (firebaseUser) {
      try {
        // Verificação de consistência aprimorada
        const shouldSync = !user.value || 
                          user.value.firebase_uid !== firebaseUser.uid || 
                          !localStorage.getItem('user');
  
        if (shouldSync) {
          const res = await api.get(`/usuarios/firebase/${firebaseUser.uid}`)
          user.value = res.data
          localStorage.setItem('user', JSON.stringify(res.data))
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('Sincronização pendente, tentando novamente...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          try {
            const res = await api.get(`/usuarios/firebase/${firebaseUser.uid}`)
            user.value = res.data
            localStorage.setItem('user', JSON.stringify(res.data))
          } catch (retryError) {
            console.error('Falha na ressincronização:', retryError)
          }
        }
      }
    } else {
      user.value = null
      localStorage.removeItem('user')
    }
    isLoading.value.global = false
  })

  async function registerWithEmail(fullName, email, password) {
    isLoading.value.email = true
    try {
      localStorage.setItem('pendingSync', 'true')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user
      const idToken = await firebaseUser.getIdToken()
      await api.post('/login', { 
        idToken,
        name: fullName
      })
      await signOut(auth)
      localStorage.removeItem('pendingSync') // Remover flag
      localStorage.removeItem('user')
      localStorage.removeItem('firebaseToken')

      alert('Cadastro realizado! Faça login para continuar')
      router.push('/login')
    } catch (err) {
      localStorage.removeItem('pendingSync')
      console.error('Erro no cadastro:', err)
      throw err
    } finally {
      isLoading.value.email = false
    }
  }

  async function loginWithEmail(email, password) {
    isLoading.value.email = true
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user
  
      const idToken = await firebaseUser.getIdToken()
      const loginResponse = await api.post('/login', { idToken }) // Alterado
      
      // Usa os dados direto da resposta
      user.value = loginResponse.data.user
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user))
      localStorage.setItem('firebaseToken', idToken)
  
    } catch (err) {
      console.error('Erro no login com Email:', err)
      throw err
    } finally {
      isLoading.value.email = false
    }
  }

  async function loginWithGoogle() {
    isLoading.value.google = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      const idToken = await firebaseUser.getIdToken()

      // Modifique esta parte
      const loginResponse = await api.post('/login', { idToken })
      const backendUser = loginResponse.data.user

      user.value = backendUser
      localStorage.setItem('user', JSON.stringify(backendUser))
      localStorage.setItem('firebaseToken', idToken)

    } catch (err) {
      console.error('Erro no login com Google/backend:', err)
      throw err
    } finally {
      isLoading.value.google = false
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

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      alert('Email de recuperação enviado!')
    } catch (e) {
      throw new Error('Falha ao enviar email de recuperação')
    }
  }

  const isLoggedIn = () => !!user.value

  return {
    user,
    isLoading,
    isLoggedIn,
    isAdmin,
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    resetPassword,
    logout,
  }
})
