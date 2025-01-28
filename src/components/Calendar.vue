<script setup lang="ts">
import { WEEK } from '@/constants/days'
import { ref, computed, onMounted } from 'vue'

// Define types for calendar day structure
interface CalendarDay {
  day: number       
  date: string        
  duty?: {            
    shift: 'day' | 'night'
    id: string
    isActive: boolean
  }
}

// Define component props with TypeScript interface
interface Props {
  duties?: Array<{    
    date: string
    shift: 'day' | 'night'
    id: string
    isActive: boolean
  }>
  onDateClick?: (date: string) => void
  onMonthChange?: (date: string) => void  // New prop for month changes
}

// Set default values for props using withDefaults
const props = withDefaults(defineProps<Props>(), {
  duties: () => [],         
  onDateClick: undefined,       
  onMonthChange: undefined
})

// Initialize calendar state with current date
const currentDate = new Date()
const currentMonth = ref(currentDate.getMonth())    
const currentYear = ref(currentDate.getFullYear())  

// Compute the number of days in the current month
const daysInMonth = computed(() => {
  // Create date for last day of current month (day 0 of next month)
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Compute the first day of the month (0 = Sunday, 1 = Monday, etc.)
// Adjust for Monday as first day of week
const firstDayOfMonth = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  // Convert Sunday (0) to 6 for end of week, shift other days back by 1
  return firstDay === 0 ? 6 : firstDay - 1
})

// Get localized month name in Polish
const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value)
    .toLocaleString('pl-PL', { month: 'long' })
})

// Generate calendar days array with duties
const calendarDays = computed(() => {
  const days: (CalendarDay | null)[] = []
  const totalDays = daysInMonth.value
  const firstDay = firstDayOfMonth.value

  // Fill in empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Generate array of days with their duties
  for (let day = 1; day <= totalDays; day++) {
    const formattedMonth = String(currentMonth.value + 1).padStart(2, '0')
    const formattedDay = String(day).padStart(2, '0')
    const date = `${currentYear.value}-${formattedMonth}-${formattedDay}`
    
    const duty = props.duties.find(d => d.date === date)
    if (duty) {
      console.log('Found duty for date:', {
        date,
        shift: duty.shift
      })
    }

    days.push({
      day,
      date,
      duty
    })
  }

  return days
})

// Handle month navigation
function handlePrevMonth() {
  if (currentMonth.value === 0) {
    // If January, go to December of previous year
    currentMonth.value = 11
    currentYear.value--
  } else {
    // Otherwise, just decrease month
    currentMonth.value--
  }
  emitCurrentMonth()
}

function handleNextMonth() {
  if (currentMonth.value === 11) {
    // If December, go to January of next year
    currentMonth.value = 0
    currentYear.value++
  } else {
    // Otherwise, just increase month
    currentMonth.value++
  }
  emitCurrentMonth()
}

// Helper function to emit current month
function emitCurrentMonth() {
  if (props.onMonthChange) {
    const month = String(currentMonth.value + 1).padStart(2, '0')
    const date = `${currentYear.value}-${month}-01`
    props.onMonthChange(date)
  }
}

// Emit initial month on mount
onMounted(() => {
  emitCurrentMonth()
})

// Emit date click event to parent component
function handleDateClick(date: string) {
  if (props.onDateClick) {
    props.onDateClick(date)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Calendar Header with month navigation -->
    <div class="flex items-center justify-between mb-6">
      <button
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        @click="handlePrevMonth"
      >
        ←
      </button>
      <h2 class="text-lg font-semibold">
        {{ monthName }} {{ currentYear }}
      </h2>
      <button
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        @click="handleNextMonth"
      >
        →
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-2">
      <!-- Weekday headers -->
      <div
        v-for="day in WEEK"
        :key="day"
        class="text-center text-sm font-medium text-gray-500 pb-4"
      >
        {{ day }}
      </div>

      <!-- Calendar days -->
      <template v-for="(day, index) in calendarDays" :key="index">
        <!-- Empty cell for days before month starts -->
        <div
          v-if="day === null"
          class="h-28 bg-gray-50 rounded-lg"
        />
        <!-- Day cell with potential duty -->
        <div
          v-else
          class="h-28 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          @click="handleDateClick(day.date)"
        >
          <!-- Day number -->
          <p :class="[
            'text-sm',
            day.duty ? 'font-bold' : 'font-normal',
            'text-gray-900'
          ]">
            {{ day.day }}
          </p>
          <!-- Duty indicator if duty exists -->
          <div
            v-if="day.duty"
            :class="[
              'mt-2 text-xs px-2 py-1 rounded-full w-fit',
              day.duty.shift === 'day'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-indigo-100 text-indigo-800'
            ]"
          >
            {{ day.duty.shift === 'day' ? 'Dzienny' : 'Nocny' }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template> 