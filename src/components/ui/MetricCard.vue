<template>
    <div class="bg-white shadow-md rounded-lg p-2 w-full max-w-sm">
      <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
      <ul class="space-y-1">
        <li
          v-for="(item, index) in metrics"
          :key="index"
          class="flex justify-between text-sm text-gray-700"
        >
          <span>{{ item.label }}</span>
          <slot name="value" :item="item">
            <span class="font-semibold">{{ item.value }}</span>
          </slot>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    metrics: {
      type: Array,
      default: () => [],
    },
  });
  </script>
  