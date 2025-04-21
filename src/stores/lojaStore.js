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

      // Verificação de usuário autenticado
      if (!userId) {
        this.erro = 'Usuário não autenticado'
        return
      }

      this.carregando = true
      try {
        const response = await api.get('/lojas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        // Filtra lojas do usuário atual e ativas
        this.lojas = response.data.filter(loja =>
          loja.user_id === userId && loja.ativo === 1
        )

        this.erro = null
      } catch (e) {
        // Captura erro e exibe mensagem de erro
        this.erro = e.response?.data?.error || 'Erro ao listar lojas'
      } finally {
        this.carregando = false
      }
    },

    async editarLoja(id, loja) {
      this.carregando = true
      try {
        const formData = new FormData()
        formData.append('name', loja.name)
        formData.append('ativo', loja.ativo ?? 1)
    
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
    
        const response = await api.post(`/stores/${id}?_method=PUT`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
    
        const index = this.lojas.findIndex(loja => loja.id === id)
        if (index !== -1) {
          this.lojas[index] = response.data
        }
    
        this.erro = null
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao editar loja'
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
