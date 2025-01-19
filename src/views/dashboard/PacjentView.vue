<script setup lang="ts">
import { ref, computed } from 'vue'
import patientData from '@/data/pacjent.json'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

interface HealthCheck {
  date: string
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  bloodSugar: number
  heartRate: number
  oxygenSaturation: number
  temperature: number
}

interface Patient {
  id: string
  firstName: string
  lastName: string
  age: number
  hasInsurance: boolean
  room: string
  medicalHistory: {
    conditions: string[]
    allergies: string[]
    surgeries: Array<{
      date: string
      procedure: string
    }>
    medications: Array<{
      name: string
      dosage: string
      frequency: string
    }>
  }
  healthParameters: {
    history: HealthCheck[]
    lastCheck: string
  }
}

const patients = ref<Patient[]>(patientData.patients)
const selectedPatient = ref<Patient | null>(null)
const isAddingHealthCheck = ref(false)
const showDetailedView = ref(false)

const newHealthCheck = ref<HealthCheck>({
  date: new Date().toISOString().split('T')[0],
  bloodPressure: {
    systolic: 120,
    diastolic: 80
  },
  bloodSugar: 100,
  heartRate: 70,
  oxygenSaturation: 98,
  temperature: 36.6
})

function selectPatient(patient: Patient) {
  selectedPatient.value = patient
  isAddingHealthCheck.value = false
  showDetailedView.value = false
}

function addHealthCheck() {
  if (!selectedPatient.value) return

  selectedPatient.value.healthParameters.history.unshift({
    ...newHealthCheck.value,
    date: new Date().toISOString()
  })
  selectedPatient.value.healthParameters.lastCheck = new Date().toISOString()
  isAddingHealthCheck.value = false
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Patient List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pacjenci</h2>
      <div class="space-y-2">
        <div
          v-for="patient in patients"
          :key="patient.id"
          class="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="selectedPatient?.id === patient.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''"
        >
          <div class="flex justify-between items-start">
            <button
              @click="selectPatient(patient)"
              class="text-left"
            >
              <div class="font-medium text-gray-900 dark:text-white">
                {{ patient.firstName }} {{ patient.lastName }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Pokój: {{ patient.room }}
              </div>
            </button>
            <button
              @click="selectPatient(patient); showDetailedView = true"
              class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              Szczegóły
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Details -->
    <div v-if="selectedPatient" class="md:col-span-2 space-y-6">
      <div v-if="showDetailedView">
        <!-- Detailed View -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <TabGroup>
            <TabList class="flex space-x-1 p-4 border-b dark:border-gray-700">
              <Tab v-slot="{ selected }" as="template">
                <button
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    selected
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  ]"
                >
                  Informacje podstawowe
                </button>
              </Tab>
              <Tab v-slot="{ selected }" as="template">
                <button
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    selected
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  ]"
                >
                  Historia medyczna
                </button>
              </Tab>
              <Tab v-slot="{ selected }" as="template">
                <button
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    selected
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  ]"
                >
                  Leki
                </button>
              </Tab>
            </TabList>

            <TabPanels class="p-4">
              <!-- Basic Info Panel -->
              <TabPanel>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Imię i nazwisko</div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ selectedPatient.firstName }} {{ selectedPatient.lastName }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Wiek</div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ selectedPatient.age }} lat
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Ubezpieczenie</div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ selectedPatient.hasInsurance ? 'Tak' : 'Nie' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Pokój</div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ selectedPatient.room }}
                    </div>
                  </div>
                </div>
              </TabPanel>

              <!-- Medical History Panel -->
              <TabPanel>
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Schorzenia</h3>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="condition in selectedPatient.medicalHistory.conditions"
                        :key="condition"
                        class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {{ condition }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Alergie</h3>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="allergy in selectedPatient.medicalHistory.allergies"
                        :key="allergy"
                        class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm"
                      >
                        {{ allergy }}
                      </span>
                      <span v-if="!selectedPatient.medicalHistory.allergies.length" class="text-gray-500 dark:text-gray-400">
                        Brak znanych alergii
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Zabiegi</h3>
                    <div class="space-y-2">
                      <div
                        v-for="surgery in selectedPatient.medicalHistory.surgeries"
                        :key="surgery.date"
                        class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div class="font-medium text-gray-900 dark:text-white">
                          {{ surgery.procedure }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ new Date(surgery.date).toLocaleDateString() }}
                        </div>
                      </div>
                      <div v-if="!selectedPatient.medicalHistory.surgeries.length" class="text-gray-500 dark:text-gray-400">
                        Brak historii zabiegów
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <!-- Medications Panel -->
              <TabPanel>
                <div class="space-y-4">
                  <div
                    v-for="medication in selectedPatient.medicalHistory.medications"
                    :key="medication.name"
                    class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ medication.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      Dawka: {{ medication.dosage }} | {{ medication.frequency }}
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>

      <!-- Health Parameters -->
      <div v-if="!showDetailedView" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Parametry zdrowotne
          </h2>
          <button
            @click="isAddingHealthCheck = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Dodaj pomiar
          </button>
        </div>

        <div v-if="isAddingHealthCheck" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500 dark:text-gray-400">Ciśnienie (sys/dia)</label>
              <div class="flex gap-2">
                <input
                  v-model="newHealthCheck.bloodPressure.systolic"
                  type="number"
                  class="w-20 px-2 py-1 border rounded"
                />
                <input
                  v-model="newHealthCheck.bloodPressure.diastolic"
                  type="number"
                  class="w-20 px-2 py-1 border rounded"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-500 dark:text-gray-400">Tętno</label>
              <input
                v-model="newHealthCheck.heartRate"
                type="number"
                class="w-20 px-2 py-1 border rounded"
              />
            </div>
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button
              @click="isAddingHealthCheck = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Anuluj
            </button>
            <button
              @click="addHealthCheck"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Zapisz
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(check, index) in selectedPatient.healthParameters.history"
            :key="index"
            class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {{ new Date(check.date).toLocaleString() }}
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Patient Selected State -->
    <div
      v-else
      class="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-center"
    >
      <p class="text-gray-500 dark:text-gray-400">
        Wybierz pacjenta z listy aby zobaczyć szczegóły
      </p>
    </div>
  </div>
</template> 