<script setup lang="ts">
import SignupForm from '@/components/auth/SignupForm.vue'
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <SignupForm />

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div class="mt-6">
            <router-link 
              to="/login"
              class="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Sign in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 