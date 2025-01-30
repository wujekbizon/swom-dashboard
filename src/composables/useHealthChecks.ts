import { ref, computed } from 'vue'
import { patientApi } from '@/services/patientApi'
import type { HealthCheck } from '@/types/patient'

export function useHealthChecks(patientId: string) {
  const healthChecks = ref<HealthCheck[]>([])
  const isLoading = ref(true)
  const error = ref('')

  const lastCheckDate = computed(() => {
    if (healthChecks.value.length === 0) return 'Brak pomiarów'
    
    const lastCheck = healthChecks.value[healthChecks.value.length - 1]
    return new Date(lastCheck.date).toLocaleDateString('pl-PL')
  })

  const measurementsCount = computed(() => healthChecks.value.length)

  async function loadHealthChecks() {
    try {
      const data = await patientApi.getHealthChecks(patientId)
      healthChecks.value = data.healthChecks
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load health checks'
    } finally {
      isLoading.value = false
    }
  }

  // Load health checks when composable is created
  loadHealthChecks()

  return {
    healthChecks,
    isLoading,
    error,
    lastCheckDate,
    measurementsCount,
    loadHealthChecks
  }
} 