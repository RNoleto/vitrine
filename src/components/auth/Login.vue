<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-6">
      <!-- Branding -->
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-indigo-600">Vitrines</h1>
        <p class="text-sm text-gray-500 mt-1">Gerencie suas vitrines de forma inteligente</p>
      </div>

      <!-- Ilustração -->
      <div class="flex justify-center">
        <img
          src="/public/vitrine.png"
          alt="Login Illustration"
          class="w-28 h-28"
        />
      </div>

      <!-- Botão de Login -->
      <div>
        <Button
          @click="login"
          :disabled="auth.isLoading"
          class="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          <i class="fa-brands fa-google text-lg"></i>
          {{ auth.isLoading ? 'Entrando…' : 'Entrar com Google' }}
        </Button>
      </div>

      <!-- Rodapé opcional -->
      <p class="text-xs text-gray-400 text-center">© 2025 Vitrines. Todos os direitos reservados.</p>
    </div>
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
    router.push({ path: '/home' })
  } catch (e) {
    alert('Falha no login: ' + e.message)
  }
}
</script>
