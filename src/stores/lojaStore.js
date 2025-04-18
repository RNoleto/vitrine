import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useLojaStore = defineStore('loja', () => {
  const lojas = ref([]) // Para armazenar as lojas
  const carregando = ref(false) // Para saber se a requisição está em andamento
  const erro = ref(null) // Para armazenar erros, caso ocorram

  // Função para adicionar uma loja
  async function adicionarLoja(loja) {
    carregando.value = true // Inicia o carregamento

    try {
      const formData = new FormData()

      // Corrigido: o nome deve vir de loja.name
      formData.append('name', loja.name)

      // Convertendo base64 para Blob, se houver logo
      if (loja.logoBase64) {
        const blob = await fetch(loja.logoBase64).then(res => res.blob())
        formData.append('logo', blob, 'logo.png') // Nome fictício
      }

      // Adiciona links se for um array
      if (Array.isArray(loja.links)) {
        loja.links.forEach((link, index) => {
          formData.append(`links[${index}]`, link)
        })
      }

      const response = await api.post('/stores', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${idToken}`,
        },
      })

      lojas.value.push(response.data)
      erro.value = null
    } catch (e) {
      erro.value = e.response ? e.response.data.error : 'Erro ao criar loja'
    } finally {
      carregando.value = false
    }
  }

  // Função para editar uma loja
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
    editarLoja
  }
})
