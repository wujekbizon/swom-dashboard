<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Ustawienia</h2>
      
      <!-- Theme Toggle -->
      <div class="flex items-center justify-between py-3 border-b dark:border-gray-700">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Motyw</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Przełącz między jasnym i ciemnym motywem</p>
        </div>
        <button
          @click="toggleDark()"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          :aria-label="isDark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'"
        >
          <SunIcon v-if="isDark" class="h-5 w-5 text-gray-900 dark:text-white" />
          <MoonIcon v-else class="h-5 w-5 text-gray-900 dark:text-white" />
        </button>
      </div>
    </div>
  </div>
</template> 