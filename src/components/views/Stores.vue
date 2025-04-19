<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import EditStoreModal from '../ui/EditStoreModal.vue'
import IconSelect from '../ui/IconSelect.vue'

const router = useRouter()

const lojaStore = useLojaStore()

// criação de loja
const novaLojaNome = ref('')
const novaLojaLogo = ref(null)
const novaLinks = ref([])
const novoIcone = ref('')
const novoTexto = ref('')
const novaUrl = ref('')

const inputBaseClass = 'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'

function handleFileUpload(event) {
    const file = event.target.files[0]

    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']

    if (file && allowedTypes.includes(file.type)) {
        const reader = new FileReader()
        reader.onload = () => {
            novaLojaLogo.value = reader.result
        }
        reader.readAsDataURL(file)
    } else {
        alert('Por favor, envie uma imagem válida (SVG, PNG, JPEG ou WebP).')
    }
}

function adicionarLink() {
    if (!novoIcone.value || !novoTexto.value || !novaUrl.value) {
        alert('Preencha ícone, texto e URL do link.')
        return
    }
    novaLinks.value.push({ icone: novoIcone.value, texto: novoTexto.value, url: novaUrl.value })
    novoIcone.value = ''
    novoTexto.value = ''
    novaUrl.value = ''
}

function cadastrarLoja() {
    if (!novaLojaNome.value || !novaLojaLogo.value) {
        alert('Preencha nome e logo da loja.')
        return
    }
    // lojaStore.adicionarLoja(novaLojaNome.value, novaLojaLogo.value, [...novaLinks.value])
    lojaStore.adicionarLoja({
      name: novaLojaNome.value,
      logoBase64: novaLojaLogo.value,
      links: novaLinks.value
    })
    novaLojaNome.value = ''
    novaLojaLogo.value = null
    novaLinks.value = []
}

// modal edição
const isEditModalOpen = ref(false)
const editIndex = ref(null)
const editNome = ref('')
const editLogo = ref('')
const editLinks = ref([])
const editIcone = ref('')
const editTexto = ref('')
const editUrl = ref('')

function onFileChange(event) {
    const file = event.target.files[0]
    if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader()
        reader.onload = () => editLogo.value = reader.result
        reader.readAsDataURL(file)
    } else {
        alert('Por favor, envie um arquivo SVG válido.')
    }
}

function openEditModal(index) {
    const loja = lojaStore.lojas[index]
    editIndex.value = index
    editNome.value = loja.name
    editLogo.value = loja.logo_url
    editLinks.value = loja.links.map(l => ({ ...l }))
    // limpar campos de novo link
    editIcone.value = ''
    editTexto.value = ''
    editUrl.value = ''
    isEditModalOpen.value = true
}

function closeEditModal() {
    isEditModalOpen.value = false
    editIndex.value = null
    editLinks.value = []
}

function adicionarLinkEdit() {
    if (!editIcone.value || !editTexto.value || !editUrl.value) {
        alert('Preencha ícone, texto e URL do link.')
        return
    }
    editLinks.value.push({ icone: editIcone.value, texto: editTexto.value, url: editUrl.value })
    editIcone.value = ''
    editTexto.value = ''
    editUrl.value = ''
}

function removerLinkEdit(i) {
    editLinks.value.splice(i, 1)
}

function salvarEdicao() {
    lojaStore.editarLoja(editIndex.value, {
        nome: editNome.value,
        logo: editLogo.value,
        links: [...editLinks.value]
    })
    closeEditModal()
}

function deletarLoja(index) {
    if (confirm('Deseja realmente excluir esta loja?')) {
        lojaStore.removerLoja(lojaStore.lojas[index].id)
    }
}

// opções de ícones
const opcoesIcones = [
    { label: 'Facebook', value: 'fa-brands fa-facebook' },
    { label: 'Instagram', value: 'fa-brands fa-instagram' },
    { label: 'Twitter', value: 'fa-brands fa-twitter' },
    { label: 'YouTube', value: 'fa-brands fa-youtube' },
    { label: 'LinkedIn', value: 'fa-brands fa-linkedin' },
    { label: 'Website', value: 'fa-solid fa-globe' },
    { label: 'Localização', value: 'fa-solid fa-location-dot' }
]

