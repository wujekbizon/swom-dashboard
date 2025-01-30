<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { patientApi } from '@/services/patientApi'
import type { Patient } from '@/types/patient'
import AddPatientForm from '@/components/patients/AddPatientForm.vue'
import PatientCard from '@/components/patients/PatientCard.vue'

const patients = ref<Patient[]>([])
const isLoading = ref(true)
const error = ref('')
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
</script>

<template>
  <div class="p-6">
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PatientCard
        v-for="patient in patients"
        :key="patient.id"
        :patient="patient"
      />
    </div>
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