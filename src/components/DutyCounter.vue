<script setup lang="ts">
import type { Duty } from '@/types/duty'
import { computed } from 'vue'

interface Props {
  duties: Duty[]
  maxDuties?: number
  currentDate?: string // Optional - defaults to current month
}

const props = withDefaults(defineProps<Props>(), {
  maxDuties: 12,
  currentDate: () => new Date().toISOString().split('T')[0]
})

const monthlyDutyCount = computed(() => {
  const [year, month] = props.currentDate.split('-')
  return props.duties.filter(duty => {
    const [dutyYear, dutyMonth] = duty.date.split('-')
    return dutyYear === year && dutyMonth === month
  }).length
})

const isMaxReached = computed(() => monthlyDutyCount.value >= props.maxDuties)
</script>

<template>
  <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-600">
        Liczba dyżurów w miesiącu
      </span>
      <div class="flex items-center gap-2">
        <span 
          :class="[
            'text-2xl font-bold',
            isMaxReached ? 'text-red-600' : 'text-blue-600'
          ]"
        >
          {{ monthlyDutyCount }}
        </span>
        <span class="text-sm text-gray-500">
          / {{ maxDuties }}
        </span>
      </div>
    </div>
    <div 
      v-if="isMaxReached"
      class="ml-2 px-2 py-1 bg-red-50 rounded-md"
    >
      <span class="text-xs font-medium text-red-600">
        Osiągnięto limit miesięczny
      </span>
    </div>
  </div>
</template> 