import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../services/api';

// Types
interface Company {
  id: number;
  displayName: string;
  name: string;
}

interface ReportData {
  [key: string]: any;
}

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

// Create finance store
export const useFinanceStore = defineStore('finance', () => {
  console.log('[FINANCE STORE] Defining finance store');
  
  // State
  const companies = ref<Company[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const reportData = ref<ReportData | null>(null);

  // Debug flag
  const debugMode = true;

  // Debug logging
  function log(message: string, data?: any) {
    if (debugMode) {
      console.log(`[FINANCE STORE] ${message}`, data || '');
    }
  }
  
  log('Finance store initialization started');

  // Error handling
  function handleError(err: any, actionName: string) {
    const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
    error.value = `Error in ${actionName}: ${errorMessage}`;
    console.error(`[FINANCE STORE] ${actionName} failed:`, err);
    return null;
  }

  // Reset error
  function clearError() {
    error.value = null;
  }

  // Clear report data
  function clearReportData() {
    reportData.value = null;
  }

  // Fetch companies
  async function fetchCompanies() {
    log('Fetching companies...');
    clearError();
    isLoading.value = true;

    try {
      log('Making API request to /api/accounting/companies');
      console.log('[FINANCE STORE] API Client config:', {
        baseURL: apiClient.defaults.baseURL,
        headers: apiClient.defaults.headers.common,
        timeout: apiClient.defaults.timeout
      });

      const token = localStorage.getItem('auth_token');
      console.log('[FINANCE STORE] Token for request:', token ? `${token.substring(0, 10)}...` : 'No token');
      
      console.log('[FINANCE STORE] About to call apiClient.get');
      const response = await apiClient.get('/api/accounting/companies');
      console.log('[FINANCE STORE] Raw response received:', response ? 'Response exists' : 'No response');
      
      if (response && response.data) {
        console.log('[FINANCE STORE] Response structure:', {
          hasSuccess: response.data.success !== undefined,
          hasData: response.data.data !== undefined,
          hasValue: response.data.data?.value !== undefined,
          isArray: Array.isArray(response.data)
        });
      }

      if (response.data && response.data.success && response.data.data && response.data.data.value) {
        // Handle the nested data structure, the companies are in data.data.value
        companies.value = response.data.data.value;
        log(`Successfully loaded ${companies.value.length} companies`);
      } else if (response.data && response.data.success && response.data.data) {
        // Alternative structure - if companies are directly in data.data
        companies.value = response.data.data;
        log(`Successfully loaded ${companies.value.length} companies`);
      } else if (Array.isArray(response.data)) {
        // Direct array response
        companies.value = response.data;
        log(`Successfully loaded ${companies.value.length} companies`);
      } else {
        // Unknown structure
        console.error('[FINANCE STORE] Invalid companies response structure:', response.data);
        console.error('[FINANCE STORE] Unexpected response format');
        error.value = 'Invalid data structure received from API';
        companies.value = [];
        throw new Error('Unexpected response format');
      }
      
      console.log('[FINANCE STORE] Companies loaded successfully:', companies.value.length);
      console.log('[FINANCE STORE] First company:', companies.value.length > 0 ? companies.value[0] : 'No companies');
      
      return companies.value;
    } catch (err: any) {
      console.error('[FINANCE STORE] fetchCompanies error:', err);
      console.error('[FINANCE STORE] Error details:', {
        message: err.message,
        response: err.response ? err.response.data : 'No response',
        status: err.response ? err.response.status : 'No status',
        config: err.config ? {
          url: err.config.url,
          method: err.config.method,
          headers: err.config.headers
        } : 'No config'
      });
      handleError(err, 'fetchCompanies');
      throw err; // Re-throw to ensure it's caught in onMounted
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch balance sheet
  async function fetchBalanceSheet(companyId: number, asOfDate: string) {
    log(`Fetching balance sheet for company ${companyId} as of ${asOfDate}`);
    log(`Company ID type check: ${typeof companyId}, Date type check: ${typeof asOfDate}`);
    clearError();
    isLoading.value = true;
    
    try {
      // Output API request details
      console.log('[FINANCE STORE] Balance Sheet request details:', {
        url: '/api/accounting/reports/balanceSheet',
        params: { companyId, asOfDate },
        fullUrl: `${apiClient.defaults.baseURL}/api/accounting/reports/balanceSheet?companyId=${companyId}&asOfDate=${asOfDate}`
      });
      
      console.log('[FINANCE STORE] API Client config for balance sheet:', {
        baseURL: apiClient.defaults.baseURL,
        headers: apiClient.defaults.headers.common,
        timeout: apiClient.defaults.timeout
      });

      const token = localStorage.getItem('auth_token');
      console.log('[FINANCE STORE] Token for balance sheet request:', token ? `${token.substring(0, 10)}...` : 'No token');
      
      // Log that we're about to make the call
      console.log('[FINANCE STORE] About to call fetchBalanceSheet API');
      
      const response = await apiClient.get('/api/accounting/reports/balanceSheet', {
        params: { companyId, asOfDate }
      });
      
      console.log('[FINANCE STORE] Balance sheet API response received!');
      console.log('[FINANCE STORE] Response status:', response.status);
      console.log('[FINANCE STORE] Response structure:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        isObject: typeof response.data === 'object',
        hasSuccess: response.data && response.data.success !== undefined,
        contentType: response.headers && response.headers['content-type']
      });
      
      // Handle different response structures
      if (response.data && response.data.success && response.data.data) {
        reportData.value = response.data.data;
        log(`Successfully loaded balance sheet data with ${Object.keys(response.data.data).length} sections`);
      } else {
        reportData.value = response.data;
        log(`Successfully loaded balance sheet data (direct format)`);
      }
      
      console.log('[FINANCE STORE] Balance sheet data set to reportData.value');
      return reportData.value;
    } catch (err: any) {
      console.error('[FINANCE STORE] fetchBalanceSheet error:', err);
      console.error('[FINANCE STORE] Error details:', {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        } : 'No response',
        request: err.request ? 'Request present' : 'No request',
        config: err.config ? {
          url: err.config.url,
          method: err.config.method,
          params: err.config.params,
          headers: err.config.headers
        } : 'No config'
      });
      
      handleError(err, 'fetchBalanceSheet');
      throw err; // Re-throw to ensure it's caught in component
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch income statement
  async function fetchIncomeStatement(companyId: number, startDate: string, endDate: string) {
    log(`Fetching income statement for company ${companyId} from ${startDate} to ${endDate}`);
    clearError();
    isLoading.value = true;
    
    try {
      log('Making API request to /api/accounting/reports/incomeStatement');
      const response = await apiClient.get('/api/accounting/reports/incomeStatement', {
        params: { companyId, startDate, endDate }
      });
      log('Income statement API response received');
      
      reportData.value = response.data;
      return response.data;
    } catch (err: any) {
      return handleError(err, 'fetchIncomeStatement');
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch cash flow statement
  async function fetchCashFlowStatement(companyId: number, startDate: string, endDate: string) {
    log(`Fetching cash flow statement for company ${companyId} from ${startDate} to ${endDate}`);
    clearError();
    isLoading.value = true;
    
    try {
      log('Making API request to /api/accounting/reports/cashFlow');
      const response = await apiClient.get('/api/accounting/reports/cashFlow', {
        params: { companyId, startDate, endDate }
      });
      log('Cash flow statement API response received');
      
      reportData.value = response.data;
      return response.data;
    } catch (err: any) {
      return handleError(err, 'fetchCashFlowStatement');
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch retained earnings
  async function fetchRetainedEarnings(companyId: number, startDate: string, endDate: string) {
    log(`Fetching retained earnings for company ${companyId} from ${startDate} to ${endDate}`);
    clearError();
    isLoading.value = true;
    
    try {
      log('Making API request to /api/accounting/reports/retainedEarnings');
      const response = await apiClient.get('/api/accounting/reports/retainedEarnings', {
        params: { companyId, startDate, endDate }
      });
      log('Retained earnings API response received');
      
      reportData.value = response.data;
      return response.data;
    } catch (err: any) {
      return handleError(err, 'fetchRetainedEarnings');
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch trial balance
  async function fetchTrialBalance(companyId: number, asOfDate: string) {
    log(`Fetching trial balance for company ${companyId} as of ${asOfDate}`);
    clearError();
    isLoading.value = true;
    
    try {
      log('Making API request to /api/accounting/reports/trialBalance');
      const response = await apiClient.get('/api/accounting/reports/trialBalance', {
        params: { companyId, asOfDate }
      });
      log('Trial balance API response received');
      
      reportData.value = response.data;
      return response.data;
    } catch (err: any) {
      return handleError(err, 'fetchTrialBalance');
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch sales invoices
  async function fetchSalesInvoices(params: FetchSalesInvoicesParams = {}) {
    log('Fetching sales invoices with params:', params);
    clearError();
    isLoading.value = true;
    
    try {
      log('Making API request to /api/accounting/salesInvoices');
      const response = await apiClient.get('/api/accounting/salesInvoices', { params });
      log('Sales invoices API response received');
      
      return response.data;
    } catch (err: any) {
      return handleError(err, 'fetchSalesInvoices');
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch a single sales invoice
  async function fetchSalesInvoice(invoiceId: number) {
    log(`Fetching sales invoice ${invoiceId}`);
    clearError();
    isLoading.value = true;
    
    try {
      log(`Making API request to /api/accounting/salesInvoices/${invoiceId}`);
      const response = await apiClient.get(`/api/accounting/salesInvoices/${invoiceId}`);
      log('Sales invoice API response received');
      
      return response.data;
    } catch (err: any) {
      return handleError(err, 'fetchSalesInvoice');
    } finally {
      isLoading.value = false;
    }
  }

  // Return store
  return {
    // State
    companies,
    isLoading,
    error,
    reportData,
    
    // Actions
    clearError,
    clearReportData,
    fetchCompanies,
    fetchBalanceSheet,
    fetchIncomeStatement,
    fetchCashFlowStatement,
    fetchRetainedEarnings,
    fetchTrialBalance,
    fetchSalesInvoices,
    fetchSalesInvoice
  };
}); 