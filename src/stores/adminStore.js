import { defineStore } from 'pinia';
import api from '../services/api'

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        stores: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchStores(){
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/stores')
                this.stores = response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Erro ao buscar lojas'
            } finally {
                this.loading = false
            }
        }
    }
})