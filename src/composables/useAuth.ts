import { ref, computed } from 'vue'
import { useLocalStorage, useEventListener } from '@vueuse/core'
import { userApi } from '../services/api'
import type { User } from '../types/schemas'

export function useAuth() {
  const currentUser = ref<User | null>(null)
  const token = useLocalStorage('auth_token', '')
  const isAuthenticated = computed(() => !!token.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Check if user is logged in
  async function checkAuth() {
    if (!token.value) return null
    
    isLoading.value = true
    error.value = null
    
    try {
      currentUser.value = await userApi.getCurrentUser()
      return currentUser.value
    } catch (err) {
      error.value = 'Failed to authenticate'
      token.value = ''
      currentUser.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Login user
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await userApi.login(email, password)
      token.value = response.token
      currentUser.value = response.user
      return true
    } catch (err) {
      error.value = 'Invalid email or password'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout user
  async function logout() {
    isLoading.value = true
    
    try {
      await userApi.logout()
    } catch (err) {
      // Continue with logout even if API fails
    } finally {
      token.value = ''
      currentUser.value = null
      isLoading.value = false
    }
  }

  // Listen for storage events for multi-tab sync
  useEventListener(window, 'storage', (event) => {
    if (event.key === 'auth_token') {
      if (!event.newValue) {
        currentUser.value = null
      } else if (event.newValue !== token.value) {
        checkAuth()
      }
    }
  })

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  }
} 