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
    cadastrando: false,
    lojaSelecionada: null,
    contatosLoja: [],
    erro: null
  }),

  actions: {
    async adicionarLoja(loja) {
      this.cadastrando = true
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
        this.cadastrando = false
      }
    },

    async listarLojas() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        this.erro = 'Usuário não autenticado'
        return
      }

      this.carregando = true
      try {
        const response = await api.get('/stores')

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
          form.append('name', dados.name)
          form.append('ativo', dados.ativo ?? 1)

          // converte base64 em Blob
          const ct = dados.logoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(dados.logoBase64, ct)
          form.append('logo', blob, `logo.${ct.split('/')[1]}`)

          // reenvia todos os links (pode ser [])
          dados.links.forEach((l, i) => {
            form.append(`links[${i}][icone]`, l.icone)
            form.append(`links[${i}][texto]`, l.texto)
            form.append(`links[${i}][url]`, l.url)
          })

          res = await api.post(`/stores/${id}`, form)

        } else {
          // ––– JSON puro –––
          res = await api.put(`/stores/${id}`, {
            name: dados.name,
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
        await api.delete(`/stores/${id}`)
        // Remove imediatamente do estado local
        this.lojas = this.lojas.filter(loja => loja.id !== id)
        await this.listarLojas()
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao excluir loja'
        throw new Error(this.erro)
      } finally {
        this.carregando = false
      }
    },

    async listarLojasPublicas() {
      this.carregando = true
      try {
        const { data } = await api.get('/public/stores')
        this.lojas = data
        this.erro = null
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao carregar lojas públicas'
      } finally {
        this.carregando = false
      }
    },

    async obterLojaPublica(slug) {
      this.carregando = true
      try {
        const { data } = await api.get(`/lojas/${slug}`)
        return data
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao carregar loja pública'
        return null
      } finally {
        this.carregando = false
      }
    },

    async obterContatosLojaPublica(id) {
      this.carregando = true
      try {
        const { data } = await api.get(`/public/stores/${id}/contacts`)
        return data
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao carregar contatos da loja'
        return []
      } finally {
        this.carregando = false
      }
    },
    // Dentro do objeto actions:
    async atualizarTemaLoja(id, tema) {
      this.carregando = true;
      try {
        // 1. Atualiza no backend usando PATCH
        const { data } = await api.patch(`/stores/${id}`, { 
          theme: tema 
        });
    
        // 2. Atualiza o estado local com os dados retornados
        const index = this.lojas.findIndex(l => l.id === id);
        if (index !== -1) {
          this.lojas[index] = { ...this.lojas[index], ...data };
        }
    
        return true;
      } catch (error) {
        this.erro = error.response?.data?.error || 'Erro ao atualizar tema';
        throw error;
      } finally {
        this.carregando = false;
      }
    },

    getTema(id) {
      const loja = this.lojas.find(l => l.id === id);
      return loja?.theme || 'default';
    }

  },

  persist: true
})
