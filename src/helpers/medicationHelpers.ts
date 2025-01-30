import type { Medication } from '@/types/patient'

type ColorVariant = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'

interface MedicationCategory {
  keywords: string[]
  color: ColorVariant
}

const MEDICATION_CATEGORIES: MedicationCategory[] = [
  {
    keywords: ['antybiotyk'],
    color: 'red'
  },
  {
    keywords: ['przeciwbólowy', 'przeciw bólowy'],
    color: 'yellow'
  },
  {
    keywords: ['witamina'],
    color: 'green'
  },
  {
    keywords: ['insulina'],
    color: 'blue'
  },
  {
    keywords: ['steryd'],
    color: 'purple'
  }
]

export function getMedicationColor(medication: Medication): ColorVariant {
  const medicationLower = medication.name.toLowerCase()
  
  const category = MEDICATION_CATEGORIES.find(category => 
    category.keywords.some(keyword => medicationLower.includes(keyword))
  )
  
  return category?.color ?? 'gray'
} 