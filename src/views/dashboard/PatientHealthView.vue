<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { patientApi } from '@/services/patientApi'
import type { Patient, HealthCheck } from '@/types/patient'
import { useAuditLog } from '@/composables/useAuditLog'
import { TrashIcon, PencilIcon } from '@heroicons/vue/24/outline'
import HealthCheckForm from '@/components/health-checks/HealthCheckForm.vue'
import BackButton from '@/components/ui/BackButton.vue'

const route = useRoute()
const patient = ref<Patient | null>(null)
const healthChecks = ref<HealthCheck[]>([])
const isLoading = ref(true)
const isLoadingHealthChecks = ref(false)
const error = ref('')
const editingHealthCheck = ref<{ index: number; check: HealthCheck } | null>(null)
const isAddingHealthCheck = ref(false)
const { logAction } = useAuditLog()

// Load both patient and health checks data
onMounted(async () => {
  try {
    const patientId = route.params.id as string
    // Load data in parallel
    const [patientData, healthChecksData] = await Promise.all([
      patientApi.getPatient(patientId),
      patientApi.getHealthChecks(patientId)
    ])
    
    patient.value = patientData
    healthChecks.value = healthChecksData.healthChecks
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    isLoading.value = false
  }
})

async function addHealthCheck(healthCheck: HealthCheck) {
  if (!patient.value) return

  try {
    await patientApi.addHealthCheck(patient.value.id, healthCheck)
    // Refresh only health checks
    const data = await patientApi.getHealthChecks(patient.value.id)
    healthChecks.value = data.healthChecks
    isAddingHealthCheck.value = false

    // Log the action
    logAction('UPDATE_PATIENT', {
      action: 'add_health_check',
      patientId: patient.value.id,
      patientName: `${patient.value.firstName} ${patient.value.lastName}`,
      healthCheck: {
        date: healthCheck.date,
        bloodPressure: healthCheck.bloodPressure,
        heartRate: healthCheck.heartRate,
        // ... other vital signs
      }
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to add health check'
  }
}

async function handleDeleteHealthCheck(date: string) {
  if (!patient.value) return
  
  try {
    if (!confirm('Czy na pewno chcesz usunąć ten pomiar?')) return

    isLoadingHealthChecks.value = true
    await patientApi.deleteHealthCheck(patient.value.id, date)
    // Refresh health checks
    const data = await patientApi.getHealthChecks(patient.value.id)
    healthChecks.value = data.healthChecks

    // Log the deletion
    logAction('UPDATE_PATIENT', {
      action: 'delete_health_check',
      patientId: patient.value.id,
      patientName: `${patient.value.firstName} ${patient.value.lastName}`,
      deletedCheckDate: date
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete health check'
  } finally {
    isLoadingHealthChecks.value = false
  }
}

async function handleEditHealthCheck(index: number, check: HealthCheck) {
  editingHealthCheck.value = {
    index,
    check: { ...check }
  }
}

async function saveEditedHealthCheck(updatedCheck: HealthCheck) {
  if (!patient.value || !editingHealthCheck.value) return

  try {
    // Keep the original date when updating
    const checkToUpdate = {
      ...updatedCheck,
      date: editingHealthCheck.value.check.date // Keep original date
    }

    await patientApi.updateHealthCheck(
      patient.value.id,
      checkToUpdate.date,
      checkToUpdate
    )
    
    // Refresh health checks
    const data = await patientApi.getHealthChecks(patient.value.id)
    healthChecks.value = data.healthChecks
    
    // Log the update
    logAction('UPDATE_PATIENT', {
      action: 'edit_health_check',
      patientId: patient.value.id,
      patientName: `${patient.value.firstName} ${patient.value.lastName}`,
      checkDate: checkToUpdate.date,
      updatedData: checkToUpdate
    })
    
    editingHealthCheck.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update health check'
  }
}
</script>

<template>
  <div class="p-6">
    <!-- Add back button at the top -->
    <div class="mb-6">
      <BackButton />
    </div>

    <div v-if="isLoading" class="text-center">
      Loading...
    </div>
    
    <div v-else-if="error" class="text-red-600">
      {{ error }}
    </div>

    <div v-else-if="patient" class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Parametry zdrowotne
          </h1>
          <p class="text-gray-500 dark:text-gray-400">
            {{ patient.firstName }} {{ patient.lastName }}
          </p>
        </div>
        <button
          @click="isAddingHealthCheck = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Dodaj pomiar
        </button>
      </div>

      <!-- Add Health Check Modal -->
      <div
        v-if="isAddingHealthCheck"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
          <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            Dodaj nowy pomiar
          </h3>
          
          <HealthCheckForm
            mode="add"
            @submit="addHealthCheck"
            @cancel="isAddingHealthCheck = false"
          />
        </div>
      </div>

      <!-- Health Checks List -->
      <div v-if="isLoadingHealthChecks" class="text-center py-4">
        Loading health checks...
      </div>

      <div v-else-if="healthChecks.length === 0" class="text-center py-4 text-gray-500">
        Brak pomiarów
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(check, index) in healthChecks"
          :key="check.date"
          class="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group"
        >
          <!-- Action buttons -->
          <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="handleEditHealthCheck(index, check)"
              class="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Edytuj"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click="handleDeleteHealthCheck(check.date)"
              class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title="Usuń"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Health Check Data -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Data</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ new Date(check.date).toLocaleString() }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Ciśnienie</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ check.bloodPressure.systolic }}/{{ check.bloodPressure.diastolic }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Tętno</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ check.heartRate }} bpm
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Saturacja</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ check.oxygenSaturation }}%
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Temperatura</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ check.temperature }}°C
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Cukier</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ check.bloodSugar }} mg/dL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Edit Health Check Modal -->
    <div
      v-if="editingHealthCheck"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">
          Edytuj pomiar
        </h3>
        
        <HealthCheckForm
          mode="edit"
          :initial-data="editingHealthCheck.check"
          @submit="saveEditedHealthCheck"
          @cancel="editingHealthCheck = null"
        />
      </div>
    </div>
  </div>
</template> 