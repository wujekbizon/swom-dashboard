import { ref, readonly } from 'vue'
import { authApi, type User } from '@/services/auth'
import { useRouter } from 'vue-router'

const currentUser = ref<User | null>(null)
const isLoading = ref(false)

export function useAuth() {
  const router = useRouter()

  const checkAuth = async () => {
    isLoading.value = true
    try {
      const user = await authApi.getCurrentUser()
      currentUser.value = user
      return user
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const { user } = await authApi.login({ email, password })
      currentUser.value = user
      return user
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    authApi.logout()
    currentUser.value = null
    router.push('/login')
  }

  return {
    user: readonly(currentUser),
    isLoading: readonly(isLoading),
    login,
    logout,
    checkAuth
  }
} 