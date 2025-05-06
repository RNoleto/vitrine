<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import EditStoreModal from '../ui/EditStoreModal.vue'
import IconSelect from '../ui/IconSelect.vue'
import Loading from '../ui/Loading.vue'
import StoreCard from '../ui/StoreCard.vue'

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

async function cadastrarLoja() {
    const nomeLimpo = novaLojaNome.value.trim();
    if (nomeLimpo.length < 3 || !/^[\p{L}\d\s\-_]+$/u.test(nomeLimpo)) {
        alert('Nome inválido. Use pelo menos 3 caracteres alfanuméricos.');
        return;
    }
    // lojaStore.adicionarLoja(novaLojaNome.value, novaLojaLogo.value, [...novaLinks.value])
    await lojaStore.adicionarLoja({
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
const editId = ref(null);
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
    editId.value = loja.id
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
    if (!editId.value) {
        alert('Erro: ID da loja não definido para edição.')
        return
    }

    lojaStore.editarLoja(editId.value, {
        name: editNome.value,
        logo: editLogo.value,
        links: [...editLinks.value]
    })

    closeEditModal()
}

const deletarLoja = async (index) => {
    if (confirm('Deseja realmente excluir esta loja?')) {
        try {
            await lojaStore.excluirLoja(lojaStore.lojas[index].id)
            alert('Loja excluída com sucesso!');
        } catch (error) {
            alert('Erro ao excluir loja: ' + (error.message || 'Tente novamente mais tarde.'))
        }
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

function acessarLoja(slug) {
    const url = router.resolve(`/${slug}`).href
    window.open(url, '_blank', 'noopener,noreferrer')
}

function acessarDetalheLoja(slug) {
    router.push(`/stores/${slug}/detail`)
}

onMounted(() => {
    lojaStore.listarLojas()
})
</script>

<template>
    <div>
        <!-- Formulário de cadastro -->
        <h3 class="text-lg font-bold text-zinc-800">Cadastro de Vitrines</h3>
        <div class="space-y-3 my-6">
            <Input v-model="novaLojaNome" placeholder="Nome da loja" id="nova-loja" name="nova-loja" />
            <div class="mt-2">
                <input id="upload-logo" type="file" accept=".svg" @change="handleFileUpload" class="hidden" />
                <label for="upload-logo"
                    class="cursor-pointer inline-block rounded-md bg-indigo-50 border px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                    Enviar logo
                </label>
                <span v-if="novaLojaLogo" class="ml-2 text-sm text-gray-600">Arquivo pronto</span>
            </div>
            <div class="divider"></div>
            <div class="space-y-2">
                <p class="font-semibold">Links da página</p>
                <div class="flex flex-col sm:grid sm:grid-cols-4 gap-2">
                    <IconSelect v-model="novoIcone" :options="opcoesIcones" placeholder="Ícone" class="flex-1" />
                    <Input id="text-new" name="text-new" v-model="novoTexto" placeholder="Texto do botão"
                        :input-class="inputBaseClass" />
                    <Input id="url-new" name="url-new" v-model="novaUrl" placeholder="URL"
                        :input-class="inputBaseClass" />
                    <Button @click="adicionarLink" class="items-center">Adicionar Link</Button>
                </div>
                <ul class="mt-2 space-y-1">
                    <li v-if="novaLinks.length >= 1" class="text-gray-500 mb-2">Links adicionados</li>
                    <li v-for="(l, i) in novaLinks" :key="i" class="flex items-center gap-2">
                        <i :class="l.icone"></i>
                        <span>{{ l.texto }}</span>
                        <button @click="novaLinks.splice(i, 1)" class="text-red-500">✖</button>
                    </li>
                </ul>
            </div>
            <Button @click="cadastrarLoja" :disabled="lojaStore.cadastrando || lojaStore.carregando">
                {{ lojaStore.cadastrando ? 'Cadastrando...' : 'Cadastrar loja' }}
            </Button>
        </div>

        <div class="divider"></div>

        <!-- Listagem de lojas -->
        <section>
            <h3 class="text-lg font-semibold mb-3">Vitrines Cadastradas</h3>
            <Loading v-if="lojaStore.carregando" text="" />
            <div v-else-if="lojaStore.erro" class="text-red-500">{{ lojaStore.erro }}</div>
            <ul v-else class="flex flex-col flex-wrap gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3">
                <!-- <li v-for="(loja, idx) in lojaStore.lojas" :key="loja.id"
                    class="border p-3 rounded flex flex-col justify-between ">
                    <div class="flex items-center gap-3 mb-2">
                        <img :src="loja.logo_url" alt="logo" class="w-8 h-8 object-contain" />
                        <span class="font-medium">{{ loja.name }}</span>
                    </div>
                    <div class="flex gap-2 mt-1 sm:grid sm:grid-cols-2">
                        <Button size="sm" variant="acessar" @click="acessarLoja(loja.slug)">Acessar</Button>
                        <Button size="sm" variant="detalhe" @click="acessarDetalheLoja(loja.slug)">Detalhe</Button>
                        <Button size="sm" variant="editar" @click="openEditModal(idx)">Editar</Button>
                        <Button size="sm" variant="excluir" @click="deletarLoja(idx)">Excluir</Button>
                    </div>
                </li> -->
                <StoreCard
  v-for="(loja, idx) in lojaStore.lojas"
  :key="loja.id"
  :store="loja"
  :index="idx"
  @access="acessarLoja"
  @detail="acessarDetalheLoja"
  @edit="openEditModal"
  @delete="deletarLoja"
/>
            </ul>

            <!-- Modal de edição -->
            <EditStoreModal :isOpen="isEditModalOpen" :storeData="{
                id: editId,
                nome: editNome,
                logo: editLogo,
                links: editLinks
            }" :opcoesIcones="opcoesIcones" :inputBaseClass="inputBaseClass" @save="(dados) => {
                lojaStore.editarLoja(dados.id, dados)
                closeEditModal()
            }" @cancel="closeEditModal" />
        </section>

    </div>
</template>
