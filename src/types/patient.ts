export interface HealthCheck {
    date: string
    bloodPressure: {
      systolic: number
      diastolic: number
    }
    bloodSugar: number
    heartRate: number
    oxygenSaturation: number
    temperature: number
}
  
interface Surgery {
    date: string
    procedure: string
}

export interface Medication {
    name: string
    dosage: string
    frequency: string
}

export interface Patient {
    id: string
    firstName: string
    lastName: string
    age: number
    hasInsurance: boolean
    room: string
    medicalHistory: {
      conditions: string[]
      allergies: string[]
      surgeries: Surgery[]
      medications: Medication[]
    }
    healthParameters: {
      history: HealthCheck[]
      lastCheck: string
    }
}