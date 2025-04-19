<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'

const route = useRoute()
const lojaStore = useLojaStore()
const contactStore = useContactStore()

const lojaId = parseInt(route.params.id)
const loja = lojaStore.lojas.find(l => l.id === lojaId)

const contatosDaLoja = computed(() =>
  contactStore.contact.filter(c => c.empresa === lojaId)
)

// Monta a URL completa da página da loja
const longUrl = `${window.location.origin}/stores/${lojaId}`

// Estado para a URL encurtada
const shortUrl = ref('')

// URL do QR code — usa a curta se disponível, senão a longa
const qrCodeUrl = computed(() => {
  const target = shortUrl.value || longUrl
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(target)}&size=200x200`
})

// Ao montar, tenta buscar o TinyURL
onMounted(async () => {
  try {
    const resp = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
    )
    if (resp.ok) shortUrl.value = await resp.text()
    else shortUrl.value = longUrl
  } catch {
    shortUrl.value = longUrl
  }
})

// Copiar para área de transferência
function copyLink() {
  const text = shortUrl.value || longUrl
  navigator.clipboard.writeText(text)
    .then(() => alert('Link copiado!'))
    .catch(() => alert('Falha ao copiar link.'))
}

// Abre um dos links cadastrados
function abrirLink(url) {
  if (url) window.open(url, '_blank')
  else alert('Link inválido.')
}

// Navega para a página de contatos da loja
function irParaContatos() {
  window.location.href = `/contacts/${lojaId}`
}
</script>

<template>
  <div v-if="loja" class="max-w-4xl mx-auto py-8 px-4 space-y-10">
    <h1 class="text-3xl font-bold">Detalhes da Loja</h1>

    <!-- Compartilhamento -->
    <section>
      <h2 class="text-xl font-semibold mb-2">Compartilhar esta página</h2>
      <div class="flex gap-2">
        <input
          :value="shortUrl || longUrl"
          readonly
          class="flex-1 border px-3 py-2 rounded"
        />
        <button
          @click="copyLink"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Copiar
        </button>
      </div>
      <div class="mt-4 text-center">
        <img :src="qrCodeUrl" alt="QR Code da loja" class="mx-auto" />
        <div class="mt-2">
          <a
            :href="qrCodeUrl"
            download="qr-loja-{{ lojaId }}.png"
            class="text-sm text-indigo-600 hover:underline"
          >
            Baixar QR code
          </a>
        </div>
      </div>
    </section>

    <!-- Logo e Nome -->
    <section class="flex items-center gap-6">
      <img
        :src="loja.logo_url"
        alt="Logo da Loja"
        class="w-24 h-24 object-contain"
      />
      <h2 class="text-2xl font-semibold">{{ loja.name }}</h2>
    </section>

    <!-- Links da Loja -->
    <section>
      <h3 class="text-xl font-bold mb-4">Links</h3>
      <div v-if="loja.links.length" class="space-y-2">
        <div
          v-for="(link, i) in loja.links"
          :key="i"
          class="flex items-center gap-2"
        >
          <i :class="link.icone"></i>
          <a
            :href="link.url"
            target="_blank"
            class="text-indigo-600 hover:underline"
          >
            {{ link.texto }}
          </a>
        </div>
      </div>
      <p v-else class="text-gray-500">Nenhum link cadastrado.</p>
    </section>

    <!-- Contatos da Loja -->
    <section>
      <h3 class="text-xl font-bold mb-4">Contatos</h3>
      <div v-if="contatosDaLoja.length" class="space-y-3">
        <div
          v-for="contato in contatosDaLoja"
          :key="contato.nome"
          class="flex items-center gap-4 p-4 border rounded"
        >
          <img
            :src="contato.foto"
            alt="Foto do contato"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div class="text-left">
            <p><strong>Nome:</strong> {{ contato.nome }}</p>
            <p><strong>Telefone:</strong> {{ contato.contato }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">
        Nenhum contato atribuído a esta loja.
      </p>
    </section>
  </div>

  <p v-else class="text-center text-red-600 mt-10">Loja não encontrada.</p>
</template>
