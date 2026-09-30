import { defineStore } from 'pinia'
import api from '../services/api'

export const useDiscordStore = defineStore('discord', {
  state: () => ({
    webhooks: [],
    loading: false,
    testingId: null,
    error: null,
  }),

  actions: {
    async fetchWebhooks() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/discord-webhooks')
        this.webhooks = response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar bots do Discord.'
      } finally {
        this.loading = false
      }
    },

    async addWebhook(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/discord-webhooks', payload)
        this.webhooks.unshift(response.data.webhook)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao cadastrar bot do Discord.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateWebhook(id, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/discord-webhooks/${id}`, payload)
        const index = this.webhooks.findIndex(w => w.id === id)
        if (index !== -1) {
          this.webhooks[index] = response.data.webhook
        }
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao atualizar bot do Discord.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteWebhook(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/discord-webhooks/${id}`)
        this.webhooks = this.webhooks.filter(w => w.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao remover bot do Discord.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async testWebhook(id) {
      this.testingId = id
      this.error = null
      try {
        const response = await api.post(`/discord-webhooks/${id}/test`)
        const index = this.webhooks.findIndex(w => w.id === id)
        if (index !== -1) {
          this.webhooks[index].last_sent_at = new Date().toISOString()
        }
        return response.data
      } catch (err) {
        const msg = err.response?.data?.message || 'Falha ao testar webhook do Discord.'
        throw new Error(msg)
      } finally {
        this.testingId = null
      }
    }
  }
})
