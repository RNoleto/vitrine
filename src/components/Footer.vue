<script setup>
import { version } from '../../package.json'
</script>

<template>
  <footer class="py-6 text-center text-xs text-gray-400 border-t border-gray-100 mt-8 flex flex-col items-center gap-1.5">
    <a href="https://rnoleto.vercel.app" target="_blank" rel="portfolio Ramon Noleto" class="hover:text-indigo-600 transition-colors duration-200 font-medium">
      Desenvolvido por Ramon Noleto
    </a>
    <span class="font-mono bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200 text-[10px] text-gray-500 shadow-xs">
      v{{ version }}
    </span>
  </footer>
</template>