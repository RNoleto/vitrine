<template>
    <div class="relative">
      <button
        @click="open = !open"
        type="button"
        class="w-full flex items-center justify-between border p-2 rounded bg-white"
      >
        <span class="flex items-center gap-2">
          <i v-if="modelValue" :class="modelValue"></i>
          <span>{{ modelValue ? options.find(o => o.value === modelValue).label : placeholder }}</span>
        </span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <ul
        v-show="open"
        class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-auto"
      >
        <li
          v-for="opt in options"
          :key="opt.value"
          @click="select(opt)"
          class="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-indigo-50"
        >
          <i :class="opt.value"></i>
          <span>{{ opt.label }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    modelValue: String,
    options: { type: Array, required: true },  
    placeholder: { type: String, default: 'Selecione um ícone' }
  })
  const emit = defineEmits(['update:modelValue'])
  const open = ref(false)
  
  // fecha dropdown ao clicar fora
  function handleClickOutside(e) {
    if (!e.target.closest('.relative')) open.value = false
  }
  watch(open, val => {
    if (val) window.addEventListener('click', handleClickOutside)
    else window.removeEventListener('click', handleClickOutside)
  })
  
  function select(opt) {
    emit('update:modelValue', opt.value)
    open.value = false
  }
  </script>
  