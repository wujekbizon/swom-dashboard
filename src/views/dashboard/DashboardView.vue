<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon, 
  CogIcon 
} from '@heroicons/vue/24/outline'

interface NavItem {
  name: string
  path: string
  icon: any
}

const navigation = ref<NavItem[]>([
  { name: 'Harmonogram', path: '/dashboard/harmonogram', icon: CalendarIcon },
  { name: 'Pacjenci Info', path: '/dashboard/patients', icon: UserIcon },
  { name: 'Grafik Dyżurów', path: '/dashboard/grafik', icon: ClockIcon },
  { name: 'Opcje', path: '/dashboard/opcje', icon: CogIcon },
])

const router = useRouter()
const currentUser = ref({
  name: 'Greg Wolfigner',
  role: 'Opiekun Medyczny',
  department: 'Geriatria',
  imageUrl: '/placeholder-avatar.jpg'
})
</script>
<template>
  <div class="flex h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div class="p-4">
        <div class="flex items-center space-x-3 mb-6">
          <img
            :src="currentUser.imageUrl"
            alt="Profile"
            class="h-12 w-12 rounded-full"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ currentUser.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentUser.role }}</p>
          </div>
        </div>
        
        <nav class="space-y-1">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.path"
            @click.prevent="router.push(item.path)"
            :class="[
              router.currentRoute.value.path === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                router.currentRoute.value.path === item.path
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-500',
                'mr-3 flex-shrink-0 h-6 w-6'
              ]"
            />
            {{ item.name }}
          </a>
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </div>
  </div>
</template> 