<script setup>
import { ref } from 'vue'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const loja = ref('')
const logo = ref(null)
const lojaStore = useLojaStore()

const novoIcone = ref('')
const novoTexto = ref('')
const novaUrl = ref('')
const links = ref([])

const inputBaseClass = 'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'


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

function adicionarLink() {
    if (!novoIcone.value || !novoTexto.value || !novaUrl.value) {
        alert('Preencha ícone, texto e URL do link.')
        return
    }
    links.value.push({
        icone: novoIcone.value,
        texto: novoTexto.value,
        url: novaUrl.value,
    })
    novoIcone.value = ''
    novoTexto.value = ''
    novaUrl.value = ''
}

function cadastrarLoja() {
    if (!loja.value || !logo.value) {
        alert('Preencha todos os campos.')
        return
    }

    lojaStore.adicionarLoja(loja.value, logo.value, links.value)
    loja.value = ''
    logo.value = null
    links.value = []
}

const opcoesIcones = [
  { label: 'Facebook', value: 'fa-brands fa-facebook' },
  { label: 'Instagram', value: 'fa-brands fa-instagram' },
  { label: 'Twitter', value: 'fa-brands fa-twitter' },
  { label: 'YouTube', value: 'fa-brands fa-youtube' },
  { label: 'LinkedIn', value: 'fa-brands fa-linkedin' },
  { label: 'Website', value: 'fa-solid fa-globe' },
  { label: 'Localização', value: 'fa-solid fa-location-dot' }
]

const dropdownAtivo = ref(false)

function selecionarIcone(icone) {
  novoIcone.value = icone
  dropdownAtivo.value = false
}
</script>

<template>
    <div>
        <p>Lojas cadastradas e ação para salvar novas Lojas</p>

        <div class="space-y-3 mt-10">
            <div>
                <p class="font-semibold">Cadastrar Loja</p>
                <div class="mt-2 flex flex-col gap-2">
                    <Input v-model="loja" placeholder="Digite o nome da loja" id="loja" name="loja" type="text"
                        autocomplete="off" required />

                    <!-- Campo para upload do logo -->
                    <input
                      type="file"
                      id="upload-logo"
                      accept=".svg"
                      @change="handleFileUpload"
                      class="hidden"
                    />

                    <!-- Label como botão -->
                    <label
                      for="upload-logo"
                      class="cursor-pointer inline-block rounded-md bg-indigo-50 border-indigo-100 border-1 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      Enviar logo da loja (.svg)
                    </label>
                    <p v-if="logo" class="text-sm text-gray-600 mt-1">Arquivo selecionado</p>
                </div>
                <div class="divider"></div>
                <!-- Adicionar links -->
                <p class="font-semibold">Links da página</p>
                <div class="my-2 flex flex-col gap-2 flex-wrap sm:flex-row">
                    <div class="relative flex-1">
                      <button @click="dropdownAtivo = !dropdownAtivo" type="button"
                        class="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:border-indigo-500">
                        <span class="flex items-center gap-2">
                          <i v-if="novoIcone" :class="novoIcone"></i>
                          {{ novoIcone ? opcoesIcones.find(i => i.value === novoIcone)?.label : 'Selecione um ícone' }}
                        </span>
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                  
                      <ul v-show="dropdownAtivo"
                        class="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
                        <li v-for="opcao in opcoesIcones" :key="opcao.value" @click="selecionarIcone(opcao.value)"
                          class="cursor-pointer px-3 py-2 hover:bg-indigo-100 flex items-center gap-2 text-sm">
                          <i :class="opcao.value"></i>
                          {{ opcao.label }}
                        </li>
                      </ul>
                    </div>
                    <Input id="buttonText" name="buttonText" v-model="novoTexto" placeholder="Texto do botão"
                        :input-class="'flex-1 ' + inputBaseClass" />
                    <Input id="buttonUrl" name="buttonUrl" v-model="novaUrl" placeholder="URL (ex: https://...)"
                        :input-class="'flex-1 ' + inputBaseClass" />
                    <Button @click="adicionarLink">Adicionar Link</Button>
                </div>

                <!-- Mostrar links antes de salvar -->
                <div v-if="links && links.length" class="mt-4">
                    <p class="font-semibold">Links Adicionados:</p>
                    <ul class="space-y-2">
                        <li v-for="(link, index) in links" :key="index" class="flex items-center gap-2">
                            <i :class="link.icone"></i>
                            <span class="text-sm font-medium">{{ link.texto }}</span>
                            <span class="text-xs text-gray-500">{{ link.url }}</span>
                        </li>
                    </ul>
                </div>

                <Button type="submit" @click="cadastrarLoja">Finalizar Cadastro da Loja</Button>
            </div>

            <div class="divider"></div>
            
            <!-- Lista de lojas cadastradas -->

            <div>
                <p class="font-semibold">Lojas cadastradas</p>
                <ul class="space-y-2">
                    <li v-for="(loja, index) in lojaStore.lojas" :key="index" class="border rounded-md p-2" @click="$router.push({ name: 'StoreDetail', params: {id: index}})">
                        <div class="flex items-center space-x-3">
                            <img :src="loja.logo" alt="Logo" class="w-8 h-8" />
                            <span class="font-medium">{{ loja.nome }}</span>
                        </div>
                        <div v-if="loja.links?.length" class="mt-2 pl-4">
                            <p class="text-xs font-semibold">Links:</p>
                            <ul class="flex flex-wrap gap-2 mt-2">
                                <li v-for="(link, i) in loja.links" :key="i">
                                    <a :href="link.url" target="_blank" rel="noopener"
                                        class="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
                                        <i :class="link.icone"></i>
                                        <span>{{ link.texto }}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
