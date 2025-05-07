<script setup>
import { ref, onMounted } from 'vue'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Loading from '../ui/Loading.vue'
import ContactCard from '../ui/ContactCard.vue'

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

  const whatsappRegex = /^(?:(?:\+|00)?55\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:9\s?)?([0-9]{4,5})-?([0-9]{4})$/
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
  empresaSelecionada.value = (c.stores || []).map(loja => loja?.id)
  editIndex.value = id
}

function removeFoto() {
  foto.value = null
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
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

function toggleLoja(lojaId) {
  const index = empresaSelecionada.value.indexOf(lojaId)
  if (index === -1) {
    empresaSelecionada.value.push(lojaId)
  } else {
    empresaSelecionada.value.splice(index, 1)
  }
}

function resetForm() {
  name.value = ''
  whatsapp.value = ''
  empresaSelecionada.value = []
  foto.value = null
  removeFoto()
  editIndex.value = null

  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}

onMounted(() => {
  lojaStore.listarLojas();
  contactStore.listarContatos();
  contactStore.carregarNomesLojas();
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

      <div class="image-upload-container flex flex-col items-center">
        <label class="file-input-label">
          <input type="file" accept="image/*" @change="handleFotoUpload" class="file-input" />
          <span class="upload-button">Selecionar Foto</span>
        </label>
        <div v-if="foto" class="image-preview">
          <img :src="foto" alt="Pré-visualização" class="preview-image" />
          <button @click.stop="removeFoto" class="remove-image-button">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="loja-list">
        <div v-for="loja in lojaStore.lojas" :key="loja.id" class="loja-item"
          :class="{ 'selected': empresaSelecionada.includes(loja.id) }" @click="toggleLoja(loja.id)">
          <input type="checkbox" :checked="empresaSelecionada.includes(loja.id)" class="checkbox-hidden"
            :value="loja.id">
          <span class="loja-name">{{ loja.name }}</span>
        </div>
      </div>

      <Button @click="cadastrarContato" :disabled="contactStore.cadastrando || contactStore.carregando">
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
        <ContactCard
          v-else
          v-for="contact in contactStore.contatos"
          :key="contact.id"
          :contact="contact"
          @edit="editarContato"
          @delete="excluirContato"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped>
.image-upload-container {
  margin: 1rem 0;
  /* width: max-content; */
}

.file-input-label {
  display: block;
  cursor: pointer;
}

.file-input {
  display: none;
}

.upload-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #e0e7ff;
  color: #4f46e5;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #c7d2fe;
}

.image-preview {
  position: relative;
  margin-top: 1rem;
  max-width: 150px;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid #e0e7ff;
}

.remove-image-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  border: none;
}

.remove-image-button:hover {
  background-color: #dc2626;
}

.loja-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.loja-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.loja-item:hover {
  background-color: #f5f5f5;
}

.loja-item.selected {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.checkbox-hidden {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.loja-name {
  margin-left: 8px;
}

/* Estilização da scrollbar */
.loja-list::-webkit-scrollbar {
  width: 8px;
}

.loja-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.loja-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.loja-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
