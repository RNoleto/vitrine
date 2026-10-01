<!-- src/components/ui/EditStoreModal.vue -->
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

// Cópias reativas dos dados do prop
const editId = ref('')
const editNome = ref('')
const editLogo = ref('')
const editLinks = ref([])
const editIcone = ref('')
const editTexto = ref('')
const editUrl = ref('')

// Sincroniza prop.storeData quando modal abre
watch(
  () => props.storeData,
  (newData) => {
    editId.value    = newData.id || ''
    editNome.value  = newData.nome || ''
    editLogo.value  = newData.logo || ''
    editLinks.value = newData.links ? newData.links.map(l => ({ ...l })) : []
    editIcone.value = ''
    editTexto.value = ''
    editUrl.value   = ''
  },
  { immediate: true }
)

function onFileChange(event) {
  const file = event.target.files[0]
  const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']
  if (file && allowedTypes.includes(file.type)) {
    const reader = new FileReader()
    reader.onload = () => (editLogo.value = reader.result)
    reader.readAsDataURL(file)
  } else {
    alert('Por favor, envie uma imagem válida (SVG, PNG, JPEG ou WebP).')
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
  // Emitindo exatamente o que o store espera:
  emit('save', {
    id: editId.value,
    name: editNome.value,      
    logoBase64: editLogo.value,
    links: editLinks.value
  })
  // alert('Edição salva com sucesso!');
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" @click.self="$emit('cancel')">
      <Transition name="zoom">
        <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] my-auto">
          
          <!-- Cabeçalho Elegante do Modal -->
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 via-white to-purple-50/40">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-200">
                <i class="fa-solid fa-store"></i>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-gray-900 leading-tight">Editar Detalhes da Vitrine</h3>
                <p class="text-xs text-gray-500 mt-0.5">Atualize a logo, o nome e os links rápidos da sua loja</p>
              </div>
            </div>
            
            <button 
              @click="$emit('cancel')" 
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer"
              title="Fechar"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Conteúdo Editável (Scrollable Body) -->
          <div class="p-6 overflow-y-auto space-y-6 flex-1">
            
            <!-- Seção 1: Nome & Identidade Visual -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-id-card text-indigo-500"></i>
                Identidade Visual & Nome
              </h4>

              <div class="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row items-center gap-4">
                <div class="relative group">
                  <img 
                    :src="editLogo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
                    alt="Logo Editada" 
                    class="w-20 h-20 object-cover rounded-2xl border-2 border-indigo-100 shadow-md transition-all group-hover:opacity-90" 
                  />
                  <div class="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <i class="fa-solid fa-pen text-white text-xs"></i>
                  </div>
                </div>

                <div class="flex-1 space-y-2 text-center sm:text-left">
                  <input id="edit-upload-logo" type="file" accept="image/svg+xml, image/png, image/jpeg, image/webp" @change="onFileChange" class="hidden" />
                  <label 
                    for="edit-upload-logo" 
                    class="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 text-xs font-bold text-indigo-700 transition-all shadow-xs"
                  >
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>Alterar Logo (.svg, .png, .jpeg, .webp)</span>
                  </label>
                  <p class="text-[11px] text-gray-400">Recomendado formato quadrado com alta resolução</p>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-700">Nome da Vitrine / Marca:</label>
                <Input v-model="editNome" placeholder="Ex: Minha Loja Oficial" id="edit-nome" name="edit-nome" />
              </div>
            </div>

            <!-- Seção 2: Links Rápidos da Vitrine -->
            <div class="space-y-4 pt-2 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fa-solid fa-link text-indigo-500"></i>
                  Links Rápidos & Redes Sociais ({{ editLinks.length }})
                </h4>
              </div>

              <!-- Formulário para Criar Novo Link -->
              <div class="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-3">
                <p class="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <i class="fa-solid fa-plus-circle text-indigo-600"></i> Adicionar Novo Link
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <div class="sm:col-span-4">
                    <IconSelect v-model="editIcone" :options="opcoesIcones" placeholder="Selecione..." class="w-full" />
                  </div>
                  <div class="sm:col-span-4">
                    <Input id="new-texto" name="new-texto" v-model="editTexto" placeholder="Texto (ex: Instagram)" :input-class="inputBaseClass" />
                  </div>
                  <div class="sm:col-span-4">
                    <Input id="new-url" name="new-url" v-model="editUrl" placeholder="URL (ex: https://...)" :input-class="inputBaseClass" />
                  </div>
                </div>
                <div class="flex justify-end pt-1">
                  <Button size="sm" @click="addLink" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm">
                    <i class="fa-solid fa-plus mr-1"></i> Adicionar à Lista
                  </Button>
                </div>
              </div>

              <!-- Lista de Links Cadastrados -->
              <div v-if="editLinks.length === 0" class="text-center py-6 text-xs text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                Nenhum link adicionado ainda. Utilize o formulário acima para criar o primeiro link.
              </div>
              <div v-else class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                <div 
                  v-for="(link, i) in editLinks" 
                  :key="i" 
                  class="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs hover:border-indigo-200 transition-all flex flex-col sm:flex-row gap-2.5 items-center justify-between"
                >
                  <div class="w-full sm:w-1/3">
                    <IconSelect v-model="link.icone" :options="opcoesIcones" placeholder="Ícone" class="w-full" />
                  </div>
                  <div class="w-full sm:w-1/3">
                    <Input :id="`texto-${i}`" :name="`texto-${i}`" v-model="link.texto" placeholder="Texto" :input-class="inputBaseClass" />
                  </div>
                  <div class="w-full sm:w-1/3 flex items-center gap-2">
                    <Input :id="`url-${i}`" :name="`url-${i}`" v-model="link.url" placeholder="URL" :input-class="inputBaseClass" class="flex-1" />
                    <button 
                      @click="removeLink(i)" 
                      class="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                      title="Remover este link"
                    >
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Rodapé de Ações Fixas -->
          <div class="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-center gap-3 rounded-b-3xl">
            <Button variant="cancelar" @click="$emit('cancel')" class="w-full px-4 py-2.5">
              Cancelar
            </Button>
            <Button @click="saveLocal" class="w-full px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
              <i class="fa-solid fa-check"></i>
              <span>Salvar Alterações</span>
            </Button>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.25s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
