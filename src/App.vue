<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAuditLogsStore } from '@/stores/auditLogs'
import DefaultLayout from './layouts/DefaultLayout.vue'
import Toast from './components/ui/Toast.vue'
import { useToast } from '@/composables/useToast'

const { user } = useAuth()
const auditLogsStore = useAuditLogsStore()
const { showToast, toastMessage, showMessage } = useToast()


onMounted(async () => {
  // Check if user is authenticated
  const currentUser = await user.value
  if (currentUser) {
    auditLogsStore.initializeSession()
    showMessage('System auditing has started')
  }
})
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
  <Toast
    :show="showToast"
    :message="toastMessage"
    type="info"
    @close="showToast = false"
  />
</template>
