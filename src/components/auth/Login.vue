<!-- src/components/auth/Login.vue -->
<template>
    <div class="max-w-sm mx-auto mt-20 p-4">
      <h2 class="text-xl font-bold mb-4">Entrar com Google</h2>
      <Button @click="login" :disabled="auth.isLoading">
        <i class="fa-brands fa-google mr-2"></i>
        {{ auth.isLoading ? 'Entrando…' : 'Login com Google' }}
      </Button>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../../stores/authStore'
  import { useRouter } from 'vue-router'
  
  const auth = useAuthStore()
  const router = useRouter()
  
  async function login() {
    try {
      await auth.loginWithGoogle()
      router.push({ path: '/stores' })
    } catch (e) {
      alert('Falha no login: ' + e.message)
    }
  }
  </script>
  