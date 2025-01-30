<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { patientApi } from '@/services/patientApi'
import type { Patient, HealthCheck } from '@/types/patient'
import AddPatientForm from '@/components/patients/AddPatientForm.vue'
import PatientCard from '@/components/patients/PatientCard.vue'

const patients = ref<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const isAddingHealthCheck = ref(false)
const showDetailedView = ref(false)
const isLoading = ref(true)
const error = ref('')

const healthChecks = ref<HealthCheck[]>([])
const isLoadingHealthChecks = ref(false)

const editingHealthCheck = ref<{ index: number; check: HealthCheck } | null>(null)

const isAddingPatient = ref(false)

// Load patients on mount
onMounted(async () => {
  try {
    const data = await patientApi.getAllPatients()
    patients.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load patients'
  } finally {
    isLoading.value = false
  }
})

async function loadHealthChecks(patientId: string) {
  isLoadingHealthChecks.value = true
  try {
    const data = await patientApi.getHealthChecks(patientId)
    healthChecks.value = data.healthChecks
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load health checks'
  } finally {
    isLoadingHealthChecks.value = false
  }
}

async function selectPatient(patient: Patient, showDetails = false) {
  try {
    const fullPatient = await patientApi.getPatient(patient.id)
    selectedPatient.value = fullPatient
    showDetailedView.value = showDetails
    
    // Load health checks only when not showing details
    if (!showDetails) {
      await loadHealthChecks(patient.id)
    }
    isAddingHealthCheck.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load patient details'
  }
}

async function addHealthCheck() {
  if (!selectedPatient.value) return

  try {
    const newCheck: HealthCheck = {
      date: new Date().toISOString(),
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      bloodSugar: 100,
      heartRate: 70,
      oxygenSaturation: 98,
      temperature: 36.6
    }

    await patientApi.addHealthCheck(selectedPatient.value.id, newCheck)
    // Refresh health checks after adding new one
    await loadHealthChecks(selectedPatient.value.id)
    isAddingHealthCheck.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to add health check'
  }
}

async function handleDeleteHealthCheck(date: string) {
  if (!selectedPatient.value) return
  
  try {
    if (!confirm('Czy na pewno chcesz usunąć ten pomiar?')) return

    isLoadingHealthChecks.value = true
    await patientApi.deleteHealthCheck(selectedPatient.value.id, date)
    
    // Refresh the health checks list
    await loadHealthChecks(selectedPatient.value.id)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete health check'
  } finally {
    isLoadingHealthChecks.value = false
  }
}

async function handleEditHealthCheck(index: number, check: HealthCheck) {
  editingHealthCheck.value = {
    index,
    check: { ...check } // Create a copy to avoid direct mutation
  }
}

async function saveEditedHealthCheck() {
  if (!selectedPatient.value || !editingHealthCheck.value) return

  try {
    await patientApi.updateHealthCheck(
      selectedPatient.value.id,
      editingHealthCheck.value.check.date,
      editingHealthCheck.value.check
    )
    await loadHealthChecks(selectedPatient.value.id)
    editingHealthCheck.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update health check'
  }
}

async function handleAddPatient(patient: Omit<Patient, 'id'>) {
  try {
    await patientApi.createPatient(patient)
    const data = await patientApi.getAllPatients()
    patients.value = data
    isAddingPatient.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to add patient'
  }
}

async function handleDeletePatient(id: string) {
  if (!confirm('Czy na pewno chcesz usunąć tego pacjenta?')) return

  try {
    await patientApi.deletePatient(id)
    // Refresh patients list
    const data = await patientApi.getAllPatients()
    patients.value = data
    // Clear selection if deleted patient was selected
    if (selectedPatient.value?.id === id) {
      selectedPatient.value = null
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete patient'
  }
}
</script>

<template>
  <div class="p-6">
    <!-- Header with Add Patient button -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Pacjenci
      </h1>
      <button
        @click="isAddingPatient = true"
        class="inline-flex items-center px-4 py-2 border border-transparent 
               text-sm font-medium rounded-md text-white bg-blue-600 
               hover:bg-blue-700"
      >
        Dodaj Pacjenta
      </button>
    </div>

    <!-- Patient Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PatientCard
        v-for="patient in patients"
        :key="patient.id"
        :patient="patient"
      />
    </div>

    <!-- Add Patient Modal -->
    <div v-if="isAddingPatient">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
          <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            Dodaj nowego pacjenta
          </h3>
          
          <AddPatientForm
            @submit="handleAddPatient"
            @cancel="isAddingPatient = false"
          />
        </div>
      </div>
    </div>
  </div>
</template> 