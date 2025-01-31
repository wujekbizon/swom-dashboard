<script setup lang="ts">
import { useAuditLog } from '@/composables/useAuditLog'
import { useAuditLogsStore } from '@/stores/auditLogs'
import { onMounted } from 'vue'

const auditLogsStore = useAuditLogsStore()

onMounted(() => {
  auditLogsStore.fetchLogs()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Audit Logs</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="px-4 py-2">Timestamp</th>
            <th class="px-4 py-2">User</th>
            <th class="px-4 py-2">Action</th>
            <th class="px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in auditLogsStore.logs" :key="log.id">
            <td class="border px-4 py-2">{{ new Date(log.timestamp).toLocaleString() }}</td>
            <td class="border px-4 py-2">{{ log.userName }}</td>
            <td class="border px-4 py-2">{{ log.action }}</td>
            <td class="border px-4 py-2">
              <pre>{{ JSON.stringify(log.details, null, 2) }}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> 