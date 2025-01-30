<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { patientApi } from '@/services/patientApi'
import type { Patient } from '@/types/patient'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { useHealthChecks } from '@/composables/useHealthChecks'
import Badge from '@/components/ui/Badge.vue'
import { getMedicationColor } from '@/helpers/medicationHelpers'

const route = useRoute()
const patient = ref<Patient | null>(null)
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const patientId = route.params.id as string
    patient.value = await patientApi.getPatient(patientId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load patient'
  } finally {
    isLoading.value = false
  }
})

// Get health checks data
const { healthChecks, lastCheckDate } = useHealthChecks(route.params.id as string)
</script>

<template>
  <div class="p-6">
    <div v-if="isLoading" class="text-center">
      Loading...
    </div>
    
    <div v-else-if="error" class="text-red-600">
      {{ error }}
    </div>

    <div v-else-if="patient" class="space-y-6">
      <!-- Patient Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ patient.firstName }} {{ patient.lastName }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Wiek: {{ patient.age }} | Pokój: {{ patient.room }}
        </p>
      </div>

      <!-- Tabs for different sections -->
      <TabGroup>
        <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab as="div" v-slot="{ selected }">
            <button
              :class="[
                'w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow dark:bg-gray-800 dark:text-white'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              ]"
            >
              Informacje ogólne
            </button>
          </Tab>
          <Tab as="div" v-slot="{ selected }">
            <button
              :class="[
                'w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow dark:bg-gray-800 dark:text-white'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              ]"
            >
              Historia medyczna
            </button>
          </Tab>
        </TabList>

        <TabPanels class="mt-4">
          <TabPanel class="bg-white dark:bg-gray-800 rounded-lg p-6">
            <!-- General Information Panel -->
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Dane podstawowe
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Imię i nazwisko</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ patient.firstName }} {{ patient.lastName }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Wiek</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ patient.age }} lat
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Numer pokoju</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ patient.room }}
                      </p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Status ubezpieczenia</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ patient.hasInsurance ? 'Ubezpieczony' : 'Brak ubezpieczenia' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Ostatni pomiar</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ lastCheckDate }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Liczba pomiarów</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ healthChecks.length }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Health Checks -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Ostatnie pomiary
                </h3>
                <div v-if="healthChecks.length === 0" class="text-gray-500 dark:text-gray-400">
                  Brak pomiarów
                </div>
                <div v-else class="space-y-4">
                  <div 
                    v-for="check in healthChecks.slice(0, 3)" 
                    :key="check.date"
                    class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Data</p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ new Date(check.date).toLocaleString() }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Ciśnienie</p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ check.bloodPressure.systolic }}/{{ check.bloodPressure.diastolic }}
                        </p>
                      </div>
                      <!-- ... other health check parameters ... -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel class="bg-white dark:bg-gray-800 rounded-lg p-6">
            <!-- Medical History Panel -->
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Choroby przewlekłe
                </h3>
                <div v-if="patient.medicalHistory.conditions.length === 0" 
                     class="text-gray-500 dark:text-gray-400">
                  Brak chorób przewlekłych
                </div>
                <ul v-else class="list-disc list-inside space-y-2">
                  <li v-for="condition in patient.medicalHistory.conditions" 
                      :key="condition"
                      class="text-gray-900 dark:text-white">
                    {{ condition }}
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Alergie
                </h3>
                <div v-if="patient.medicalHistory.allergies.length === 0" 
                     class="text-gray-500 dark:text-gray-400">
                  Brak alergii
                </div>
                <ul v-else class="list-disc list-inside space-y-2">
                  <li v-for="allergy in patient.medicalHistory.allergies" 
                      :key="allergy"
                      class="text-gray-900 dark:text-white">
                    {{ allergy }}
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Leki
                </h3>
                <div v-if="patient.medicalHistory.medications.length === 0" 
                     class="text-gray-500 dark:text-gray-400">
                  Brak leków
                </div>
                <div v-else class="space-y-4">
                  <div 
                    v-for="medication in patient.medicalHistory.medications" 
                    :key="medication.name"
                    class="flex items-center gap-2"
                  >
                    <Badge
                      :color="getMedicationColor(medication)"
                    >
                      {{ medication.name }}
                    </Badge>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ medication.dosage }} - {{ medication.frequency }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Zabiegi
                </h3>
                <div v-if="patient.medicalHistory.surgeries.length === 0" 
                     class="text-gray-500 dark:text-gray-400">
                  Brak zabiegów
                </div>
                <div v-else class="space-y-4">
                  <div 
                    v-for="surgery in patient.medicalHistory.surgeries" 
                    :key="surgery.date"
                    class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ surgery.procedure }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ new Date(surgery.date).toLocaleDateString() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template> 