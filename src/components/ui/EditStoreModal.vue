<script setup>
import { ref, watch } from 'vue'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import IconSelect from '../ui/IconSelect.vue'

const props = defineProps({
  isOpen: Boolean,
  storeData: {
    type: Object,
    default: () => ({ nome: '', logo: '', links: [] })
  },
  opcoesIcones: Array,
  inputBaseClass: String
})
const emit = defineEmits(['save', 'cancel'])

// Local reactive copies
const editNome = ref('')
const editLogo = ref('')
const editLinks = ref([])
const editIcone = ref('')
const editTexto = ref('')
const editUrl = ref('')

// Sync props.storeData into local when modal opens
watch(
  () => props.storeData,
  (newData) => {
    editNome.value = newData.nome || ''
    editLogo.value = newData.logo || ''
    editLinks.value = newData.links ? newData.links.map(l => ({ ...l })) : []
    editIcone.value = ''
    editTexto.value = ''
    editUrl.value = ''
  },
  { immediate: true }
)

function onFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type === 'image/svg+xml') {
    const reader = new FileReader()
    reader.onload = () => (editLogo.value = reader.result)
    reader.readAsDataURL(file)
  } else {
    alert('Por favor, envie um arquivo SVG válido.')
  }
}

function addLink() {
  if (!editIcone.value || !editTexto.value || !editUrl.value) {
    alert('Preencha ícone, texto e URL do link.')
    return
  }
  editLinks.value.push({ icone: editIcone.value, texto: editTexto.value, url: editUrl.value })
  editIcone.value = ''
  editTexto.value = ''
  editUrl.value = ''
}

function removeLink(i) {
  editLinks.value.splice(i, 1)
}

function saveLocal() {
  emit('save', {
    nome: editNome.value,
    logo: editLogo.value,
    links: editLinks.value
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
      <h4 class="text-lg font-semibold">Editar Loja</h4>

      <!-- Logo Preview & Upload -->
      <div class="flex items-center gap-4">
        <img :src="editLogo" alt="Logo Editada" class="w-16 h-16 object-contain rounded" />
        <input
          id="edit-upload-logo"
          type="file"
          accept=".svg"
          @change="onFileChange"
          class="hidden"
        />
        <label
          for="edit-upload-logo"
          class="cursor-pointer rounded-md bg-indigo-50 border px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          Alterar logo (.svg)
        </label>
      </div>

      <!-- Nome -->
      <Input
        v-model="editNome"
        placeholder="Nome da loja"
        id="edit-nome"
        name="edit-nome"
      />

      <!-- Novo Link -->
      <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <IconSelect
          v-model="editIcone"
          :options="opcoesIcones"
          placeholder="Ícone"
          class="min-w-[135px] flex-1"
        />
        <Input
          id="new-texto"
          name="new-texto"
          v-model="editTexto"
          placeholder="Texto"
          :input-class="inputBaseClass"
        />
        <Input
          id="new-url"
          name="new-url"
          v-model="editUrl"
          placeholder="URL"
          :input-class="inputBaseClass"
        />
        <Button size="sm" @click="addLink">+ Adicionar Link</Button>
      </div>

      <!-- Lista de Links -->
      <div class="space-y-2">
        <div
          v-for="(link, i) in editLinks"
          :key="i"
          class="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
        >
          <IconSelect
            v-model="link.icone"
            :options="opcoesIcones"
            placeholder="Ícone"
            class="flex-1"
          />
          <Input
            :id="`texto-${i}`"
            :name="`texto-${i}`"
            v-model="link.texto"
            placeholder="Texto"
            :input-class="inputBaseClass"
          />
          <Input
            :id="`url-${i}`"
            :name="`url-${i}`"
            v-model="link.url"
            placeholder="URL"
            :input-class="inputBaseClass"
          />
          <button @click="removeLink(i)" class="text-red-500">✖</button>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex justify-end gap-2 pt-4">
        <Button variant="secondary" @click="$emit('cancel')">Cancelar</Button>
        <Button @click="saveLocal">Salvar</Button>
      </div>
    </div>
  </div>
</template>
