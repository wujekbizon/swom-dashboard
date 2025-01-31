import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import type { AuditLog, AuditAction } from '@/types/audit-logs'
import { createAuditLog, getAuditLogs } from '@/services/auditLogService'

export const useAuditLogsStore = defineStore('auditLogs', () => {
  const logs = ref<AuditLog[]>([])
  const isAuditing = ref(false)
  const sessionStartTime = ref<string | null>(null)
  const { user } = useAuth()
  
  // Initialize session from storage if user is logged in
  function initializeSession() {
    if (user.value && !isAuditing.value) {
      startAuditing(true) // true indicates it's a restored session
    }
  }
  
  function startAuditing(isRestoredSession = false) {
    isAuditing.value = true
    if (!isRestoredSession) {
      sessionStartTime.value = new Date().toISOString()
      logAction('LOGIN', { sessionStartTime: sessionStartTime.value })
    }
  }

  function stopAuditing() {
    if (isAuditing.value) {
      logAction('LOGOUT', { 
        sessionStartTime: sessionStartTime.value,
        sessionDuration: getSessionDuration()
      })
      isAuditing.value = false
      sessionStartTime.value = null
    }
  }

  function getSessionDuration(): string {
    if (!sessionStartTime.value) return '0'
    const start = new Date(sessionStartTime.value).getTime()
    const now = new Date().getTime()
    const durationMs = now - start
    const minutes = Math.floor(durationMs / 60000)
    return `${minutes} minutes`
  }

  async function logAction(action: AuditAction, details: Record<string, any> = {}) {
    if (!isAuditing.value && action !== 'LOGIN') return

    try {
      const logData = {
        userId: user.value?.id ?? 'unknown',
        userName: user.value?.name ?? 'unknown',
        action,
        details,
        ipAddress: window.location.hostname
      }
      
      const newLog = await createAuditLog(logData)
      logs.value.push(newLog)
    } catch (error) {
      console.error('Failed to create audit log:', error)
    }
  }

  async function fetchLogs() {
    try {
      logs.value = await getAuditLogs()
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    }
  }

  return {
    logs,
    isAuditing,
    sessionStartTime,
    startAuditing,
    stopAuditing,
    logAction,
    fetchLogs,
    getSessionDuration,
    initializeSession
  }
}, {
  persistedState: {
    key: 'audit-logs',
    includePaths: ['logs', 'isAuditing', 'sessionStartTime'],
    storage: localStorage,
    beforeHydrate: (oldState) => {
      console.log('Hydrating audit logs state:', oldState)
    }
  }
}) 