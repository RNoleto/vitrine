<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useAuthStore } from '@/stores/authStore'
import { useFeedbackStore } from '@/stores/feedbackStore'
import MetricCard from '../ui/MetricCard.vue'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const feedbackStore = useFeedbackStore()

const searchQuery = ref('')
const selectedRoleFilter = ref('all')
const isSavingRole = ref(false)
const isDeletingUser = ref(false)

// Modal states
const roleModalOpen = ref(false)
const selectedUserForRole = ref(null)
const targetRole = ref('user')

const deleteModalOpen = ref(false)
const selectedUserForDelete = ref(null)

const today = new Date().toLocaleDateString('pt-BR')

const totalUsers = computed(() => (adminStore.users ?? []).length)
const adminCount = computed(() => (adminStore.users ?? []).filter(u => u.role === 'admin').length)
const userCount = computed(() => (adminStore.users ?? []).filter(u => u.role === 'user' || !u.role).length)
const todayUsers = computed(() => {
  const users = adminStore.users ?? []
  return users.filter(u => {
    if (!u.created_at) return false
    const userDate = new Date(u.created_at).toLocaleDateString('pt-BR')
    return userDate === today
  }).length
})

const filteredUsers = computed(() => {
  let list = adminStore.users ?? []
  
  if (selectedRoleFilter.value !== 'all') {
    list = list.filter(u => {
      const r = u.role || 'user'
      return r === selectedRoleFilter.value
    })
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(u => 
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))
    )
  }
  
  return list
})

function openChangeRoleModal(user, newRole) {
  selectedUserForRole.value = user
  targetRole.value = newRole
  roleModalOpen.value = true
}

function openDeleteModal(user) {
  selectedUserForDelete.value = user
  deleteModalOpen.value = true
}

async function confirmRoleChange() {
  if (!selectedUserForRole.value) return
  isSavingRole.value = true
  try {
    const res = await adminStore.updateUserRole(selectedUserForRole.value.id, targetRole.value)
    feedbackStore.showSuccess(res.message || 'Regra de usuário atualizada com sucesso!')
    roleModalOpen.value = false
    selectedUserForRole.value = null
  } catch (err) {
    feedbackStore.showError(err.message || 'Erro ao atualizar role do usuário.')
  } finally {
    isSavingRole.value = false
  }
}

