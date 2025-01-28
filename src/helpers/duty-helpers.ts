import type { Duty } from '@/types/duty'

export function validateDutyCount(duties: Duty[], date: string): boolean {
  // Extract year and month from the date string (format: YYYY-MM-DD)
  const [year, month] = date.split('-')
  
  // Count duties for the specific month
  const monthlyDuties = duties.filter(duty => {
    const [dutyYear, dutyMonth] = duty.date.split('-')
    return dutyYear === year && dutyMonth === month
  })

  return monthlyDuties.length < 12
}

export function formatDate(dateStr: string | Date): string {
  if (typeof dateStr === 'string') return dateStr
  return dateStr.toISOString().split('T')[0]
}

export function getDutyTypeLabel(shift: 'day' | 'night'): string {
  return shift === 'day' ? 'Day Shift' : 'Night Shift'
} 