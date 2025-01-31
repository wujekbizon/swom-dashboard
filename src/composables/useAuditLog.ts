import { useAuditLogsStore } from '@/stores/auditLogs'
import type { AuditAction } from '@/types/audit-logs'

export function useAuditLog() {
  const auditLogsStore = useAuditLogsStore()

  return {
    logAction: auditLogsStore.logAction,
    fetchLogs: auditLogsStore.fetchLogs
  }
} 