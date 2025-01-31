<script setup lang="ts">
import { ref, watch } from 'vue'
import type { HealthCheck } from '@/types/patient'

const props = defineProps<{
  mode?: 'add' | 'edit'
  initialData?: HealthCheck
}>()

const emit = defineEmits<{
  (e: 'submit', healthCheck: HealthCheck): void
  (e: 'cancel'): void
}>()

const form = ref<HealthCheck>({
  date: new Date().toISOString(),
  bloodPressure: {
    systolic: props.initialData?.bloodPressure.systolic ?? 120,
    diastolic: props.initialData?.bloodPressure.diastolic ?? 80
  },
  bloodSugar: props.initialData?.bloodSugar ?? 100,
  heartRate: props.initialData?.heartRate ?? 70,
  oxygenSaturation: props.initialData?.oxygenSaturation ?? 98,
  temperature: props.initialData?.temperature ?? 36.6
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = { ...newData }
  }
}, { deep: true })

function handleSubmit() {
  emit('submit', form.value)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm text-gray-500 dark:text-gray-400">
        Ciśnienie (sys/dia)
      </label>
      <div class="flex gap-2">
        <input
          v-model="form.bloodPressure.systolic"
          type="number"
          class="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          v-model="form.bloodPressure.diastolic"
          type="number"
          class="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
      </div>
    </div>
    <div>
      <label class="block text-sm text-gray-500 dark:text-gray-400">Tętno</label>
      <input
        v-model="form.heartRate"
        type="number"
        class="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
      />
    </div>
    <div>
      <label class="block text-sm text-gray-500 dark:text-gray-400">
        Saturacja (%)
      </label>
      <input
        v-model="form.oxygenSaturation"
        type="number"
        class="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
      />
    </div>
    <div>
      <label class="block text-sm text-gray-500 dark:text-gray-400">
        Temperatura (°C)
      </label>
      <input
        v-model="form.temperature"
        type="number"
        step="0.1"
        class="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
      />
    </div>
    <div>
      <label class="block text-sm text-gray-500 dark:text-gray-400">
        Cukier we krwi
      </label>
      <input
        v-model="form.bloodSugar"
        type="number"
        class="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
      />
    </div>
  </div>

  <div class="mt-4 flex justify-end gap-2">
    <button
      type="button"
      @click="emit('cancel')"
      class="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      Anuluj
    </button>
    <button
      type="button"
      @click="handleSubmit"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      {{ mode === 'edit' ? 'Zapisz' : 'Dodaj' }}
    </button>
  </div>
</template> 