import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useLojaStore = defineStore('loja', () => {
  const lojas = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  
  async function adicionarLoja(loja) {
    carregando.value = true
    try {
      const formData = new FormData()
      formData.append('name', loja.name)
      if (loja.logoBase64) {
        const blob = await fetch(loja.logoBase64).then(r => r.blob())
        const mimeType = blob.type // tipo MIME da imagem
        const extension = mimeType.split('/')[1] // ex: "svg+xml" → "svg+xml"
        const filename = `logo.${extension.replace('+xml', '')}` // ex: svg+xml → svg
      
        formData.append('logo', blob, filename)
      }      
      if (Array.isArray(loja.links)) {
        loja.links.forEach((link, i) => {
          formData.append(`links[${i}][icone]`, link.icone)
          formData.append(`links[${i}][texto]`, link.texto)
          formData.append(`links[${i}][url]`, link.url)
        })
      }      

      const { data } = await api.post('/stores', formData)
      lojas.value.push(data)
      erro.value = null
    } catch (e) {
      erro.value = e.response?.data?.error || 'Erro ao criar loja'
    } finally {
      carregando.value = false
    }
  }

  async function listarLojas(){
    carregando.value = true
    try{
      const response = await api.get('/lojas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      lojas.value = response.data
      erro.value = null
    } catch (e) {
      erro.value = e.response ? e.response.data.error : 'Erro ao listar lojas'
    } finally {
      carregando.value = false
    }
  }

  async function editarLoja(id, dadosAtualizados) {
    carregando.value = true

    try {
      const response = await api.put(`/stores/${id}`, dadosAtualizados, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const lojaIndex = lojas.value.findIndex(loja => loja.id === id)
      if (lojaIndex !== -1) {
        lojas.value[lojaIndex] = response.data
      }

      erro.value = null
    } catch (e) {
      erro.value = e.response ? e.response.data.error : 'Erro ao editar loja'
    } finally {
      carregando.value = false
    }
  }

  return {
    lojas,
    erro,
    carregando,
    adicionarLoja,
    listarLojas,
    editarLoja
  }
})
