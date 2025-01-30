<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { Patient } from '@/types/patient'

// Define type-safe events that this component can emit
// This is similar to prop types but for events
// The emit function will be type-checked based on these definitions
const emit = defineEmits<{
  // Event 'submit' will emit patient data without the 'id' field
  // Omit<Patient, 'id'> is a TypeScript utility type that creates a new type
  // from Patient but without the 'id' property
  (e: 'submit', patient: Omit<Patient, 'id'>): void
  // Event 'cancel' doesn't emit any data, just signals the cancellation
  (e: 'cancel'): void
}>()

// Track form validation errors
// Key is the field name, value is array of error messages
const formErrors = ref<{ [key: string]: string[] }>({})

// Define validation schema using Zod
// This creates a type-safe runtime validation schema
const patientSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  age: z.number().min(0, 'Wiek nie może być ujemny').max(150, 'Wiek jest nieprawidłowy'),
  room: z.string().min(1, 'Numer pokoju jest wymagany'),
  hasInsurance: z.boolean()
})

// Form state with default values
// This matches the Patient type structure but without id
const form = ref({
  firstName: '',
  lastName: '',
  age: '',
  room: '',
  hasInsurance: false,
  medicalHistory: {
    conditions: [],
    allergies: [],
    surgeries: [],
    medications: []
  },
  healthParameters: {
    history: [],
    lastCheck: ''
  }
})

const errors = ref({
  firstName: '',
  lastName: '',
  age: '',
  room: ''
})

// Validation rules
const ageValidation = computed(() => {
  if (!form.value.age) return 'Wiek jest wymagany'
  const age = Number(form.value.age)
  if (isNaN(age)) return 'Wiek musi być liczbą'
  if (!Number.isInteger(age)) return 'Wiek musi być liczbą całkowitą'
  if (age < 0) return 'Wiek nie może być ujemny'
  if (age > 150) return 'Wprowadź prawidłowy wiek'
  return ''
})

function validateForm() {
  let isValid = true
  
  // Reset errors
  errors.value = {
    firstName: '',
    lastName: '',
    age: '',
    room: ''
  }

  // Validate required fields
  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'Imię jest wymagane'
    isValid = false
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Nazwisko jest wymagane'
    isValid = false
  }

  // Age validation
  const ageError = ageValidation.value
  if (ageError) {
    errors.value.age = ageError
    isValid = false
  }

  if (!form.value.room.trim()) {
    errors.value.room = 'Numer pokoju jest wymagany'
    isValid = false
  }

  return isValid
}

// Form submission handler
function handleSubmit() {
  if (!validateForm()) return

  // If validation passes, emit the form data to parent component
  // Parent component can listen for this event using @submit
  // Example: <AddPatientForm @submit="handleAddPatient" />
  emit('submit', {
    ...form.value,
    age: Number(form.value.age), // Convert age to number
    hasInsurance: form.value.hasInsurance, // This is already included via spread operator
    medicalHistory: {
      conditions: [],
      allergies: [],
      surgeries: [],
      medications: []
    },
    healthParameters: {
      history: [],
      lastCheck: ''
    }
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Imię
      </label>
      <input
        v-model="form.firstName"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        :class="{ 'border-red-500': errors.firstName }"
      />
      <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
        {{ errors.firstName }}
      </p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Nazwisko
      </label>
      <input
        v-model="form.lastName"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        :class="{ 'border-red-500': errors.lastName }"
      />
      <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
        {{ errors.lastName }}
      </p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Wiek
      </label>
      <input
        v-model="form.age"
        type="number"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        :class="{ 'border-red-500': errors.age }"
      />
      <p v-if="errors.age" class="mt-1 text-sm text-red-600">
        {{ errors.age }}
      </p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Pokój
      </label>
      <input
        v-model="form.room"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        :class="{ 'border-red-500': errors.room }"
      />
      <p v-if="errors.room" class="mt-1 text-sm text-red-600">
        {{ errors.room }}
      </p>
    </div>
    
    <div class="flex items-center">
      <input
        v-model="form.hasInsurance"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
        Ubezpieczenie
      </label>
    </div>

    <div class="flex justify-end gap-2">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        Anuluj
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
      >
        Dodaj
      </button>
    </div>
  </form>
</template> 