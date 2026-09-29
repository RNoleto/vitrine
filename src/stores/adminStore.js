import { defineStore } from 'pinia';
import api from '../services/api'

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        users: [],
        stores: [],
        contacts: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchUsers(){
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/users')
                this.users = response.data
                this.users = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) //Ordenar por data de cadastro
            } catch (error) {
                this.error = error.response?.data?.message || 'Erro ao buscar usuários'
            } finally {
                this.loading = false
            }
        },

        async fetchStores(){
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/public/stores')
                this.stores = response.data
                this.stores = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) //Ordenar por data de cadastro
            } catch (error) {
                this.error = error.response?.data?.message || 'Erro ao buscar lojas'
            } finally {
                this.loading = false
            }
        },

        async fetchContacts(){
            this.loading = true
            this.error = null
            try{
                const response = await api.get("/admin/contacts")
                this.contacts = response.data
            } catch (error){
                this.error = error.response?.data?.message || 'Erro ao buscar contatos'
            } finally {
                this.loading = false
            }
        },

        async updateUserRole(userId, newRole){
            try {
                const response = await api.put(`/admin/users/${userId}/role`, { role: newRole })
                const updatedUser = response.data.user
                const index = this.users.findIndex(u => u.id === userId)
                if (index !== -1 && updatedUser) {
                    this.users[index] = { ...this.users[index], ...updatedUser }
                }
                return response.data
            } catch (error) {
                const msg = error.response?.data?.error || error.response?.data?.message || 'Erro ao atualizar função do usuário'
                throw new Error(msg)
            }
        },

        async deleteUser(userId){
            try {
                const response = await api.delete(`/admin/users/${userId}`)
                this.users = this.users.filter(u => u.id !== userId)
                return response.data
            } catch (error) {
                const msg = error.response?.data?.error || error.response?.data?.message || 'Erro ao excluir usuário'
                throw new Error(msg)
            }
        }
    }
})