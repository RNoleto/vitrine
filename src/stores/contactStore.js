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
    erro: null
  }),

  actions: {
    async listarContatos() {
      this.carregando = true;
      try {
        const { data } = await api.get('/contacts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
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
      const authStore = useAuthStore()
      const storeId = contato.store_id // Agora, pegamos o store_id do contato passado
    
      const formData = new FormData()
      formData.append('name', contato.name)
      formData.append('whatsapp', contato.whatsapp)
      formData.append('store_id', storeId)
    
      if (contato.fotoBase64) {
        const contentType = contato.fotoBase64.split(';')[0].split(':')[1]
        const blob = base64ToBlob(contato.fotoBase64, contentType)
        formData.append('photo', blob, 'photo.png')
      }
    
      this.carregando = true
      try {
        const { data } = await api.post('/contacts', formData)
        this.contatos.push(data)
        this.erro = null
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao adicionar contato'
      } finally {
        this.carregando = false
      }
    },      

    async editarContato(id, dados) {
      this.carregando = true
      this.erro = null

      try {
        let res
        const isNovaFoto = typeof dados.fotoBase64 === 'string' && dados.fotoBase64.startsWith('data:')

        if (isNovaFoto) {
          const form = new FormData()
          form.append('_method', 'PUT')
          form.append('name', dados.name)
          form.append('whatsapp', dados.whatsapp)

          const ct = dados.fotoBase64.split(';')[0].split(':')[1]
          const blob = base64ToBlob(dados.fotoBase64, ct)
          form.append('photo', blob, `photo.${ct.split('/')[1]}`)

          res = await api.post(`/contacts/${id}`, form)
        } else {
          res = await api.put(`/contacts/${id}`, {
            name: dados.name,
            whatsapp: dados.whatsapp,
          })
        }

        const updated = res.data
        const idx = this.contatos.findIndex(c => c.id === id)
        if (idx !== -1) this.contatos[idx] = updated

      } catch (err) {
        this.erro = 'Erro ao editar contato.'
        console.error(err)
      } finally {
        this.carregando = false
      }
    },

    async excluirContato(id) {
      this.carregando = true

      try {
        await api.delete(`/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const contato = this.contatos.find(c => c.id === id)
        if (contato) {
          contato.ativo = 0
        }

        await this.listarContatos()

      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao excluir contato'
      } finally {
        this.carregando = false
      }
    }
  }
})
