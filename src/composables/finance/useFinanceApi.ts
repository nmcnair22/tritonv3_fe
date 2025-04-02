import apiClient from '../../services/api';
import { ref } from 'vue';
import axios from 'axios';
import { useFinanceStore } from '@/stores/finance';

interface Company {
  id: number;
  displayName: string;
  name: string;
}

const MOCK_COMPANIES: Company[] = [
  { id: 1, displayName: 'Mock Company', name: 'Mock Company' },
  { id: 2, displayName: 'Mock Subsidiary', name: 'Mock Subsidiary' }
];

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

/**
 * @deprecated This composable is deprecated. Please use the useFinanceStore from Pinia instead.
 */
export function useFinanceApi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Get the finance store
  const financeStore = useFinanceStore();

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

  // Log API activity for debugging
  const logApi = (action: string, data?: any) => {
    console.log(`[FINANCE API] ${action}`, data);
  };

  /**
   * Fetch companies the user has access to
   * @deprecated Use financeStore.fetchCompanies() instead
   */
  const fetchCompanies = async () => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchCompanies() instead');
    return financeStore.fetchCompanies();
  };

  /**
   * Fetch balance sheet
   * @deprecated Use financeStore.fetchBalanceSheet() instead
   */
  const fetchBalanceSheet = async (companyId: number, asOfDate: string) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchBalanceSheet() instead');
    return financeStore.fetchBalanceSheet(companyId, asOfDate);
  };

  /**
   * Fetch income statement data
   * @deprecated Use financeStore.fetchIncomeStatement() instead
   */
  const fetchIncomeStatementData = async (companyId: number, startDate: string, endDate: string) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchIncomeStatement() instead');
    return financeStore.fetchIncomeStatement(companyId, startDate, endDate);
  };

  /**
   * Fetch cash flow statement
   * @deprecated Use financeStore.fetchCashFlowStatement() instead
   */
  const fetchCashFlowStatement = async (companyId: number, startDate: string, endDate: string) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchCashFlowStatement() instead');
    return financeStore.fetchCashFlowStatement(companyId, startDate, endDate);
  };

  /**
   * Fetch retained earnings
   * @deprecated Use financeStore.fetchRetainedEarnings() instead
   */
  const fetchRetainedEarnings = async (companyId: number, startDate: string, endDate: string) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchRetainedEarnings() instead');
    return financeStore.fetchRetainedEarnings(companyId, startDate, endDate);
  };

  /**
   * Fetch trial balance
   * @deprecated Use financeStore.fetchTrialBalance() instead
   */
  const fetchTrialBalance = async (companyId: number, asOfDate: string) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchTrialBalance() instead');
    return financeStore.fetchTrialBalance(companyId, asOfDate);
  };

  /**
   * Fetch sales invoices
   * @deprecated Use financeStore.fetchSalesInvoices() instead
   */
  const fetchSalesInvoices = async (params: FetchSalesInvoicesParams = {}) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchSalesInvoices() instead');
    return financeStore.fetchSalesInvoices(params);
  };

  /**
   * Fetch a single sales invoice by ID
   * @deprecated Use financeStore.fetchSalesInvoice() instead
   */
  const fetchSalesInvoice = async (invoiceId: number) => {
    console.log('[FINANCE API DEPRECATED] Use financeStore.fetchSalesInvoice() instead');
    return financeStore.fetchSalesInvoice(invoiceId);
  };

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
    fetchBalanceSheet,
    fetchIncomeStatementData,
    fetchCashFlowStatement,
    fetchRetainedEarnings,
    fetchTrialBalance,
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
    testDirectApiCall
  };
} 