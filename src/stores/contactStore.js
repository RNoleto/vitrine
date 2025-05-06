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
    
      // Adiciona store_ids como array (formato correto para o Laravel)
      contato.lojasIds.forEach((id, index) => {
        formData.append(`store_ids[${index}]`, id)
      })
    
      if (contato.fotoBase64) {
        const contentType = contato.fotoBase64.split(';')[0].split(':')[1]
        const blob = base64ToBlob(contato.fotoBase64, contentType)
        formData.append('photo', blob, 'contact_photo.png')
      }
    
      try {
        const { data } = await api.post('/contacts', formData)
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
      this.cadastrando = true;
      try {
        const formData = new FormData();
        formData.append('name', dados.name);
        formData.append('whatsapp', dados.whatsapp);
        formData.append('_method', 'PUT'); // Necessário para PUT via POST
    
        // Adiciona a foto se existir
        if (dados.fotoBase64 && dados.fotoBase64.startsWith('data:')) {
          const contentType = dados.fotoBase64.split(';')[0].split(':')[1];
          const blob = base64ToBlob(dados.fotoBase64, contentType);
          formData.append('photo', blob, `contact_${id}_photo.png`);
        }
    
        // 1. Atualiza dados básicos e foto
        const { data } = await api.post(`/contacts/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // 2. Atualiza lojas vinculadas
        await this.atualizarVinculos(id, dados.lojasIds);
    
        // Atualização local
        const index = this.contatos.findIndex(c => c.id === id);
        if (index !== -1) {
          this.contatos[index] = {
            ...data,
            stores: data.stores // Usa os dados atualizados do backend
          };
        }
    
      } catch (err) {
        this.erro = 'Erro ao editar contato. Verifique os dados.';
        throw err;
      } finally {
        this.cadastrando = false;
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
        
        const index = this.contatos.findIndex(c => c.id === contactId)
        if (index !== -1) {
          this.contatos[index].lojas = lojasIds.map(id => ({
            id: id,
            name: this.lojasNomes.get(id) || 'Loja'
          }))
        }
    
      } catch (e) {
        this.erro = 'Erro ao atualizar lojas'
        throw e
      }
    }
    
  }
})
