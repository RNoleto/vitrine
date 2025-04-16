<script setup>
import { ref } from 'vue'
import { useLojaStore } from '../../stores/lojaStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const loja = ref('')
const lojaStore = useLojaStore()

function cadastrarLoja(){
    lojaStore.adicionarLoja(loja.value)
    loja.value = ''
}
</script>

<template>
  <div>
    <p>Lojas cadastradas e ação para salvar novas Lojas</p>

    <div class="space-y-3 mt-10">
      <div>
        <p>Cadastrar Loja</p>

        <Input
          v-model="loja"
          placeholder="Digite o nome da loja"
          id="loja"
          name="loja"
          type="text"
          autocomplete="off"
          required
        />
        <Button type="submit" @click="cadastrarLoja">Cadastrar</Button>
      </div>

      <div>
        <p>Lojas cadastradas</p>
        <ul>
          <li v-for="(nome, index) in lojaStore.lojas" :key="index">
            {{ nome }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
