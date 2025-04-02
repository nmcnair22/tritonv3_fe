import apiClient from '../../services/api';
import { ref } from 'vue';
import axios from 'axios';

interface FetchSalesInvoicesParams {
  $top?: number;
  $skip?: number;
  $orderby?: string;
  $filter?: string;
  companyId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}

export function useFinanceApi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Use the pre-configured axios instance with auth headers
  const api = apiClient;
  
  // Debug API configuration
  console.log("[DEBUG] API Client Configuration:");
  console.log("[DEBUG] baseURL:", api.defaults.baseURL);
  console.log("[DEBUG] timeout:", api.defaults.timeout);
  console.log("[DEBUG] headers:", api.defaults.headers);
  
  // Add request interceptor to handle loading state
  api.interceptors.request.use(config => {
    error.value = null;
    isLoading.value = true;
    
    // Debug: Log each request
    console.log(`[DEBUG] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[DEBUG] Request params:`, config.params);
    console.log(`[DEBUG] Request headers:`, config.headers);
    
    return config;
  }, error => {
    isLoading.value = false;
    return Promise.reject(error);
  });

  // Add response interceptor to handle loading state and errors
  api.interceptors.response.use(
    response => {
      isLoading.value = false;
      return response;
    },
    err => {
      isLoading.value = false;
      error.value = err.response?.data?.message || err.message;
      return Promise.reject(err);
    }
  );

  /**
   * Fetch companies the user has access to
   */
  async function fetchCompanies() {
    try {
      // Debug: Log attempt
      console.log(`[DEBUG] Attempting to fetch companies list`);
      console.log(`[DEBUG] API URL: ${api.defaults.baseURL}/api/accounting/companies`);
      console.log(`[DEBUG] Headers:`, api.defaults.headers);
      
      // Make the API call - correct endpoint from backend routes
      const response = await api.get('/api/accounting/companies');
      
      // Debug: Log response
      console.log(`[DEBUG] Companies API response status:`, response.status);
      console.log(`[DEBUG] Companies API response headers:`, response.headers);
      console.log(`[DEBUG] Companies API response data:`, response.data);
      
      return response.data;
    } catch (err: any) {
      // Debug: Log error details
      console.error('[DEBUG] Error fetching companies:', err);
      console.error('[DEBUG] Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
        }
      });
      
      throw err; // Let the component handle errors
    }
  }

  /**
   * Fetch income statement data for dashboard
   */
  async function fetchIncomeStatementData(startDate?: string, endDate?: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (companyId) params.companyId = companyId;

      // Debug: Log attempt
      console.log(`[DEBUG] Attempting to fetch income statement data with params:`, params);
      console.log(`[DEBUG] API URL: ${api.defaults.baseURL}/api/accounting/reports/incomeStatement`);
      
      // Make the API call with the correct camelCase endpoint
      const response = await api.get('/api/accounting/reports/incomeStatement', { params });
      
      // Debug: Log response
      console.log(`[DEBUG] Income statement API response status:`, response.status);
      console.log(`[DEBUG] Income statement API response data:`, response.data);
      
      return response.data;
    } catch (err: any) {
      // Debug: Log error details
      console.error('[DEBUG] Error fetching income statement data:', err);
      console.error('[DEBUG] Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          params: err.config?.params
        }
      });
      
      throw err; // Let the component handle errors
    }
  }

  /**
   * Fetch sales invoices with filtering options
   */
  async function fetchSalesInvoices(params: FetchSalesInvoicesParams = {}) {
    try {
      console.log(`[API] Fetching sales invoices with params:`, params);
      
      // Updated endpoint to match Laravel backend
      const response = await api.get('/api/accounting/sales-invoices', { params });
      
      console.log(`[API] Sales invoices API response:`, response);
      
      return response.data;
    } catch (err) {
      console.error('[API] Error fetching sales invoices:', err);
      throw err; // Let the component handle errors
    }
  }

  /**
   * Fetch a single sales invoice by ID
   */
  async function fetchSalesInvoice(invoiceId: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (companyId) params.companyId = companyId;

      const response = await api.get(`/api/accounting/sales-invoices/${invoiceId}`, { params });
      return response.data;
    } catch (err) {
      console.error(`Error fetching sales invoice ${invoiceId}:`, err);
      throw err;
    }
  }

  /**
   * Create a new sales invoice
   */
  async function createSalesInvoice(invoiceData: any) {
    try {
      const response = await api.post('/api/accounting/sales-invoices', invoiceData);
      return response.data;
    } catch (err) {
      console.error('Error creating sales invoice:', err);
      throw err;
    }
  }

  /**
   * Update an existing sales invoice
   */
  async function updateSalesInvoice(invoiceId: string, invoiceData: any) {
    try {
      const response = await api.put(`/api/accounting/sales-invoices/${invoiceId}`, invoiceData);
      return response.data;
    } catch (err) {
      console.error(`Error updating sales invoice ${invoiceId}:`, err);
      throw err;
    }
  }

  /**
   * Record a payment for an invoice
   */
  async function recordInvoicePayment(invoiceId: string, paymentData: any) {
    try {
      const response = await api.post(`/api/accounting/sales-invoices/${invoiceId}/payments`, paymentData);
      return response.data;
    } catch (err) {
      console.error(`Error recording payment for invoice ${invoiceId}:`, err);
      throw err;
    }
  }

  /**
   * Send a reminder for an invoice
   */
  async function sendInvoiceReminder(invoiceId: string, reminderData?: any) {
    try {
      const response = await api.post(`/api/accounting/sales-invoices/${invoiceId}/send-reminder`, reminderData || {});
      return response.data;
    } catch (err) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, err);
      throw err;
    }
  }

  /**
   * Fetch AR aging report data
   */
  async function fetchArAging(params: any = {}) {
    try {
      // Make the API call with the correct camelCase endpoint
      const response = await api.get('/api/accounting/reports/arAging', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching AR aging data:', err);
      throw err;
    }
  }

  /**
   * Fetch customers list
   */
  async function fetchCustomers(params: any = {}) {
    try {
      const response = await api.get('/api/accounting/customers', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching customers:', err);
      throw err;
    }
  }

  /**
   * Fetch a single customer by ID
   */
  async function fetchCustomer(customerId: string, params: any = {}) {
    try {
      const response = await api.get(`/api/accounting/customers/${customerId}`, { params });
      return response.data;
    } catch (err) {
      console.error(`Error fetching customer ${customerId}:`, err);
      throw err;
    }
  }

  /**
   * Create or update a customer
   */
  async function saveCustomer(customerData: any) {
    try {
      let response;
      
      if (customerData.id) {
        // Update existing customer
        response = await api.put(`/api/accounting/customers/${customerData.id}`, customerData);
      } else {
        // Create new customer
        response = await api.post('/api/accounting/customers', customerData);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error saving customer:', err);
      throw err;
    }
  }

  /**
   * Fetch balance sheet data
   */
  async function fetchBalanceSheet(endDate: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (endDate) params.endDate = endDate;
      if (companyId) params.companyId = companyId;
      
      // Make the API call with the correct camelCase endpoint
      const response = await api.get('/api/accounting/reports/balanceSheet', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching balance sheet data:', err);
      throw err;
    }
  }

  /**
   * Fetch cash flow statement data
   */
  async function fetchCashFlowStatement(startDate?: string, endDate?: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (companyId) params.companyId = companyId;
      
      // Make the API call with the correct camelCase endpoint
      const response = await api.get('/api/accounting/reports/cashFlow', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching cash flow data:', err);
      throw err;
    }
  }

  /**
   * Fetch retained earnings statement data
   */
  async function fetchRetainedEarnings(endDate: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (endDate) params.endDate = endDate;
      if (companyId) params.companyId = companyId;
      
      // Make the API call with the correct camelCase endpoint
      const response = await api.get('/api/accounting/reports/retainedEarnings', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching retained earnings data:', err);
      throw err;
    }
  }

  /**
   * Fetch trial balance data
   */
  async function fetchTrialBalance(endDate: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (endDate) params.endDate = endDate;
      if (companyId) params.companyId = companyId;
      
      // Make the API call with the correct camelCase endpoint
      const response = await api.get('/api/accounting/reports/trialBalance', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching trial balance data:', err);
      throw err;
    }
  }

  // Add function to test API without interceptors
  async function testDirectApiCall() {
    console.log("[DEBUG] Making direct API test call...");
    try {
      // Create a new axios instance without interceptors
      const testApi = axios.create({
        baseURL: api.defaults.baseURL,
        timeout: 10000
      });
      
      // Manually add token
      const token = localStorage.getItem('auth_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      console.log("[DEBUG] Test call headers:", headers);
      
      // Make a simple GET request to companies endpoint using the correct path
      const response = await testApi.get('/api/accounting/companies', { headers });
      
      console.log("[DEBUG] Test call successful!");
      console.log("[DEBUG] Status:", response.status);
      console.log("[DEBUG] Data:", response.data);
      
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (err: any) {
      console.error("[DEBUG] Test call failed:", err);
      
      return {
        success: false,
        error: err.message,
        response: err.response
      };
    }
  }

  return {
    isLoading,
    error,
    fetchCompanies,
    fetchIncomeStatementData,
    fetchSalesInvoices,
    fetchSalesInvoice,
    createSalesInvoice,
    updateSalesInvoice,
    recordInvoicePayment,
    sendInvoiceReminder,
    fetchArAging,
    fetchCustomers,
    fetchCustomer,
    saveCustomer,
    fetchBalanceSheet,
    fetchCashFlowStatement,
    fetchRetainedEarnings,
    fetchTrialBalance,
    testDirectApiCall
  };
} 