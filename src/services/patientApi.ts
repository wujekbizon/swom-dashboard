import type { Patient, HealthCheck } from '@/types/patient'

const API_URL = 'http://localhost:3000/api'

export const patientApi = {
  async getAllPatients(): Promise<Patient[]> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch patients')
      }
      
      return data.patients
    } catch (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
  },

  async getPatient(id: string): Promise<Patient> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch patient')
      }
      
      return data.patient
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw error
    }
  },

  async deletePatient(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete patient')
      }
    } catch (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  },

  async getHealthChecks(patientId: string): Promise<{
    healthChecks: HealthCheck[]
    lastCheck: string
    total: number
  }> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/health-checks/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch health checks')
      }
      
      return {
        healthChecks: data.healthChecks,
        lastCheck: data.lastCheck,
        total: data.total
      }
    } catch (error) {
      console.error('Error fetching health checks:', error)
      throw error
    }
  },

  async addHealthCheck(patientId: string, check: HealthCheck): Promise<HealthCheck> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/health-checks/${patientId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId,
          check: {
            ...check,
            date: new Date().toISOString()
          }
        })
      })
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to add health check')
      }
      
      return data.healthCheck
    } catch (error) {
      console.error('Error adding health check:', error)
      throw error
    }
  },

  async deleteHealthCheck(patientId: string, date: string): Promise<void> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/health-checks/${patientId}/${date}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete health check')
      }
    } catch (error) {
      console.error('Error deleting health check:', error)
      throw error
    }
  },

  async updateHealthCheck(
    patientId: string, 
    date: string, 
    updates: Partial<HealthCheck>
  ): Promise<HealthCheck> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/health-checks/${patientId}/${date}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId,
          updates: {
            ...updates,
            date: date
          }
        })
      })
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to update health check')
      }
      
      return data.healthCheck
    } catch (error) {
      console.error('Error updating health check:', error)
      throw error
    }
  },

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
      })
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to create patient')
      }
      
      return data.patient
    } catch (error) {
      console.error('Error creating patient:', error)
      throw error
    }
  }
} 