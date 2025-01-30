<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-medium mb-2 text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ message }}
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 
                 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          {{ cancelLabel || 'Anuluj' }}
        </button>
        <button
          @click="emit('confirm')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent 
                 rounded-md shadow-sm hover:bg-red-700 dark:hover:bg-red-500"
        >
          {{ confirmLabel || 'Usuń' }}
        </button>
      </div>
    </div>
  </div>
</template> 