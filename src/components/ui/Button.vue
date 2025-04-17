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
  acessar: 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600',
  detalhe: 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
  editar: 'bg-yellow-500 hover:bg-yellow-400 focus-visible:outline-yellow-500',
  cancelar: 'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600',
  excluir: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
  default: 'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600'
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      'mt-1 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2',
      variantClasses[props.variant] || variantClasses.default,
      props.customClass
    ]"
  >
    <slot />
  </button>
</template>
