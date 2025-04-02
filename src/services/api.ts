import axios from 'axios'
import type { User } from '../types/schemas'

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})

// Log config for debugging
console.log('[API] API client initialized with:');
console.log('[API] BaseURL:', apiClient.defaults.baseURL);

// Request interceptor for adding auth token
apiClient.interceptors.request.use(config => {
  console.log("[API DEBUG] Beginning request interceptor in src/services/api.ts");
  
  const token = localStorage.getItem('auth_token');
  console.log("[API DEBUG] Token exists in localStorage:", !!token);
  
  if (token) {
    console.log("[API DEBUG] Setting Authorization header with token");
    console.log("[API DEBUG] Token first 10 chars:", token.substring(0, 10) + "...");
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("[API DEBUG] No token found in localStorage, request will be unauthorized");
  }
  
  console.log("[API DEBUG] Final request headers:", config.headers);
  console.log("[API DEBUG] Request URL:", config.url);
  console.log("[API DEBUG] Request method:", config.method);
  
  return config;
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // If error is an unauthorized error (401), log for debugging
    if (error.response && error.response.status === 401) {
      console.error('[API] Authentication error (401) on path:', originalRequest.url);
    }
    
    return Promise.reject(error);
  }
);

// User related API calls
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/user')
    return response.data
  },
  
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/api-login', { email, password })
    return response.data
  },
  
  logout: async () => {
    const response = await apiClient.post('/api/logout')
    return response.data
  }
}

export default apiClient 