// User related types
export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user' | 'guest'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Menu related types
export interface MenuItem {
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  visible?: boolean
}

// Theme related types
export interface ThemeSettings {
  darkMode: boolean
  primaryColor: string
}

// API related types
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
  message?: string
}

// Notification types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
} 