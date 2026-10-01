<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  variant: {
    type: String,
    default: 'detalhe',
    validator: (v) => ['acessar','detalhe','editar', 'cancelar','excluir','default'].includes(v)
  },
  customClass: { type: String, default: '' }
})

const variantClasses = {
  acessar: 'bg-blue-600 hover:bg-blue-500 text-white focus-visible:outline-blue-600',
  detalhe: 'bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:outline-indigo-600',
  editar: 'bg-amber-500 hover:bg-amber-400 text-white focus-visible:outline-amber-500',
  cancelar: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus-visible:outline-gray-400',
  excluir: 'bg-red-600 hover:bg-red-500 text-white focus-visible:outline-red-600',
  default: 'bg-gray-600 hover:bg-gray-500 text-white focus-visible:outline-gray-600'
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      'cursor-pointer flex justify-center items-center rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs focus-visible:outline-2 focus-visible:outline-offset-2',
      variantClasses[props.variant] || variantClasses.default,
      props.customClass
    ]"
  >
    <slot />
  </button>
</template>
