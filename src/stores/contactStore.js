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

export const useContactStore = defineStore('contact', {
  state: () => ({
    contatos: [],
    lojasNomes: new Map(),
    carregando: false,
    cadastrando: false,
    erro: null
  }),

  actions: {
    async listarContatos() {
      this.carregando = true;
      try {
        const { data } = await api.get('/contacts')
        this.contatos = data.map(contato => ({
          ...contato,
          lojas: contato.lojas?.map(loja => ({
            id: loja.id,
            name: this.lojasNomes.get(loja.id) || loja.name
          })) || []
        }))
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao listar contatos';
      } finally {
        this.carregando = false;
      }
    },
    
    async carregarNomesLojas() {
      const { data } = await api.get('/stores')
      this.lojasNomes = new Map(data.map(loja => [loja.id, loja.name]))
    },

    async adicionarContato(contato) {
      this.cadastrando = true
      const formData = new FormData()
      
      formData.append('name', contato.name)
      formData.append('whatsapp', contato.whatsapp)
    
      // Adiciona store_ids como array
      contato.lojasIds.forEach((id, index) => {
        formData.append(`store_ids[${index}]`, id)
      })
    
      if (contato.fotoBase64) {
        const contentType = contato.fotoBase64.split(';')[0].split(':')[1]
        const blob = base64ToBlob(contato.fotoBase64, contentType)
        formData.append('photo', blob, 'contact_photo.png')
      }
    
      try {
        const { data } = await api.post('/contacts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
          }
        })
        
        this.contatos.push(data)
        return data
        
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao adicionar contato'
        throw e
      } finally {
        this.cadastrando = false
      }
    },      

    async editarContato(id, dados) {
      this.cadastrando = true
      try {
        // 1. Atualiza dados básicos
        const res = await api.put(`/contacts/${id}`, {
          name: dados.name,
          whatsapp: dados.whatsapp
        })
        
        // 2. Atualiza lojas vinculadas
        await this.atualizarVinculos(id, dados.lojasIds)
        
        // 3. Atualiza foto separadamente se necessário
        if (dados.fotoBase64 && dados.fotoBase64.startsWith('data:')) {
          const form = new FormData()
          const ct = dados.fotoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(dados.fotoBase64, ct)
          form.append('photo', blob, `photo.${ct.split('/')[1]}`)
          
          await api.post(`/contacts/${id}/photo`, form)
        }
        
        // Atualiza estado LOCAL sem chamar a API novamente
        const index = this.contatos.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contatos[index] = {
            ...this.contatos[index],
            name: dados.name,
            whatsapp: dados.whatsapp,
            lojas: this.contatos[index].lojas // Mantém as lojas existentes
          }
        }
        
      } catch (err) {
        this.erro = 'Erro ao editar contato.'
        throw err
      } finally {
        this.cadastrando = false
      }
    },

    async excluirContato(id) {
      this.carregando = true

      try {
        await api.delete(`/contacts/${id}`)

        this.contatos = this.contatos.filter(c => c.id !== id)

        await this.listarContatos()

      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao excluir contato'
        throw new Error(this.erro)
      } finally {
        this.carregando = false
      }
    },

    async listarContatosPublicosPorLoja(lojaId) {
      this.carregando = true
      try {
        const { data } = await api.get(`/public/stores/${lojaId}/contacts`)
        this.contatos = data
        this.erro = null
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao listar contatos públicos'
      } finally {
        this.carregando = false
      }
    },

    async vincularLojas(contactId, lojasIds) {
      try {
        await api.post(`/contacts/${contactId}/lojas`, {
          lojas: lojasIds
        })
      } catch (e) {
        this.erro = 'Erro ao vincular lojas'
        throw e
      }
    },

    async atualizarVinculos(contactId, lojasIds) {
      try {
        await api.put(`/contacts/${contactId}/stores`, {
          lojas: lojasIds
        })
    
        // Atualização local segura
        const index = this.contatos.findIndex(c => c.id === contactId)
        if (index !== -1) {
          this.contatos[index].lojas = lojasIds.map(id => ({
            id: id,
            name: this.lojasNomes.get(id) || 'Loja' // Usamos um Map cacheado
          }))
        }
    
      } catch (e) {
        this.erro = 'Erro ao atualizar lojas'
        throw e
      }
    }
    
  }
})
