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
        <img src="/vitrine.png" alt="Login Illustration" class="w-28 h-28" />
      </div>

      <!-- Formulário de Email/Senha -->
      <form @submit.prevent="loginEmail" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" id="password" v-model="password" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2" />
        </div>

        <Button type="submit" :disabled="auth.isLoading"
          class="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
          {{ auth.isLoading ? 'Entrando…' : 'Entrar com Email' }}
        </Button>
      </form>

      <!-- Divisor -->
      <div class="flex items-center gap-4">
        <div class="flex-1 border-t border-gray-200"></div>
        <span class="text-sm text-gray-400">OU</span>
        <div class="flex-1 border-t border-gray-200"></div>
      </div>

      <!-- Botão de Login Google -->
      <div>
        <Button @click="login" :disabled="auth.isLoading"
          class="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
          <i class="fa-brands fa-google text-lg"></i>
          {{ auth.isLoading ? 'Entrando…' : 'Entrar com Google' }}
        </Button>
      </div>

      <!-- Rodapé opcional -->
      <p class="text-sm text-gray-600 text-center">
        Não tem conta? 
        <RouterLink to="/register" class="text-indigo-600 hover:underline">Crie uma aqui</RouterLink>
      </p>
      <p class="text-xs text-gray-400 text-center">© 2025 Vitrines. Todos os direitos reservados.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

async function loginEmail() {
  try {
    await auth.loginWithEmail(email.value, password.value)
    router.push({ path: '/home' })
  } catch (error) {
    alert('Falha no login: ' + error.message)
  }
}

async function login() {
  try {
    await auth.loginWithGoogle()
    router.push({ path: '/home' })
  } catch (e) {
    let message = 'Erro desconhecido'
    switch (e.code) {
      case 'auth/invalid-email':
        message = 'Email inválido'
        break
      case 'auth/user-not-found':
        message = 'Usuário não encontrado'
        break
      case 'auth/wrong-password':
        message = 'Senha incorreta'
        break
      default:
        message = e.message
    }
    alert('Falha no login: ' + message)
  }
}
</script>
