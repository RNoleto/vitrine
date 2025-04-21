import { defineStore } from 'pinia'
import api from '../services/api'
import { useAuthStore } from './authStore'

function base64ToBlob(base64Data, contentType = '') {
  const byteCharacters = atob(base64Data.split(',')[1])
  const byteArrays = []

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512)
    const byteNumbers = new Array(slice.length)
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

export const useLojaStore = defineStore('loja', {
  state: () => ({
    lojas: [],
    carregando: false,
    erro: null
  }),

  actions: {
    async adicionarLoja(loja) {
      const authStore = useAuthStore()
      const firebase_uid = authStore.user?.firebase_uid

      this.carregando = true
      try {
        const formData = new FormData()
        formData.append('name', loja.name)
        formData.append('firebase_uid', firebase_uid)

        if (loja.logoBase64) {
          const contentType = loja.logoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(loja.logoBase64, contentType)
          formData.append('logo', blob, 'logo.png')
        }

        if (Array.isArray(loja.links)) {
          loja.links.forEach((link, i) => {
            formData.append(`links[${i}][icone]`, link.icone)
            formData.append(`links[${i}][texto]`, link.texto)
            formData.append(`links[${i}][url]`, link.url)
          })
        }

        const { data } = await api.post('/stores', formData)
        this.lojas.push(data)
        this.erro = null
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao criar loja'
      } finally {
        this.carregando = false
      }
    },

    async listarLojas() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        this.erro = 'Usuário não autenticado'
        return
      }

      if (this.lojas.length > 0) return

      this.carregando = true
      try {
        const response = await api.get('/lojas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        this.lojas = response.data.filter(loja =>
          loja.user_id === userId && loja.ativo === 1
        )

        this.erro = null
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao listar lojas'
      } finally {
        this.carregando = false
      }
    },

    async editarLoja(id, dadosAtualizados) {
      const authStore = useAuthStore()
      const firebase_uid = authStore.user?.firebase_uid

      this.carregando = true
      this.erro = null

      try {
        const formData = new FormData()

        // Campos básicos
        if (dadosAtualizados.name) {
          formData.append('name', dadosAtualizados.name)
        }

        if (dadosAtualizados.ativo !== undefined) {
          formData.append('ativo', dadosAtualizados.ativo)
        }

        // Logo: se for base64 (imagem nova), converter para blob e enviar
        if (
          dadosAtualizados.logoBase64 &&
          typeof dadosAtualizados.logoBase64 === 'string' &&
          dadosAtualizados.logoBase64.startsWith('data:')
        ) {
          const contentType = dadosAtualizados.logoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(dadosAtualizados.logoBase64, contentType)
          formData.append('logo', blob, `logo.${contentType.split('/')[1]}`)
        }

        // Links
        if (Array.isArray(dadosAtualizados.links)) {
          dadosAtualizados.links.forEach((link, i) => {
            formData.append(`links[${i}][icone]`, link.icone)
            formData.append(`links[${i}][texto]`, link.texto)
            formData.append(`links[${i}][url]`, link.url)
          })
        }

        // Requisição PUT com FormData
        const response = await api.post(
          `/stores/${id}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        const lojaAtualizada = response.data
        const idx = this.lojas.findIndex(l => l.id === id)
        if (idx !== -1) this.lojas[idx] = lojaAtualizada

      } catch (e) {
        this.erro = 'Erro ao editar loja.'
        console.error(e)
      } finally {
        this.carregando = false
      }
    },


    async excluirLoja(id) {
      this.carregando = true

      try {
        await api.delete(`/stores/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        // Remove a loja do estado local
        const loja = this.lojas.find(loja => loja.id === id)
        if (loja) {
          loja.ativo = 0
        }
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao excluir loja'
      } finally {
        this.carregando = false
      }
    }
  }
})
