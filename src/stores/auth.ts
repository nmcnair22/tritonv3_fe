import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Mock API call - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would get these from the API
      const mockUser = { id: 1, email, name: 'Test User', role: 'user' }
      const mockToken = 'mock-jwt-token'
      
      setUser(mockUser as User)
      setToken(mockToken)
      
      return true
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'Invalid email or password'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const checkAuth = async (): Promise<User | null> => {
    if (!token.value) return null
    
    isLoading.value = true
    
    try {
      // Mock API call - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, you would verify the token and get user data
      const mockUser = { id: 1, email: 'user@example.com', name: 'Test User', role: 'user' }
      
      setUser(mockUser as User)
      return user.value
    } catch (err) {
      console.error('Auth check error:', err)
      logout()
      error.value = 'Authentication failed'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    setUser,
    setToken
  }
}) 