function acessarLoja(id) {
  router.push(`/stores/${id}`)
}

function acessarDetalheLoja(id) {
  router.push(`/stores/${id}/detail`)
}

onMounted(() => {
    lojaStore.listarLojas()
})
</script>

<template>
    <div>
        <!-- Formulário de cadastro -->
        <h3 class="text-lg font-bold text-zinc-800">Cadastro de Lojas</h3>
        <div class="space-y-3 mb-6">
            <Input v-model="novaLojaNome" placeholder="Nome da loja" id="nova-loja" name="nova-loja" />
            <div>
                <input id="upload-logo" type="file" accept=".svg" @change="handleFileUpload" class="hidden" />
                <label for="upload-logo"
                    class="cursor-pointer inline-block rounded-md bg-indigo-50 border px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                    Enviar logo (.svg)
                </label>
                <span v-if="novaLojaLogo" class="ml-2 text-sm text-gray-600">Arquivo pronto</span>
            </div>
            <div class="space-y-2">
                <p class="font-semibold">Links da página</p>
                <div class="flex flex-col sm:flex-row gap-2">
                    <IconSelect
                      v-model="novoIcone"
                      :options="opcoesIcones"
                      placeholder="Ícone"
                      class="flex-1"
                    />
                    <Input id="text-new" name="text-new" v-model="novoTexto" placeholder="Texto do botão"
                        :input-class="inputBaseClass" />
                    <Input id="url-new" name="url-new" v-model="novaUrl" placeholder="URL"
                        :input-class="inputBaseClass" />
                    <Button @click="adicionarLink">Adicionar</Button>
                </div>
                <ul class="mt-2 space-y-1">
                    <li v-for="(l, i) in novaLinks" :key="i" class="flex items-center gap-2">
                        <i :class="l.icone"></i>
                        <span>{{ l.texto }}</span>
                        <button @click="novaLinks.splice(i, 1)" class="text-red-500">✖</button>
                    </li>
                </ul>
            </div>
            <Button @click="cadastrarLoja">Cadastrar Loja</Button>
        </div>

        <div class="divider"></div>

        <!-- Listagem de lojas -->
        <h3 class="text-lg font-semibold mb-3">Lojas Cadastradas</h3>
        <div v-if="lojaStore.carregando">Carregando lojas...</div>
        <div v-else-if="lojaStore.erro" class="text-red-500">{{ lojaStore.erro }}</div>
        <ul v-else class="space-y-2">
            <li v-for="(loja, idx) in lojaStore.lojas" :key="loja.id"
                class="border p-3 rounded flex flex-col justify-between ">
                <div class="flex items-center gap-3">
                    <img :src="loja.logo_url" alt="logo" class="w-8 h-8 object-contain" />
                    <span class="font-medium">{{ loja.name }}</span>
                </div>
                <div class="flex gap-2 mt-2">
                    <Button size="sm" variant="acessar" @click="acessarLoja(loja.id)">Acessar</Button>
                    <Button size="sm" variant="detalhe" @click="acessarDetalheLoja(loja.id)">Detalhe</Button>
                    <Button size="sm" variant="editar" @click="openEditModal(idx)">Editar</Button>
                    <Button size="sm" variant="excluir" @click="deletarLoja(idx)">Excluir</Button>
                </div>
            </li>
        </ul>

        <!-- Modal de edição -->
        <EditStoreModal :isOpen="isEditModalOpen" :storeData="{
            nome: editNome,
            logo: editLogo,
            links: editLinks
        }" :opcoesIcones="opcoesIcones" :inputBaseClass="inputBaseClass" @save="dados => {
            lojaStore.editarLoja(editIndex, dados)
            closeEditModal()
        }" @cancel="closeEditModal" />

    </div>
</template>
