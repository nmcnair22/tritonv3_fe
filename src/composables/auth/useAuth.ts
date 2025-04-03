import { ref, computed } from 'vue'
import axios from 'axios'
import apiClient from '../../services/api'

// Define basic types
export interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

// Helper to safely access localStorage
function safeStorage(key: string, value?: string): string | null {
  try {
    if (value === undefined) {
      return localStorage.getItem(key);
    } else {
      localStorage.setItem(key, value);
      return value;
    }
  } catch (e) {
    console.error(`[Auth] Error accessing localStorage for key "${key}":`, e);
    return null;
  }
}

// Clear localStorage safely
function safeClearStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`[Auth] Error removing key "${key}" from localStorage:`, e);
  }
}

export function useAuth() {
  const currentUser = ref<User | null>(null)
  const token = ref<string>(safeStorage('auth_token') || '');
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)

  // Login user with Laravel token auth
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    
    console.log(`[Auth] Attempting login for user: ${email}`)
    
    try {
      // Use the dedicated API token endpoint
      console.log(`[Auth] Sending login request to /api/api-login`);
      const response = await apiClient.post('/api/api-login', { 
        email, 
        password 
      });
      
      console.log(`[Auth] Login response:`, response);
      
      // Extract token from response (should be directly in response.data.token)
      const extractedToken = response.data.token;
      
      if (!extractedToken) {
        console.error('[Auth] No token found in response');
        error.value = 'Authentication successful but no token received';
        isLoading.value = false;
        return false;
      }
      
      // Set token
      token.value = extractedToken;
      
      // Set user info
      if (response.data.user) {
        currentUser.value = response.data.user;
      }
      
      // Save token to storage
      safeStorage('auth_token', token.value);
      
      console.log(`[Auth] Login successful`);
      console.log(`[Auth] Token received and stored`);
      
      // Set axios default auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      
      isLoading.value = false;
      return true;
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      
      if (err.response) {
        console.error('[Auth] Response status:', err.response.status);
        console.error('[Auth] Response data:', err.response.data);
        error.value = err.response.data?.message || 'Authentication failed';
      } else {
        error.value = err.message || 'Network error during authentication';
      }
      
      isLoading.value = false;
      return false;
    }
  }

  // Logout user
  async function logout() {
    isLoading.value = true
    
    try {
      if (token.value) {
        // Use token-based logout
        await apiClient.post('/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });
        console.log('[Auth] Logout API call successful');
      }
    } catch (err: any) {
      console.error('Logout error:', err)
      // Continue with logout even if API fails
    } finally {
      // Always clean up local state, even if API call fails
      currentUser.value = null
      token.value = '';
      safeClearStorage('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      isLoading.value = false
    }
  }

  // Check if user is authenticated
  async function checkAuth() {
    // Get token from localStorage
    const storedToken = safeStorage('auth_token');
    
    // If no token in storage, return null immediately
    if (!storedToken) {
      return null;
    }
    
    // Update token.value from localStorage
    token.value = storedToken;
    
    // Update the token in axios headers
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }
    
    // Now try to validate token with backend
    isLoading.value = true;
    error.value = null;
    
    try {
      // Use token-based auth to get user data
      const response = await apiClient.get('/api/user', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });
      
      currentUser.value = response.data;
      return currentUser.value;
    } catch (err: any) {
      // Clear auth state on error
      if (err.response?.status === 401) {
        currentUser.value = null;
        token.value = '';
        safeClearStorage('auth_token');
        delete axios.defaults.headers.common['Authorization'];
      }
      
      error.value = 'Authentication failed';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Set token directly
  function setToken(newToken: string) {
    token.value = newToken
    if (newToken) {
      safeStorage('auth_token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      safeClearStorage('auth_token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // Initialize auth header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    setToken
  }
} 