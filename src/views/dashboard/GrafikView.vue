<script setup lang="ts">
import { ref } from 'vue'
import mockData from '@/data/mock-duties.json'
import type { Caregiver } from '@/types/duty'
import Calendar from '@/components/Calendar.vue'
import DutyCounter from '@/components/DutyCounter.vue'
import Toast from '@/components/ui/Toast.vue'
import { useToast } from '@/composables/useToast'
import { validateDutyCount } from '@/helpers/duty-helpers'

const caregivers = ref<Caregiver[]>(mockData.caregivers as Caregiver[])
const currentCaregiver = ref<Caregiver>(caregivers.value[0])
const isModalOpen = ref(false)
const selectedDate = ref('')
const selectedShift = ref<'day' | 'night'>('day')
const currentViewMonth = ref(new Date().toISOString().split('T')[0])

// Initialize toast
const { showToast, toastMessage, showMessage } = useToast()
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('success')

function handleDateClick(date: string) {
  const existingDuty = currentCaregiver.value.duties.find(d => d.date === date)
  
  // Better logging to debug the values
  console.log('HandleDateClick:', {
    date,
    existingDuty: existingDuty || 'No duty found',
    currentDuties: currentCaregiver.value.duties
  })

  if (!existingDuty) {
    if (!validateDutyCount(currentCaregiver.value.duties, date)) {
      toastType.value = 'error'
      showMessage('Maksymalna liczba dyżurów (12) w tym miesiącu została osiągnięta.')
      return
    }
  }

  // If we get here, either there's an existing duty to edit
  // or we can add a new one
  selectedDate.value = date
  selectedShift.value = existingDuty?.shift || 'day'
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleSaveDuty() {
  const existingDutyIndex = currentCaregiver.value.duties.findIndex(
    d => d.date === selectedDate.value
  )

  if (existingDutyIndex !== -1) {
    currentCaregiver.value.duties[existingDutyIndex].shift = selectedShift.value
  } else {
    currentCaregiver.value.duties.push({
      id: `${currentCaregiver.value.id}-${selectedDate.value}`,
      date: selectedDate.value,
      shift: selectedShift.value,
      isActive: true,
    })
  }

  isModalOpen.value = false
  toastType.value = 'success'
  showMessage('Dyżur został zapisany')
}

function handleDeleteDuty() {
  const dutyIndex = currentCaregiver.value.duties.findIndex(
    d => d.date === selectedDate.value
  )

  if (dutyIndex !== -1) {
    currentCaregiver.value.duties.splice(dutyIndex, 1)
    toastType.value = 'warning'
    showMessage('Dyżur został usunięty')
  }

  isModalOpen.value = false
}

function handleMonthChange(date: string) {
  currentViewMonth.value = date
}

</script>

<template>
  <div class="p-4 max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">Grafik Dyżurów</h1>
      <div class="flex items-center justify-between">
        <select
          v-model="currentCaregiver"
          class="w-64 h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option
            v-for="caregiver in caregivers"
            :key="caregiver.id"
            :value="caregiver"
          >
            {{ caregiver.name }}
          </option>
        </select>
        
        <DutyCounter 
          :duties="currentCaregiver.duties"
          :current-date="currentViewMonth"
        />
      </div>
    </div>

    <Calendar 
      :duties="currentCaregiver.duties"
      :onDateClick="handleDateClick"
      :onMonthChange="handleMonthChange"
    />

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Zarządzaj dyżurem
          </h3>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Data</label>
            <div class="mt-1 text-gray-900">{{ selectedDate }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Zmiana</label>
            <select
              v-model="selectedShift"
              class="w-full mt-1 h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="day">Dzienny</option>
              <option value="night">Nocny</option>
            </select>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            @click="handleDeleteDuty"
          >
            Usuń dyżur
          </button>
          <div class="space-x-2">
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              @click="closeModal"
            >
              Anuluj
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              @click="handleSaveDuty"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
    <Toast
      :show="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
  </div>
</template>

