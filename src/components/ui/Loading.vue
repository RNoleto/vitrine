<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Carregando suas vitrines...'
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div 
    :class="[
      'flex flex-col items-center justify-center transition-all duration-300 select-none w-full',
      compact ? 'py-6 min-h-[200px]' : 'min-h-[50vh] flex-1 my-auto py-10'
    ]"
  >
    <!-- Vitrine Animated Showcase Container -->
    <div class="relative flex items-center justify-center mb-6">
      
      <!-- Ambient Glow Backdrop -->
      <div class="absolute w-36 h-36 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>

      <!-- Outer Spinning Gradient Ring -->
      <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 animate-spin-slow">
        <div class="w-full h-full bg-white rounded-[22px]"></div>
      </div>

      <!-- Orbiting Sparkle Element -->
      <div class="absolute w-28 h-28 animate-spin-reverse pointer-events-none">
        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-indigo-600 rounded-full flex items-center justify-center text-[9px] text-white shadow-md shadow-indigo-500/50">
          <i class="fa-solid fa-sparkles"></i>
        </div>
      </div>

      <!-- Center Store Badge (Glassmorphic Storefront Icon) -->
      <div class="absolute inset-0 m-auto w-16 h-16 bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-lg flex items-center justify-center group animate-float">
        <div class="relative flex items-center justify-center">
          <i class="fa-solid fa-store text-2xl text-indigo-600 transform group-hover:scale-110 transition-transform"></i>
          
          <!-- Miniature Floating Badge -->
          <span class="absolute -top-2 -right-2 flex h-3.5 w-3.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600 text-[8px] text-white font-bold items-center justify-center">✨</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Animated Loading Text & Bouncing Dots (Alta Legibilidade & Contraste) -->
    <div class="text-center space-y-1.5 z-10">
      <div class="flex items-center justify-center gap-1.5 text-base font-extrabold text-slate-900">
        <span>{{ text }}</span>
        <div class="flex items-center gap-1 ml-0.5">
          <span class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span class="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span class="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
        </div>
      </div>
      <p class="text-xs font-semibold text-slate-600 tracking-wide">
        Sua vitrine digital inteligente em tempo real
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes spinSlow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinReverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-4px) scale(1.03);
  }
}

.animate-spin-slow {
  animation: spinSlow 6s linear infinite;
}

.animate-spin-reverse {
  animation: spinReverse 8s linear infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>