import { ref, computed, watchEffect } from 'vue'
import type { Highlight } from '@/constants/highlights'

export function useHighlightRotation(highlights: Highlight[], options = {
  displayTime: 2000,
  pauseTime: 3000
}) {
  const currentIndex = ref(0)
  const currentHighlight = computed(() => highlights[currentIndex.value])

  // Animation timing control with automatic cleanup
  let timeoutId: number
  watchEffect((onCleanup) => {
    const rotateHighlight = () => {
      timeoutId = setTimeout(() => {
        currentIndex.value = (currentIndex.value + 1) % highlights.length
        if (currentIndex.value === 0) {
          setTimeout(rotateHighlight, options.pauseTime)
        } else {
          rotateHighlight()
        }
      }, options.displayTime)
    }

    rotateHighlight()
    onCleanup(() => clearTimeout(timeoutId))
  })

  return {
    currentHighlight
  }
} 