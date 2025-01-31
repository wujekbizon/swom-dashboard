<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useAuditLogsStore } from '@/stores/auditLogs'
import { ref } from 'vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const auditLogsStore = useAuditLogsStore()
const showAuditLogs = ref(false)

async function toggleAuditLogs() {
  if (!showAuditLogs.value) {
    await auditLogsStore.fetchLogs()
  }
  showAuditLogs.value = !showAuditLogs.value
}
</script>

<template>
  <div class="space-y-6 p-4">
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

      <!-- Audit Logs -->
      <div class="mt-6">
        <div class="flex items-center justify-between py-3 border-b dark:border-gray-700">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">System Auditing</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ auditLogsStore.isAuditing 
                ? `Active session (${auditLogsStore.getSessionDuration()})` 
                : 'No active session' }}
            </p>
          </div>
          <button
            @click="toggleAuditLogs"
            class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            {{ showAuditLogs ? 'Hide Logs' : 'Show Logs' }}
          </button>
        </div>

        <!-- Audit Logs Table -->
        <div v-if="showAuditLogs" class="mt-4 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left">Time</th>
                <th class="px-4 py-2 text-left">User</th>
                <th class="px-4 py-2 text-left">Action</th>
                <th class="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in auditLogsStore.logs" :key="log.id" 
                  class="border-t dark:border-gray-700">
                <td class="px-4 py-2">{{ new Date(log.timestamp).toLocaleString() }}</td>
                <td class="px-4 py-2">{{ log.userName }}</td>
                <td class="px-4 py-2">{{ log.action }}</td>
                <td class="px-4 py-2">
                  <pre class="text-sm">{{ JSON.stringify(log.details, null, 2) }}</pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template> 