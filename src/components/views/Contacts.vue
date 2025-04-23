<script setup>
import { ref, onMounted } from 'vue'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const contactStore = useContactStore()
const lojaStore = useLojaStore()

const name = ref('')
const whatsapp = ref('')
const foto = ref(null)
const empresaSelecionada = ref('')
const editIndex = ref(null)

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

function cadastrarContato() {
  if (!name.value || !whatsapp.value || !foto.value || !empresaSelecionada.value) {
    alert('Preencha todos os campos!')
    return
  }

  // Passando o valor de empresaSelecionada diretamente para o store
  const contato = {
    name: name.value,
    whatsapp: whatsapp.value,
    fotoBase64: foto.value,
    store_id: empresaSelecionada.value, // Passando o valor aqui
  }

  if (editIndex.value !== null) {
    contactStore.editarContato(editIndex.value, contato)
  } else {
    contactStore.adicionarContato(contato)
  }

  resetForm()
}

function editarContato(index) {
  const c = contactStore.contact[index]
  nome.value = c.nome
  contato.value = c.contato
  foto.value = c.foto
  empresaSelecionada.value = c.empresa
  editIndex.value = index
}

function excluirContato(index) {
  contactStore.deleteContact(index)
  resetForm()
}

function resetForm() {
  name.value = ''
  whatsapp.value = ''
  empresaSelecionada.value = ''
  editIndex.value = null
}

onMounted(() => {
  lojaStore.listarLojas();
  contactStore.listarContatos();
})
</script>


<template>
  <div>
    <p class="font-semibold">Cadastrar Contato</p>

    <div class="flex flex-col gap-2 mt-5">
      <Input id="name" name="name" v-model="name" placeholder="Nome do contato" />
      <Input id="whatsapp" name="whatsapp" v-model="whatsapp" placeholder="Whastapp" />

      <!-- Upload de foto -->
      <input type="file" accept="image/*" @change="handleFotoUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0 file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />

      <!-- Select de loja -->
      <select v-model="empresaSelecionada" class="w-full px-3 py-2 border rounded-md">
        <option disabled value="">Selecione a empresa</option>
        <option v-for="(loja, index) in lojaStore.lojas" :key="index" :value="loja.id">
          {{ loja.name }}
        </option>
      </select>


      <Button @click="cadastrarContato">
        {{ editIndex !== null ? 'Atualizar' : 'Cadastrar' }}
      </Button>

    </div>

    <div class="divider"></div>
    <!-- Lista de contatos cadastrados -->
    <div class="mt-8">
      <p class="font-semibold">Contatos cadastrados</p>
      <ul class="space-y-3 mt-4">
        <li v-for="(c, i) in contactStore.contatos" :key="i" class="flex items-center space-x-4">
          <img :src="c.photo" alt="Foto" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <p class="font-semibold">{{ c.name }}</p>
            <p class="text-sm">{{ c.whatsapp }}</p>
            <p class="text-sm text-indigo-600 italic">
              Empresa:
              {{lojaStore.lojas.find(loja => loja.id === c.store_id)?.name || 'Empresa não encontrada'}}
            </p>
          </div>
          <div class="ml-auto flex space-x-2">
            <button class="text-blue-600 hover:underline" @click="editarContato(i)">Editar</button>
            <button class="text-red-600 hover:underline" @click="excluirContato(i)">Excluir</button>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>
