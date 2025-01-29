<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Caregiver } from '@/types/duty'
import Calendar from '@/components/Calendar.vue'
import DutyCounter from '@/components/DutyCounter.vue'
import Toast from '@/components/ui/Toast.vue'
import { useToast } from '@/composables/useToast'
import { validateDutyCount } from '@/helpers/duty-helpers'
import { dutyApi } from '@/services/api'
import { authApi, type User } from '@/services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentUser = ref<User | null>(null)
const caregivers = ref<Caregiver[]>([])
const currentCaregiver = ref<Caregiver | null>(null)
const isModalOpen = ref(false)
const selectedDate = ref('')
const selectedShift = ref<'day' | 'night'>('day')
const currentViewMonth = ref(new Date().toISOString().split('T')[0])
const isLoading = ref(true)

const { showToast, toastMessage, showMessage } = useToast()
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('success')

// Load user data and duties
onMounted(async () => {
  try {
    const user = await authApi.getCurrentUser()
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    currentUser.value = user
    if (user.role === 'admin') {
      const data = await dutyApi.getAllCaregivers()
      caregivers.value = data
      currentCaregiver.value = data[0]
    } else {
      const data = await dutyApi.getCaregiver(user.id)
      caregivers.value = [data]
      currentCaregiver.value = data
    }
  } catch (error) {
    toastType.value = 'error'
    showMessage('Failed to load data')
  } finally {
    isLoading.value = false
  }
})

async function handleDateClick(date: string) {
  if (!currentCaregiver.value) return

  const existingDuty = currentCaregiver.value.duties.find(d => d.date === date)

  if (!existingDuty) {
    if (!validateDutyCount(currentCaregiver.value.duties, date)) {
      toastType.value = 'error'
      showMessage('Maksymalna liczba dyżurów (12) w tym miesiącu została osiągnięta.')
      return
    }
  }

  selectedDate.value = date
  selectedShift.value = existingDuty?.shift || 'day'
  isModalOpen.value = true
}
function closeModal() {
  isModalOpen.value = false
}

async function handleSaveDuty() {
  if (!currentCaregiver.value) return

  try {
    const duty = {
      id: `${currentCaregiver.value.id}-${selectedDate.value}`,
      date: selectedDate.value,
      shift: selectedShift.value,
      isActive: true,
    }

    const updatedCaregiver = await dutyApi.saveDuty(currentCaregiver.value.id, duty)
    currentCaregiver.value = updatedCaregiver
    
    isModalOpen.value = false
    toastType.value = 'success'
    showMessage('Dyżur został zapisany')
  } catch (error) {
    toastType.value = 'error'
    showMessage('Wystąpił błąd podczas zapisywania dyżuru')
  }
}

async function handleDeleteDuty() {
  if (!currentCaregiver.value) return

  try {
    const updatedCaregiver = await dutyApi.deleteDuty(
      currentCaregiver.value.id,
      selectedDate.value
    )
    currentCaregiver.value = updatedCaregiver
    
    isModalOpen.value = false
    toastType.value = 'warning'
    showMessage('Dyżur został usunięty')
  } catch (error) {
    toastType.value = 'error'
    showMessage('Wystąpił błąd podczas usuwania dyżuru')
  }
}

function handleMonthChange(date: string) {
  currentViewMonth.value = date
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    Loading...
  </div>
  
  <div v-else class="p-4 max-w-6xl mx-auto">
    <!-- Show caregiver selector only for admin -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">Grafik Dyżurów</h1>
      <div class="flex items-center justify-between">
        <select
          v-if="currentUser?.role === 'admin'"
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
          :duties="currentCaregiver?.duties ?? []"
          :current-date="currentViewMonth"
        />
      </div>
    </div>

    <Calendar 
      :duties="currentCaregiver?.duties ?? []"
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

