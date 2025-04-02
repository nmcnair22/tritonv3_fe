import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { User } from '../types'
import apiClient from '../services/api'

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
      // Also set the axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('auth_token')
      // Remove auth header when token is cleared
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Use the real API login endpoint
      const response = await apiClient.post('/api/api-login', { email, password })
      
      // Extract token and user data from response
      const responseToken = response.data.token
      const responseUser = response.data.user
      
      if (!responseToken) {
        throw new Error('No token received from server')
      }
      
      // Set user and token
      setUser(responseUser as User)
      setToken(responseToken)
      
      console.log('[Auth Store] Login successful')
      console.log('[Auth Store] Token received:', responseToken.substring(0, 10) + '...')
      console.log('[Auth Store] User data:', responseUser)
      
      return true
    } catch (err: any) {
      console.error('[Auth Store] Login error:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else {
        error.value = err.message || 'Invalid email or password'
      }
      
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      // Only call logout API if we have a token
      if (token.value) {
        // Call the API logout endpoint
        await apiClient.post('/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
        console.log('[Auth Store] Logout API call successful')
      }
    } catch (err) {
      console.error('[Auth Store] Logout API error:', err)
      // Continue with logout even if API call fails
    } finally {
      // Always clear state
      setUser(null)
      setToken(null)
      isLoading.value = false
    }
  }

  const checkAuth = async (): Promise<User | null> => {
    if (!token.value) return null
    
    isLoading.value = true
    
    try {
      // Use the API to verify token and get user data
      const response = await apiClient.get('/api/user', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      
      const userData = response.data
      setUser(userData as User)
      
      return user.value
    } catch (err) {
      console.error('[Auth Store] Auth check error:', err)
      logout()
      error.value = 'Authentication failed'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Initialize axios auth header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
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