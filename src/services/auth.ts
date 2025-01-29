interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: 'caregiver' | 'admin'
}

export interface User {
  id: string
  email: string
  name: string
  role: 'caregiver' | 'admin'
}

const API_URL = 'http://localhost:3000/api'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Login failed')
    
    localStorage.setItem('token', data.token)
    return data
  },

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const userData = await response.json()
    if (!response.ok) throw new Error(userData.error || 'Registration failed')
    
    localStorage.setItem('token', userData.token)
    return userData
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token')
    if (!token) return null

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) {
      localStorage.removeItem('token')
      return null
    }
    
    const data = await response.json()
    return data.user
  },

  logout() {
    localStorage.removeItem('token')
  }
} 