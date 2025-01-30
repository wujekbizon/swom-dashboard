<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <button
    @click="goBack"
    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border 
           border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 
           dark:border-gray-600 dark:hover:bg-gray-700"
  >
    <ArrowLeftIcon class="w-4 h-4" />
    Powrót
  </button>
</template> 