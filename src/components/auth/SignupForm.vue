<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const isLoading = ref(false)
const errors = ref<{ 
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
  name?: string[]
  form?: string 
}>({})

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const handleSubmit = async () => {
  try {
    const result = schema.safeParse({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      name: name.value,
    })

    if (!result.success) {
      errors.value = result.error.flatten().fieldErrors
      return
    }

    isLoading.value = true
    errors.value = {}

    await authApi.register({
      email: email.value,
      password: password.value,
      name: name.value,
      role: 'caregiver',
    })

    router.push('/login')
  } catch (error) {
    errors.value.form = error instanceof Error ? error.message : 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div v-if="errors.form" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ errors.form }}</p>
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
      <div class="mt-1">
        <input 
          id="name" 
          v-model="name" 
          type="text"
          class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
        />
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</p>
      </div>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
      <div class="mt-1">
        <input 
          id="email" 
          v-model="email" 
          type="email"
          class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
        />
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email[0] }}</p>
      </div>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <div class="mt-1">
        <input 
          id="password" 
          v-model="password" 
          type="password"
          class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
        />
        <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password[0] }}</p>
      </div>
    </div>

    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
      <div class="mt-1">
        <input 
          id="confirm-password" 
          v-model="confirmPassword" 
          type="password"
          class="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
        />
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword[0] }}</p>
      </div>
    </div>

    <div>
      <button 
        type="submit"
        :disabled="isLoading"
        class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {{ isLoading ? 'Signing up...' : 'Sign up' }}
      </button>
    </div>
  </form>
</template> 