<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'mt-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
      customClass
    ]"
  >
    <slot />
  </button>
</template>
