<script setup lang="ts">
import { computed, Transition } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const bgColor = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-500'
    case 'info': return 'bg-blue-500'
    case 'warning': return 'bg-yellow-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-green-500'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed bottom-4 right-4 z-50 pointer-events-auto flex w-full max-w-md rounded-lg shadow-lg"
    >
      <div :class="[bgColor, 'p-4 w-full rounded-lg']">
        <div class="flex items-start">
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-white">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex text-white hover:opacity-75"
              @click="emit('close')"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template> 