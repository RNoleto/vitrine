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

    async editarLoja(id, dados) {
      this.carregando = true
      this.erro = null

      try {
        const isNovaLogo =
          typeof dados.logoBase64 === 'string' &&
          dados.logoBase64.startsWith('data:')

        let res
        if (isNovaLogo) {
          // ––– FormData + override de método –––
          const form = new FormData()
          form.append('_method', 'PUT')
          form.append('name',   dados.name)
          form.append('ativo',  dados.ativo ?? 1)

          // converte base64 em Blob
          const ct   = dados.logoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(dados.logoBase64, ct)
          form.append('logo', blob, `logo.${ct.split('/')[1]}`)

          // reenvia todos os links (pode ser [])
          dados.links.forEach((l, i) => {
            form.append(`links[${i}][icone]`, l.icone)
            form.append(`links[${i}][texto]`, l.texto)
            form.append(`links[${i}][url]`,   l.url)
          })

          res = await api.post(`/stores/${id}`, form)

        } else {
          // ––– JSON puro –––
          res = await api.put(`/stores/${id}`, {
            name:  dados.name,
            ativo: dados.ativo ?? 1,
            links: dados.links
          })
        }

        // atualiza o estado local
        const updated = res.data
        const idx = this.lojas.findIndex(l => l.id === id)
        if (idx !== -1) this.lojas[idx] = updated

      } catch (err) {
        this.erro = 'Erro ao editar loja.'
        console.error(err)
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
