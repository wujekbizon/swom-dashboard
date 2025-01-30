<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Patient } from '@/types/patient'
import { useHealthChecks } from '@/composables/useHealthChecks'

const props = defineProps<{
  patient: Patient
}>()

const router = useRouter()

// Use the health checks composable
const { lastCheckDate, measurementsCount } = useHealthChecks(props.patient.id)

function navigateToPatient() {
  router.push(`/dashboard/patients/${props.patient.id}`)
}

function handleHealthParamsClick(e: Event) {
  e.stopPropagation() // Prevent navigation when clicking health params
  router.push(`/dashboard/patients/${props.patient.id}/parametry`)
}
</script>

<template>
  <div
    @click="navigateToPatient"
    class="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
           transition-shadow duration-200 cursor-pointer overflow-hidden"
  >
    <div
      v-if="patient.hasInsurance"
      class="absolute top-0 right-0 bg-gradient-to-l from-zinc-300 to-zinc-700 
             text-white text-xs px-3 py-1 rounded-bl-lg"
    >
      Ubezpieczony
    </div>

    <div class="p-6">
      <!-- Patient Basic Info -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ patient.firstName }} {{ patient.lastName }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Wiek: {{ patient.age }} | Pokój: {{ patient.room }}
          </p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400">Ostatni pomiar</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ lastCheckDate }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400">Liczba pomiarów</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ measurementsCount }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-4">
        <button
          @click="handleHealthParamsClick"
          class="flex-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 
                 text-blue-700 dark:text-blue-300 rounded-md 
                 hover:bg-blue-200 dark:hover:bg-blue-800
                 transition-colors duration-200"
        >
          Parametry zdrowotne
        </button>
      </div>
    </div>
  </div>
</template> 