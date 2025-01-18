<script setup lang="ts">
import { ref, computed, watchEffect, watch} from 'vue'
import Toast from '../ui/Toast.vue'

// Types
interface Highlight {
  text: string
  color: string
}

// Rotating highlights configuration
const highlights = ref<Highlight[]>([
  { text: 'Patient Care', color: 'text-blue-500' },
  { text: 'Efficiency', color: 'text-emerald-500' },
  { text: 'Compliance', color: 'text-indigo-500' },
  { text: 'Security', color: 'text-purple-500' },
])

// Highlight rotation state and computed
const currentIndex = ref(0)
const currentHighlight = computed(() => highlights.value[currentIndex.value])

// Animation timing control with automatic cleanup
let timeoutId: number
watchEffect((onCleanup) => {
  const rotateHighlight = () => {
    timeoutId = setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % highlights.value.length
      if (currentIndex.value === 0) {
        setTimeout(rotateHighlight, 3000) // Longer pause at the end of cycle
      } else {
        rotateHighlight()
      }
    }, 2000) // Standard display time for each highlight
  }

  rotateHighlight()
  onCleanup(() => clearTimeout(timeoutId))
})

// Interactive demo state management
const activeUsers = ref(42)
const showToast = ref(false)
const toastMessage = ref('')

// Handler for active users counter with toast notification
const incrementUsers = () => {
  activeUsers.value++
  toastMessage.value = `Active users increased to ${activeUsers.value}`
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// Debug: Monitor active users changes
watch(activeUsers, (newValue, oldValue) => {
  console.log('activeUsers changed:', { oldValue, newValue })
})
</script>

<template>
  <!-- Hero section container -->
  <div class="h-full min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-blue-50">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Main heading with animated highlights -->
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-6">
        Transforming Healthcare Through
        <div class="relative h-[1.2em] overflow-hidden mt-2">
          <div
            :class="[
              currentHighlight.color,
              'animate-fade-text transition-all duration-300'
            ]"
          >
            {{ currentHighlight.text }}
          </div>
        </div>
      </h1>
      
      <!-- Hero description -->
      <p class="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Empowering medical caregivers with intelligent tools for better patient outcomes.
        Streamline your daily workflows and focus on what matters most - your patients.
      </p>

      <!-- Call to action buttons -->
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

      <!-- Statistics section -->
      <div class="flex items-center justify-center gap-8 text-gray-600">
        <!-- Interactive user counter -->
        <div 
          class="text-center cursor-pointer hover:opacity-75 transition-opacity"
          @click="incrementUsers"
        >
          <div class="text-2xl font-bold text-blue-600">{{ activeUsers }}+</div>
          <div class="text-sm">Active Users</div>
        </div>
        <!-- Static statistics -->
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

  <!-- Toast notification component -->
  <Toast
    :show="showToast"
    :message="toastMessage"
    type="info"
    @close="showToast = false"
  />
</template>

 