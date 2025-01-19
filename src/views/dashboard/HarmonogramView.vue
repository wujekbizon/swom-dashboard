<script setup lang="ts">
import { ref } from 'vue'
import { ElCalendar } from 'element-plus'

const events = ref([
  {
    id: 1,
    name: 'Konsultacja',
    time: '09:00 - 10:00',
    patient: 'Anna Nowak',
    type: 'Kontrola'
  },
  // Add more events as needed
])
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white shadow-sm rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Harmonogram Wizyt</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Today's Schedule -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">Dzisiejsze Wizyty</h3>
          <div class="space-y-3">
            <div
              v-for="event in events"
              :key="event.id"
              class="bg-gray-50 p-4 rounded-md"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-900">{{ event.name }}</p>
                  <p class="text-sm text-gray-500">{{ event.patient }}</p>
                </div>
                <div class="text-sm text-gray-500">
                  {{ event.time }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar -->
        <div class="bg-white rounded-lg">
          <ElCalendar />
        </div>
      </div>
    </div>
  </div>
</template> 