<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login to Triton V3</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="email">Email</label>
          <InputText 
            id="email" 
            v-model="form.email" 
            :class="{ 'p-invalid': errors.email }" 
            aria-describedby="email-error" 
          />
          <small id="email-error" class="p-error">{{ errors.email }}</small>
        </div>
        
        <div class="form-field">
          <label for="password">Password</label>
          <Password 
            id="password" 
            v-model="form.password" 
            :class="{ 'p-invalid': errors.password }" 
            aria-describedby="password-error" 
            toggleMask 
            :feedback="false"
          />
          <small id="password-error" class="p-error">{{ errors.password }}</small>
        </div>
        
        <div class="form-actions">
          <Button 
            type="submit" 
            label="Login" 
            :loading="isLoading" 
            class="p-button-primary" 
          />
        </div>
        
        <div v-if="authError" class="auth-error">
          {{ authError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginSchema, type LoginForm } from '../types/schemas'
import { useAuth } from '../composables/useAuth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const { login, error: authError, isLoading } = useAuth()

const form = reactive<LoginForm>({
  email: '',
  password: ''
})

const errors = reactive<Record<string, string>>({
  email: '',
  password: ''
})

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
  const loginSuccess = await login(form.email, form.password)
  if (loginSuccess) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-field :deep(.p-inputtext),
.form-field :deep(.p-password) {
  width: 100%;
}

.form-actions {
  margin-top: 2rem;
}

.auth-error {
  margin-top: 1rem;
  color: var(--red-600);
  text-align: center;
}
</style> 