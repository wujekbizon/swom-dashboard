<script setup lang="ts">
import TheNavigation from '../components/layout/TheNavigation.vue'

</script>

<template>
  <main class="bg-gray-50">
    <TheNavigation />
    <div class="pt-16">
      <slot />
    </div>
  </main>
</template> 