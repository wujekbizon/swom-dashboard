import type { Caregiver, Duty } from '@/types/duty'

const API_URL = 'http://localhost:3000/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const dutyApi = {
  async getAllCaregivers(): Promise<Caregiver[]> {
    try {
      const response = await fetch(`${API_URL}/duties`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch caregivers')
      }
      
      return data.caregivers
    } catch (error) {
      console.error('Error fetching caregivers:', error)
      throw error
    }
  },

  async getCaregiver(id: string): Promise<Caregiver> {
    try {
      const response = await fetch(`${API_URL}/duties/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch caregiver')
      }
      return response.json()
    } catch (error) {
      console.error('Error fetching caregiver:', error)
      throw error
    }
  },

  async saveDuty(caregiverId: string, duty: Duty): Promise<Caregiver> {
    try {
      const response = await fetch(`${API_URL}/duties/${caregiverId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duty }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save duty')
      }
      
      return response.json()
    } catch (error) {
      console.error('Error saving duty:', error)
      throw error
    }
  },

  async deleteDuty(caregiverId: string, date: string): Promise<Caregiver> {
    try {
      const response = await fetch(
        `${API_URL}/duties/${caregiverId}/${date}`,
        {
          method: 'DELETE',
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to delete duty')
      }
      
      return response.json()
    } catch (error) {
      console.error('Error deleting duty:', error)
      throw error
    }
  },
} 