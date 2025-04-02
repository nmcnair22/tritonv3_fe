import axios from 'axios'
import type { User } from '../types/schemas'

// API debugging flag
const API_DEBUG = true;

// Create axios instance with base URL from environment
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

console.log('[API] API client initialized with:');
console.log('[API] BaseURL:', apiClient.defaults.baseURL);
console.log('[API] Timeout:', apiClient.defaults.timeout);

// Helper for API debugging logs
const logApi = (message: string, data?: any) => {
  if (API_DEBUG) {
    console.log(`[API DEBUG] ${message}`, data || '');
  }
};

// Request interceptor for adding auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // Only log token for non-user endpoints to reduce noise
    if (config.url && !config.url.includes('/api/user')) {
      logApi('Using auth token', `${token.substring(0, 10)}...`);
    }
  } else {
    logApi('No auth token found');
  }

  // More detailed logging - only for non-user endpoints
  const fullUrl = `${config.baseURL}${config.url || ''}`;
  
  if (config.url && !config.url.includes('/api/user')) {
    logApi(`${config.method?.toUpperCase()} ${config.url}`, { 
      params: config.params,
      headers: config.headers,
      baseURL: config.baseURL,
      fullUrl: fullUrl
    });
    
    console.log(`[API FULL REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`, {
      headers: config.headers,
      params: config.params
    });
  }
  
  return config;
})

// Response interceptor for logging responses
apiClient.interceptors.response.use(
  response => {
    // Only log non-user endpoint responses
    const url = response.config?.url || '';
    if (!url.includes('/api/user')) {
      logApi(`Response from ${url}`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    }
    return response;
  },
  error => {
    // Always log errors for any endpoint
    const status = error.response ? error.response.status : 'No response';
    
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timed out after', apiClient.defaults.timeout, 'ms');
      logApi(`Timeout error: ${error.config?.url || 'unknown URL'}`, error.message);
    } else if (error.code === 'ERR_NETWORK') {
      console.error('[API] Network error - check if server is running');
      logApi(`Network error: ${error.config?.url || 'unknown URL'}`, error.message);
    } else {
      logApi(`Error: ${status} from ${error.config?.url || 'unknown URL'}`, error.message);
    }
    
    // Enhanced error logging with request details
    console.error('[API ERROR] Details:', {
      code: error.code,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Handle unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request detected. Token may be invalid or expired.');
    }
    
    return Promise.reject(error);
  }
);

// User related API calls
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    logApi('Getting current user');
    const response = await apiClient.get('/api/user')
    return response.data
  },
  
  login: async (email: string, password: string) => {
    logApi('Login attempt', { email });
    const response = await apiClient.post('/api/api-login', { email, password })
    return response.data
  },
  
  logout: async () => {
    logApi('Logging out');
    const response = await apiClient.post('/api/logout')
    return response.data
  }
}

// Export a function to check API connection
export const checkApiConnection = async () => {
  try {
    logApi('Checking API connection');
    const response = await apiClient.get('/api/health')
    return {
      success: true,
      status: response.status,
      message: 'API connection successful'
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status,
      message: error.message
    }
  }
}

export default apiClient 