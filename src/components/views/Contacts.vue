<script setup>
import { ref, computed } from 'vue'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const contactStore = useContactStore()
const lojaStore = useLojaStore()

const nome = ref('')
const contato = ref('')
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
  if (!nome.value || !contato.value || !foto.value || !empresaSelecionada.value) {
    alert('Preencha todos os campos!')
    return
  }

  if (editIndex.value !== null) {
    contactStore.updateContact(editIndex.value, nome.value, foto.value, contato.value, empresaSelecionada.value)
  } else {
    contactStore.addContact(nome.value, foto.value, contato.value, empresaSelecionada.value)
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
  nome.value = ''
  contato.value = ''
  foto.value = null
  empresaSelecionada.value = ''
  editIndex.value = null
}
</script>


<template>
  <div>
    <p class="font-semibold">Cadastrar Contato</p>

    <div class="flex flex-col gap-2 mt-5">
      <Input id="name" name="name" v-model="nome" placeholder="Nome do contato" />
      <Input id="contact" name="contact" v-model="contato" placeholder="Telefone ou email" />

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
        <li v-for="(c, i) in contactStore.contact" :key="i" class="flex items-center space-x-4">
          <img :src="c.foto" alt="Foto" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <p class="font-semibold">{{ c.nome }}</p>
            <p class="text-sm">{{ c.contato }}</p>
            <p class="text-sm text-indigo-600 italic">
              Empresa: {{
                lojaStore.lojas.find(loja => loja.id === c.empresa)?.nome || 'Empresa não encontrada'
              }}
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
