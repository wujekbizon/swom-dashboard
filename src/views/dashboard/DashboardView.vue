<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SidePanel from '@/components/dashboard/SidePanel.vue'

const isPanelOpen = ref(true)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}
</script>

<template>
  <div class="flex h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
    <SidePanel v-model:isOpen="isPanelOpen" />

    <!-- Main content -->
    <div class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </div>
  </div>
</template> 