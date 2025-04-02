import { z } from 'zod'

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['admin', 'user', 'guest'])
})

export type User = z.infer<typeof userSchema>

// Form validation schema for login
export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export type LoginForm = z.infer<typeof loginSchema> 