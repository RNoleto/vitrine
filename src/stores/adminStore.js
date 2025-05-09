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
        }
    }
})