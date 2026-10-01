<template>
  <div class="relative min-w-[140px]" ref="dropdownRef">
    <button
      @click.stop="toggleOpen"
      type="button"
      class="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 bg-gray-50/80 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-gray-800 shadow-2xs cursor-pointer"
    >
      <span class="flex items-center gap-2 truncate">
        <span v-if="modelValue" class="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <i :class="modelValue" class="text-xs"></i>
        </span>
        <span class="truncate">{{ selectedOptionLabel }}</span>
      </span>
      <i class="fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': open }"></i>
    </button>

    <Transition name="fade-down">
      <ul
        v-if="open"
        class="absolute left-0 top-full mt-1.5 w-full min-w-[210px] z-50 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto p-1.5 space-y-1 text-xs select-none"
      >
        <li
          v-for="opt in options"
          :key="opt.value"
          @click="select(opt)"
          :class="[
            'cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all font-medium',
            modelValue === opt.value
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-900'
          ]"
        >
          <div :class="[
            'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs',
            modelValue === opt.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-indigo-600'
          ]">
            <i :class="opt.value"></i>
          </div>
          <span class="truncate flex-1">{{ opt.label }}</span>
          <i v-if="modelValue === opt.value" class="fa-solid fa-check text-xs"></i>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  options: { type: Array, default: () => [] },  
  placeholder: { type: String, default: 'Selecione um ícone' }
})
const emit = defineEmits(['update:modelValue'])
const open = ref(false)
const dropdownRef = ref(null)

const selectedOptionLabel = computed(() => {
  if (!props.modelValue) return props.placeholder
  const found = props.options?.find(o => o.value === props.modelValue)
  return found?.label || props.modelValue || props.placeholder
})

function toggleOpen() {
  open.value = !open.value
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

function select(opt) {
  emit('update:modelValue', opt.value)
  open.value = false
}
</script>

<style scoped>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.2s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
  