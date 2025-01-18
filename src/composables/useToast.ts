import { ref } from 'vue'

export function useToast(duration = 2000) {
  const showToast = ref(false)
  const toastMessage = ref('')

  const showMessage = (message: string) => {
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, duration)
  }

  return {
    showToast,
    toastMessage,
    showMessage
  }
} 