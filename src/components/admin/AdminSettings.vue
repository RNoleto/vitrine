<script setup>
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Configurações</h1>
    <p class="text-gray-700">Configure as opções do sistema aqui.</p>

    <form class="mt-6 max-w-md space-y-4">
      <div>
        <label class="block font-medium text-gray-700 mb-1">Nome do sistema</label>
        <input type="text" class="w-full border-gray-300 rounded p-2 shadow-sm" placeholder="Ex: Sistema Admin" />
      </div>

      <div>
        <label class="block font-medium text-gray-700 mb-1">Email de suporte</label>
        <input type="email" class="w-full border-gray-300 rounded p-2 shadow-sm" placeholder="suporte@example.com" />
      </div>

      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Salvar
      </button>
    </form>
  </section>
</template>