async function confirmUserDelete() {
  if (!selectedUserForDelete.value) return
  isDeletingUser.value = true
  try {
    const res = await adminStore.deleteUser(selectedUserForDelete.value.id)
    feedbackStore.showSuccess(res.message || 'Usuário removido com sucesso!')
    deleteModalOpen.value = false
    selectedUserForDelete.value = null
  } catch (err) {
    feedbackStore.showError(err.message || 'Erro ao remover usuário.')
  } finally {
    isDeletingUser.value = false
  }
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

onMounted(() => {
  adminStore.fetchUsers()
})
</script>

<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gerenciamento de Usuários & Roles</h1>
        <p class="text-sm text-gray-600 mt-1">
          Controle as permissões de acesso da plataforma. Defina quem é 
          <span class="font-semibold text-indigo-600">Administrador</span> ou <span class="font-semibold text-gray-700">Usuário Padrão</span>.
        </p>
      </div>
    </div>

    <!-- Cards de Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total de Usuários</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalUsers }}</p>
        </div>
        <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <i class="fa-solid fa-users text-lg"></i>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-purple-600 uppercase tracking-wider">Administradores</p>
          <p class="text-2xl font-bold text-purple-900 mt-1">{{ adminCount }}</p>
        </div>
        <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
          <i class="fa-solid fa-user-shield text-lg"></i>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuários Padrão</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">{{ userCount }}</p>
        </div>
        <div class="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-bold">
          <i class="fa-solid fa-user text-lg"></i>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Novos Hoje</p>
          <p class="text-2xl font-bold text-emerald-700 mt-1">{{ todayUsers }}</p>
        </div>
        <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <i class="fa-solid fa-user-plus text-lg"></i>
        </div>
      </div>
    </div>

    <!-- Barra de Busca e Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-80">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nome ou e-mail..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <label class="text-xs font-semibold text-gray-600 whitespace-nowrap">Filtrar por Papel:</label>
        <select 
          v-model="selectedRoleFilter"
          class="text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">Todos os papéis</option>
          <option value="admin">Apenas Administradores</option>
          <option value="user">Apenas Usuários Padrão</option>
        </select>
      </div>
    </div>

    <!-- Tabela de Usuários -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div v-if="adminStore.loading" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-indigo-600 mb-2"></i>
        <p class="text-sm">Carregando lista de usuários...</p>
      </div>

      <div v-else-if="adminStore.error" class="p-8 text-center text-red-600 bg-red-50">
        <i class="fa-solid fa-triangle-exclamation text-xl mb-1"></i>
        <p class="text-sm font-medium">{{ adminStore.error }}</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-users-slash text-2xl text-gray-300 mb-2"></i>
        <p class="text-sm font-medium">Nenhum usuário encontrado com os filtros aplicados.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3">Usuário</th>
              <th class="px-5 py-3">Email</th>
              <th class="px-5 py-3">Papel / Role</th>
              <th class="px-5 py-3">Data Cadastro</th>
              <th class="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50/80 transition-colors">
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shadow-xs border border-indigo-200">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ user.name || 'Sem nome' }}</p>
                    <p v-if="authStore.user?.id === user.id" class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                      (Sua Conta)
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 whitespace-nowrap text-gray-600 font-mono text-xs">
                {{ user.email }}
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <span 
                  v-if="user.role === 'admin'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200"
                >
                  <i class="fa-solid fa-user-shield text-[11px]"></i>
                  Administrador
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  <i class="fa-solid fa-user text-[11px]"></i>
                  Usuário
                </span>
              </td>

              <td class="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                {{ user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-' }}
              </td>

              <td class="px-5 py-4 whitespace-nowrap text-right space-x-2">
                <!-- Alterar Role -->
                <button 
                  v-if="user.role !== 'admin'"
                  @click="openChangeRoleModal(user, 'admin')"
                  title="Promover a Administrador"
                  class="px-2.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-all cursor-pointer"
                >
                  Promover a Admin
                </button>
                <button 
                  v-else
                  @click="openChangeRoleModal(user, 'user')"
                  title="Rebaixar a Usuário Padrão"
                  :disabled="authStore.user?.id === user.id && adminCount <= 1"
                  class="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Alterar para Usuário
                </button>

                <!-- Deletar Usuário -->
                <button 
                  @click="openDeleteModal(user)"
                  title="Excluir Usuário"
                  :disabled="authStore.user?.id === user.id"
                  class="px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Confirmação de Alteração de Role -->
    <div v-if="roleModalOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6 space-y-4">
        <div class="flex items-center gap-3 text-indigo-600">
          <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <i class="fa-solid fa-user-gear text-lg"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Alterar Regra do Usuário</h3>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed">
          Tem certeza que deseja alterar o papel do usuário 
          <strong class="text-gray-900">{{ selectedUserForRole?.name }}</strong> 
          ({{ selectedUserForRole?.email }}) para 
          <strong class="uppercase text-indigo-600">{{ targetRole }}</strong>?
        </p>

        <div v-if="targetRole === 'admin'" class="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800 space-y-1">
          <p class="font-bold flex items-center gap-1">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Atenção com Permissões:
          </p>
          <p>O usuário terá acesso total ao Painel Administrativo, métricas do sistema e gerenciamento de outros usuários.</p>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button 
            @click="roleModalOpen = false"
            class="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            @click="confirmRoleChange"
            :disabled="isSavingRole"
            class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <i v-if="isSavingRole" class="fa-solid fa-spinner fa-spin"></i>
            Confirmar Alteração
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="deleteModalOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6 space-y-4">
        <div class="flex items-center gap-3 text-red-600">
          <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <i class="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Excluir Usuário</h3>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed">
          Tem certeza que deseja excluir o usuário 
          <strong class="text-gray-900">{{ selectedUserForDelete?.name }}</strong> 
          ({{ selectedUserForDelete?.email }})? Esta ação não poderá ser desfeita.
        </p>

        <div class="flex justify-end gap-3 pt-2">
          <button 
            @click="deleteModalOpen = false"
            class="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            @click="confirmUserDelete"
            :disabled="isDeletingUser"
            class="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <i v-if="isDeletingUser" class="fa-solid fa-spinner fa-spin"></i>
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
