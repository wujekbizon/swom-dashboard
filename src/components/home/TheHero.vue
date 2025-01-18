<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

interface Highlight {
  text: string
  color: string
}

const highlights = ref<Highlight[]>([
  { text: 'Patient Care', color: 'text-blue-500' },
  { text: 'Efficiency', color: 'text-emerald-500' },
  { text: 'Compliance', color: 'text-indigo-500' },
  { text: 'Security', color: 'text-purple-500' },
])

const currentIndex = ref(0)
const currentHighlight = computed(() => highlights.value[currentIndex.value])

const intervalId = setInterval(() => {
  currentIndex.value = (currentIndex.value + 1) % highlights.value.length
}, 2000)

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

// Example of a simple reactive counter for active users
const activeUsers = ref(42)
const incrementUsers = () => activeUsers.value++
</script>

<template>
  <div class="h-full min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-blue-50">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-6">
        Transforming Healthcare Through
        <span
          :class="currentHighlight.color"
          class="transition-colors duration-500 block mt-2"
        >
          {{ currentHighlight.text }}
        </span>
      </h1>
      
      <p class="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Empowering medical caregivers with intelligent tools for better patient outcomes.
        Streamline your daily workflows and focus on what matters most - your patients.
      </p>

      <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <button
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                 transition-colors duration-200 flex items-center gap-2"
        >
          Get Started
        </button>
        <button
          class="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 
                 rounded-lg transition-colors duration-200"
        >
          Schedule Demo
        </button>
      </div>

      <div class="flex items-center justify-center gap-8 text-gray-600">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ activeUsers }}+</div>
          <div class="text-sm">Active Users</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">24/7</div>
          <div class="text-sm">Support</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">HIPAA</div>
          <div class="text-sm">Compliant</div>
        </div>
      </div>
    </div>
  </div>
</template> 