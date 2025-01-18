export interface Highlight {
  text: string
  color: string
}

export const HERO_HIGHLIGHTS: Highlight[] = [
  { text: 'Patient Care', color: 'text-blue-500' },
  { text: 'Efficiency', color: 'text-emerald-500' },
  { text: 'Compliance', color: 'text-indigo-500' },
  { text: 'Security', color: 'text-purple-500' },
] as const 