<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon, 
  CogIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'
import { useAuth } from '@/composables/useAuth'

interface NavItem {
  name: string
  path: string
  icon: any
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const router = useRouter()
const { user } = useAuth()

const navigation: NavItem[] = [
  { name: 'Harmonogram', path: '/dashboard/harmonogram', icon: CalendarIcon },
  { name: 'Pacjenci Info', path: '/dashboard/patients', icon: UserIcon },
  { name: 'Grafik Dyżurów', path: '/dashboard/grafik', icon: ClockIcon },
  { name: 'Opcje', path: '/dashboard/opcje', icon: CogIcon },
]

const togglePanel = () => {
  emit('update:isOpen', !props.isOpen)
}

const handleNavClick = (path: string) => {
  router.push(path)
  // Only close panel on mobile screens
  if (window.innerWidth < 768) {
    emit('update:isOpen', false)
  }
}

const panelClasses = computed(() => [
  'relative h-[calc(100vh-64px)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out overflow-hidden',
  props.isOpen ? 'w-64' : 'w-16'
])

const contentClasses = computed(() => [
  'h-full transition-all duration-300 ease-in-out',
  props.isOpen ? 'w-64' : 'w-16'
])

const menuButtonClasses = computed(() => [
  'p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700',
  props.isOpen 
    ? 'w-8 h-8 flex items-center justify-center' 
    : 'w-full flex justify-center'
])
</script>

<template>
  <div>
    <!-- Mobile toggle button - only show when panel is closed on mobile -->
    <button
      v-if="!isOpen"
      @click="togglePanel"
      class="md:hidden fixed top-20 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
      aria-label="Open sidebar"
    >
      <Bars3Icon class="h-6 w-6 text-gray-600 dark:text-gray-300" />
    </button>

    <!-- Sidebar -->
    <div :class="panelClasses">
      <div :class="contentClasses">
        <!-- Toggle button -->
        <div class="p-4 flex justify-end">
          <button
            @click="togglePanel"
            :class="menuButtonClasses"
            :title="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
          >
            <Bars3Icon 
              class="h-6 w-6 text-gray-500" 
              :class="{ 'transform transition-transform': true, 'rotate-90': !isOpen }"
            />
          </button>
        </div>

        <!-- User info - only show when expanded -->
        <div v-if="isOpen" class="px-4 mb-6">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon class="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ user?.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ user?.role }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="px-4 space-y-1">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.path"
            @click.prevent="handleNavClick(item.path)"
            :class="[
              router.currentRoute.value.path === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50',
              'group flex items-center rounded-md',
              isOpen ? 'px-3 py-2' : 'justify-center p-2'
            ]"
            :title="!isOpen ? item.name : undefined"
          >
            <component
              :is="item.icon"
              :class="[
                router.currentRoute.value.path === item.path
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-500',
                'flex-shrink-0 h-6 w-6',
                isOpen ? 'mr-3' : ''
              ]"
            />
            <span v-if="isOpen" class="text-sm font-medium">
              {{ item.name }}
            </span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="isOpen"
      class="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
      @click="togglePanel"
    />
  </div>
</template> 