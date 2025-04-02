<template>
  <div class="login-page">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="login-header">
            <img src="@/assets/images/logo.png" alt="Triton Logo" class="login-logo" />
            <h2 class="login-title">Login to Triton V3</h2>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="p-field">
              <label for="email" class="form-label">Email</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-envelope" />
                <InputText 
                  id="email" 
                  v-model="form.email" 
                  type="email"
                  class="w-full" 
                  :class="{ 'p-invalid': errors.email }" 
                  placeholder="Enter your email"
                  aria-describedby="email-error" 
                />
              </span>
              <small id="email-error" class="p-error">{{ errors.email }}</small>
            </div>
            
            <div class="p-field">
              <label for="password" class="form-label">Password</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-lock" />
                <Password 
                  id="password" 
                  v-model="form.password" 
                  class="w-full"
                  :class="{ 'p-invalid': errors.password }" 
                  placeholder="Enter your password"
                  aria-describedby="password-error" 
                  :feedback="false"
                  toggleMask
                />
              </span>
              <small id="password-error" class="p-error">{{ errors.password }}</small>
            </div>
            
            <div class="p-field-checkbox">
              <Checkbox id="remember" v-model="rememberMe" :binary="true" />
              <label for="remember" class="ml-2">Remember me</label>
            </div>
            
            <div class="p-field">
              <Button 
                type="submit" 
                label="Login" 
                icon="pi pi-sign-in" 
                class="w-full" 
                :loading="isLoading" 
              />
            </div>
            
            <div v-if="error" class="p-field">
              <Message severity="error" :closable="false">{{ error }}</Message>
            </div>
            
            <div class="login-links">
              <a href="#" class="forgot-password">Forgot Password?</a>
              <a href="#" class="create-account">Create Account</a>
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { z } from 'zod'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, error } = authStore

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginForm = z.infer<typeof loginSchema>

const form = reactive<LoginForm>({
  email: '',
  password: ''
})

const errors = reactive<Record<string, string>>({
  email: '',
  password: ''
})

const rememberMe = ref(false)

async function handleSubmit() {
  // Clear previous errors
  errors.email = ''
  errors.password = ''
  
  // Validate form with Zod
  const result = loginSchema.safeParse(form)
  
  if (!result.success) {
    // Map Zod errors to form fields
    const formattedErrors = result.error.format()
    if (formattedErrors.email?._errors) {
      errors.email = formattedErrors.email._errors[0]
    }
    if (formattedErrors.password?._errors) {
      errors.password = formattedErrors.password._errors[0]
    }
    return
  }
  
  // Submit valid form
  const loginSuccess = await authStore.login(form.email, form.password)
  if (loginSuccess) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--p-surface-50);
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: 2rem 1rem;
}

.login-card {
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.login-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.login-form {
  padding: 1rem 0;
}

.p-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.w-full {
  width: 100%;
}

.ml-2 {
  margin-left: 0.5rem;
}

.p-field-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.forgot-password,
.create-account {
  color: var(--p-primary-500);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password:hover,
.create-account:hover {
  color: var(--p-primary-700);
  text-decoration: underline;
}
</style> 