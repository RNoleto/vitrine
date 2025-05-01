<script setup>
import { ref, onMounted } from 'vue'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Loading from '../ui/Loading.vue'

const contactStore = useContactStore()
const lojaStore = useLojaStore()

const name = ref('')
const whatsapp = ref('')
const foto = ref(null)
const empresaSelecionada = ref([])
const editIndex = ref(null)
const erros = ref([])

function handleFotoUpload(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      foto.value = reader.result
    }
    reader.readAsDataURL(file)
  } else {
    alert('Por favor, envie uma imagem válida.')
  }
}

function validateForm() {
  erros.value = []
  
  if (!name.value.trim()) erros.value.push('Nome é obrigatório')
  
  const whatsappRegex = /^(\+?55)?\s?(?:\(?[1-9]{2}\)?)?\s?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/
  if (!whatsapp.value.trim()) {
    erros.value.push('Whatsapp é obrigatório')
  } else if (!whatsappRegex.test(whatsapp.value)) {
    erros.value.push('Formato de whatsapp inválido (exemplo: 11999998888)')
  }
  
  if (!empresaSelecionada.value.length) {
    erros.value.push('Selecione pelo menos uma loja')
  }
  
  return erros.value.length === 0
}

async function cadastrarContato() {
  if (!validateForm()) return

  const contato = {
    name: name.value,
    whatsapp: whatsapp.value,
    fotoBase64: foto.value,
    lojasIds: empresaSelecionada.value
  }

  try {
    if (editIndex.value !== null) {
      await contactStore.editarContato(editIndex.value, contato)
    } else {
      await contactStore.adicionarContato(contato)
    }
    
    await contactStore.listarContatos()
    resetForm()
    
  } catch (error) {
    alert(error.message || 'Erro na operação')
  }
}

function editarContato(id) {
  const c = contactStore.contatos.find(contato => contato.id === id)
  if (!c) return
  
  erros.value = [] // Limpa erros anteriores
  name.value = c.name
  whatsapp.value = c.whatsapp
  foto.value = c.photo
  empresaSelecionada.value = c.lojas.map(loja => loja.id)
  editIndex.value = id
}

async function excluirContato(id) {
  if (confirm('Deseja realmente excluir esse contato?')) {
    try {
      await contactStore.excluirContato(id)
      alert('Contato excluído com sucesso!')
    } catch (error) {
      alert('Erro ao excluir contato: ' + (error.message || 'Tente novamente mais tarde'))
    }
  }
}

function resetForm() {
  name.value = ''
  whatsapp.value = ''
  empresaSelecionada.value = ''
  foto.value = null
  editIndex.value = null

  const fileInput = document.querySelector('input[type="file"]')
  if(fileInput){
    fileInput.value = ''
  }
}

onMounted(() => {
  lojaStore.listarLojas();
  contactStore.listarContatos();
})
</script>


<template>
  <div>
    <p class="font-semibold">Cadastrar Contato</p>
    
    <div v-if="erros.length" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      <p class="font-semibold">Corrija os seguintes erros:</p>
      <ul class="list-disc pl-5 mt-2">
        <li v-for="(erro, index) in erros" :key="index">{{ erro }}</li>
      </ul>
    </div>
    
    <div class="flex flex-col gap-2 mt-5">
      <Input id="name" name="name" v-model="name" placeholder="Nome do contato" />
      <Input id="whatsapp" name="whatsapp" v-model="whatsapp" placeholder="Whastapp" />

      <input type="file" accept="image/*" @change="handleFotoUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0 file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />

               <select 
                  v-model="empresaSelecionada" 
                  multiple
                  class="w-full px-3 py-2 border rounded-md h-32"
                >
                  <option disabled value="">Selecione uma ou mais lojas</option>
                  <option 
                    v-for="loja in lojaStore.lojas" 
                    :key="loja.id" 
                    :value="loja.id"
                  >
                    {{ loja.name }}
                  </option>
                </select>


                <Button 
                  @click="cadastrarContato" 
                  :disabled="contactStore.cadastrando || contactStore.carregando"
                >
                  <template v-if="contactStore.cadastrando">
                    <span class="animate-pulse">Salvando...</span>
                  </template>
                  <template v-else>
                    {{ editIndex !== null ? 'Atualizar' : 'Cadastrar' }}
                  </template>
                </Button>


    </div>

    <div class="divider"></div>
    <!-- Lista de contatos cadastrados -->
    <div class="mt-8">
      <p class="font-semibold">Contatos cadastrados</p>
      <ul class="space-y-3 mt-4">
        <Loading v-if="lojaStore.carregando" text="" />
        <li v-else v-for="(c, i) in contactStore.contatos" :key="i" class="flex items-center space-x-4 border bg-zinc-100 border-gray-300 p-2 rounded-lg shadow-sm">
          <img :src="c.photo" alt="Foto" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <p class="font-semibold">{{ c.name }}</p>
            <p class="text-sm">{{ c.whatsapp }}</p>
            <div class="mt-1">
              <span 
                v-for="loja in c.lojas" 
                :key="loja.id"
                class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
              >
                {{ loja.name }}
              </span>
            </div>
          </div>
          <div class="ml-auto flex gap-2 space-x-2">
            <button class="cursor-pointer p-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 hover:scale-105" @click="editarContato(c.id)">Editar</button>
            <button class="cursor-pointer p-2 rounded-md bg-red-600  text-white hover:bg-red-500 hover:scale-105" @click="excluirContato(c.id)">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<!-- <style scoped>
select[multiple] option:checked {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.select-container {
  @apply relative;
}

.select-container::after {
  @apply absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none;
  content: "⬎";
  transform: rotate(90deg);
}
</style> -->
