<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard/harmonogram' },
]

const isAuthenticated = ref(false) // This will be handled by auth state later
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center">
            <span class="text-blue-600 dark:text-blue-400 text-xl font-bold">MedCare</span>
          </RouterLink>

          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <RouterLink
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              active-class="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center">
          <template v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/signup"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                     text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     dark:focus:ring-offset-gray-800"
            >
              Sign up
            </RouterLink>
          </template>
          <template v-else>
            <!-- Add authenticated user menu here later -->
          </template>
        </div>
      </div>
    </div>
  </nav>
</template> 