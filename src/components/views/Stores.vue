<script setup>
import { ref } from 'vue'
import Input from '../ui/Input.vue'

const loja = ref('')
</script>

<template>
  <div>
    <p>Lojas cadastradas e ação para salvar novas Lojas</p>

    <div class="space-y-3 mt-10">
      <div>
        <p>Cadastrar Loja</p>

        <Input
          type="text"
          name="loja"
          id="loja"
          autocomplete="loja"
          required
          placeholder="Nome da loja"
          v-model="loja"
        />

        <button
          type="submit"
          class="mt-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Cadastrar
        </button>
      </div>

      <div>
        <p>Lojas cadastradas</p>
        <ul>
          <li>Loja 1</li>
          <li>Loja 2</li>
        </ul>
      </div>
    </div>
  </div>
</template>
