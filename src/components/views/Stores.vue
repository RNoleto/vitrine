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
</script>

<template>
    <div>
        <p>Lojas cadastradas e ação para salvar novas Lojas</p>

        <div class="space-y-3 mt-10">
            <div>
                <p class="font-semibold">Cadastrar Loja</p>
                <div class="mt-2">
                    <Input v-model="loja" placeholder="Digite o nome da loja" id="loja" name="loja" type="text"
                        autocomplete="off" required />
    
                    <!-- Campo para upload do logo -->
                    <input type="file" accept=".svg" @change="handleFileUpload" class="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>

                <!-- Adicionar links -->
                <p class="font-semibold">Links da página</p>
                <div class="mt-2 flex flex-col gap-2 flex-wrap sm:flex-row">
                    <Input id="buttonIcon" name="buttonIcon" v-model="novoIcone" placeholder="Ícone (ex: fa-brands fa-apple)"
                        :input-class="'flex-1 ' + inputBaseClass" />
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

            <div>
                <p class="font-semibold">Lojas cadastradas</p>
                <ul class="space-y-2">
                    <li v-for="(loja, index) in lojaStore.lojas" :key="index" class="border rounded-md p-2">
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
