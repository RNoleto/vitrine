<template>
    <input
      :type="type"
      :name="name"
      :id="id"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :class="inputClass"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </template>
  
  <script setup>
  defineProps({
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    id: { type: String, required: true },
    autocomplete: { type: String, default: '' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    modelValue: String,
    inputClass: {
      type: String,
      default:
        'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
    },
  })
  </script>
  