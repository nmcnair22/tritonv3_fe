<template>
  <div class="login-container">
    <!-- Left side - Background image with content -->
    <div class="left-panel" :style="{ backgroundImage: 'url(/images/backgrounds/login-bg.jpeg)' }">
      <div class="left-content">
        <!-- Logo -->
        <div class="logo">
          <img src="/images/logos/logo-cis-dark.png" alt="Company Logo" />
        </div>
        
        <!-- Welcome text -->
        <h1>Welcome</h1>
        <p>Your complete solution for managing projects, teams, and resources in one place. Start your journey to better productivity today.</p>
        
        <!-- Features -->
        <div class="features">
          <div class="feature">
            <div class="feature-icon">
              <i class="pi pi-briefcase"></i>
            </div>
            <div class="feature-content">
              <h3>Project Management</h3>
              <p>Create, assign, and track projects with ease. Monitor progress in real-time with intuitive dashboards.</p>
            </div>
          </div>
          
          <div class="feature">
            <div class="feature-icon">
              <i class="pi pi-shield"></i>
            </div>
            <div class="feature-content">
              <h3>Advanced Security</h3>
              <p>Enterprise-grade security ensures your data remains protected. Role-based access controls for team management.</p>
            </div>
          </div>
          
          <div class="feature">
            <div class="feature-icon">
              <i class="pi pi-chart-bar"></i>
            </div>
            <div class="feature-content">
              <h3>Analytics & Reporting</h3>
              <p>Make data-driven decisions with comprehensive analytics and customizable reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right side - Login form -->
    <div class="right-panel">
      <div class="form-container">
        <h2>Login</h2>
        
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-container">
            <i class="pi pi-envelope"></i>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              placeholder="Enter your email" 
              :class="{ 'error': emailError }"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-container">
            <i class="pi pi-lock"></i>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              placeholder="Enter your password" 
              :class="{ 'error': passwordError }"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="togglePasswordVisibility"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>
        
        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">Remember me</label>
          </div>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>
        
        <button 
          type="button" 
          class="login-button" 
          @click="handleLogin"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Login</span>
          <i v-else class="pi pi-spin pi-spinner"></i>
        </button>
        
        <div class="divider">
          <span>OR</span>
        </div>
        
        <button type="button" class="google-button">
          <i class="pi pi-google"></i>
          <span>Sign In with Google</span>
        </button>
        
        <button type="button" class="github-button">
          <i class="pi pi-github"></i>
          <span>Sign In with GitHub</span>
        </button>
        
        <div class="signup-text">
          Don't have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const emailError = ref(false);
const passwordError = ref(false);

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  
  // Toggle input type
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.type = showPassword.value ? 'text' : 'password';
  }
};

// Login handler
const handleLogin = async () => {
  // Reset errors
  emailError.value = false;
  passwordError.value = false;
  
  // Validate
  if (!email.value) {
    emailError.value = true;
    return;
  }
  
  if (!password.value) {
    passwordError.value = true;
    return;
  }
  
  isLoading.value = true;
  
  // Simulate authentication
  setTimeout(() => {
    isLoading.value = false;
    
    // Navigate to dashboard on success
    router.push('/dashboard');
  }, 1000);
};
</script>

<style scoped>
/* Main container */
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Left panel with background image */
.left-panel {
  width: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

/* Semi-transparent overlay for better text readability */
.left-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.left-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 540px;
  margin: 0 auto;
}

.logo {
  margin-bottom: 2rem;
}

.logo img {
  height: 45px;
  width: auto;
}

h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: white;
}

.left-content p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: white;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background-color: #FFB400;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon i {
  color: #0B2244;
  font-size: 1.25rem;
}

.feature-content h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  color: white;
}

.feature-content p {
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
  color: white;
  opacity: 0.9;
}

/* Right panel with login form */
.right-panel {
  width: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 75%;
  max-width: 400px;
}

h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #0B2244;
  margin: 0 0 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #0B2244;
}

.input-container {
  position: relative;
}

.input-container i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
}

.input-container input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-container input:focus {
  outline: none;
  border-color: #0B2244;
}

.input-container input.error {
  border-color: #D32F2F;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.forgot-password {
  color: #297FB7;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #0B2244;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.login-button:hover {
  background-color: #071a36;
}

.login-button:disabled {
  background-color: #6c7583;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #9E9E9E;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #E0E0E0;
}

.divider span {
  padding: 0 1rem;
}

.google-button,
.github-button {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background-color: white;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.google-button i {
  color: #DB4437;
}

.github-button i {
  color: #333;
}

.google-button:hover,
.github-button:hover {
  background-color: #F5F5F5;
}

.signup-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #757575;
}

.signup-text a {
  color: #297FB7;
  text-decoration: none;
  font-weight: 500;
}

.signup-text a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
  }
  
  .left-panel {
    min-height: 50vh;
  }
}

@media (max-width: 576px) {
  .form-container {
    width: 85%;
  }
  
  .features {
    display: none;
  }
}
</style>