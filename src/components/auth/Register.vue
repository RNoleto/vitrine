<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <!-- Cabeçalho -->
            <div class="text-center">
                <h1 class="text-3xl font-extrabold text-indigo-600">Criar Conta</h1>
                <p class="text-sm text-gray-500 mt-1">Crie sua conta para acessar o sistema</p>
            </div>

            <!-- Ilustração -->
            <div class="flex justify-center">
              <img src="/vitrine.png" alt="Login Illustration" class="w-28 h-28" />
            </div>

            <!-- Formulário de Cadastro -->
            <form @submit.prevent="register" class="space-y-4">
                <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input type="text" id="fullName" v-model="fullName" required minlength="3" pattern=".{3,}" title="Mínimo de 3 caracteres"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2" />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" v-model="email" required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2" />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
                    <input type="password" id="password" v-model="password" required minlength="6"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2" />
                </div>

                <Button type="submit" :disabled="auth.isLoading"
                    class="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                    {{ auth.isLoading ? 'Criando…' : 'Criar Conta' }}
                </Button>
            </form>

            <p class="text-sm text-gray-600 text-center">
                Já tem uma conta?
                <RouterLink to="/login" class="text-indigo-600 hover:underline">Faça login</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const fullName = ref('')
const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

async function register() {
    try {
        await auth.registerWithEmail( fullName.value, email.value, password.value)
        router.push({ path: '/home' })
    } catch (e) {
        alert('Erro no cadastro: ' + e.message)
    }
}
</script>