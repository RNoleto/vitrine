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
    carregando: false,
    cadastrando: false,
    erro: null
  }),

  actions: {
    async listarContatos() {
      this.carregando = true;
      try {
        const { data } = await api.get('/contacts');
    
        // console.log('Contatos da API:', data);
        this.contatos = data.filter(contato => contato.ativo !== 0);
        this.erro = null;
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao listar contatos';
      } finally {
        this.carregando = false;
      }
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
        if (dados.fotoBase64) {
          const form = new FormData()
          const ct = dados.fotoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(dados.fotoBase64, ct)
          form.append('photo', blob, `photo.${ct.split('/')[1]}`)
          
          await api.post(`/contacts/${id}/photo`, form)
        }
        
        // Atualiza estado local
        const updated = await api.get(`/contacts/${id}`)
        const index = this.contatos.findIndex(c => c.id === id)
        if (index !== -1) this.contatos.splice(index, 1, updated.data)
        
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
        await api.put(`/contacts/${contactId}/lojas`, {
          lojas: lojasIds
        })
      } catch (e) {
        this.erro = 'Erro ao atualizar lojas'
        throw e
      }
    }
    
  }
})
