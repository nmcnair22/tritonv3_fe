import axios from 'axios'
import type { User } from '../types/schemas'

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// User related API calls
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/users/me')
    return response.data
  },
  
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  }
}

export default apiClient 