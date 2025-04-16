<script setup>
import { ref } from 'vue'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const loja = ref('')
const logo = ref(null) // para armazenar o arquivo
const lojaStore = useLojaStore()

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file && file.type === 'image/svg+xml') {
    const reader = new FileReader()
    reader.onload = () => {
      logo.value = reader.result // base64 do svg
    }
    reader.readAsDataURL(file)
  } else {
    alert('Por favor, envie um arquivo SVG válido.')
  }
}

function cadastrarLoja() {
  if (!loja.value || !logo.value) {
    alert('Preencha todos os campos.')
    return
  }

  lojaStore.adicionarLoja(loja.value, logo.value)
  loja.value = ''
  logo.value = null
}
</script>

<template>
  <div>
    <p>Lojas cadastradas e ação para salvar novas Lojas</p>

    <div class="space-y-3 mt-10">
      <div>
        <p class="font-semibold">Cadastrar Loja</p>

        <Input
          v-model="loja"
          placeholder="Digite o nome da loja"
          id="loja"
          name="loja"
          type="text"
          autocomplete="off"
          required
        />

        <!-- Campo para upload do logo -->
        <input
          type="file"
          accept=".svg"
          @change="handleFileUpload"
          class="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0 file:text-sm file:font-semibold
                 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />

        <Button type="submit" @click="cadastrarLoja">Cadastrar</Button>
      </div>

      <div>
        <p class="font-semibold">Lojas cadastradas</p>
        <ul class="space-y-2">
          <li v-for="(loja, index) in lojaStore.lojas" :key="index" class="flex items-center space-x-3">
            <img :src="loja.logo" alt="Logo" class="w-8 h-8" />
            <span>{{ loja.nome }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
