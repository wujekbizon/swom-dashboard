import type { AuditLog } from '@/types/audit-logs'

const API_URL = 'http://localhost:3000/api'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
  const response = await fetch(`${API_URL}/audit-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  })
  
  const data: ApiResponse<AuditLog> = await response.json()
  if (!data.success) throw new Error(data.error || 'Failed to create audit log')
  return data.data
}

export async function getAuditLogs() {
  const response = await fetch(`${API_URL}/audit-logs`)
  const data: ApiResponse<AuditLog[]> = await response.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch audit logs')
  return data.data
} 