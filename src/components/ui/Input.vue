<template>
  <input
    :type="type"
    :name="name"
    :id="id"
    :autocomplete="autocomplete"
    :required="required"
    :placeholder="placeholder"
    :class="inputClass"
    :value="type !== 'checkbox' ? modelValue : null"
    :checked="type === 'checkbox' ? modelValue : null"
    @input="onInput"
    @change="onChange"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
  <p v-if="errorMessage" class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
</template>

<script setup>
const {
  type,
  id,
  name,
  autocomplete,
  required,
  placeholder,
  modelValue,
  inputClass,
  errorMessage
} = defineProps({
  type: { type: String, default: 'text' },
  id: { type: String, required: false },
  name: { type: String, required: false },
  autocomplete: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  modelValue: [String, Boolean],
  inputClass: {
    type: String,
    default:
      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
  },
  errorMessage: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

function onInput(event) {
  if (type !== 'checkbox') {
    emit('update:modelValue', event.target.value)
  }
}

function onChange(event) {
  if (type === 'checkbox') {
    emit('update:modelValue', event.target.checked)
  }
}
</script>
