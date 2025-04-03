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

interface Metrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  cash_flow: number;
  previous_total_revenue: number;
  previous_total_expenses: number;
  previous_net_profit: number;
  previous_cash_flow: number;
}

interface TrendData {
  period: string;
  revenue: number;
}

interface CategoryData {
  category: string;
  amount: number;
}

interface SourceData {
  source: string;
  revenue: number;
}

interface TransactionData {
  date: string;
  invoice_number: string;
  customer: string;
  amount: number;
  status: string;
}

// Create finance store
export const useFinanceStore = defineStore('finance', () => {
  console.log('[FINANCE STORE] Defining finance store');
  
  // State
  const companies = ref<Company[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const reportData = ref<ReportData | null>(null);
  const metrics = ref<Metrics>({
    total_revenue: 0,
    total_expenses: 0,
    net_profit: 0,
    cash_flow: 0,
    previous_total_revenue: 0,
    previous_total_expenses: 0,
    previous_net_profit: 0,
    previous_cash_flow: 0
  });
  const dateRange = ref<[Date | null, Date | null]>([null, null]);
  const revenueTrend = ref<TrendData[]>([]);
  const expensesByCategory = ref<CategoryData[]>([]);
  const revenueBySource = ref<SourceData[]>([]);
  const recentTransactions = ref<TransactionData[]>([]);

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

  // Set date range
  function setDateRange(range: [Date | null, Date | null]) {
    dateRange.value = range;
    log(`Date range set to: ${dateRange.value[0]} - ${dateRange.value[1]}`);
  }

  // Helper to format date for API calls
  function formatDate(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  // Helper to format date range for API calls
  function formatDateRange(): [string | null, string | null] {
    return [
      formatDate(dateRange.value[0]),
      formatDate(dateRange.value[1])
    ];
  }

  // Fetch total revenue metrics
  async function fetchTotalRevenue() {
    log('Fetching total revenue metrics');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/total-revenue', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      log('Total revenue metrics fetched successfully', response.data);
      
      if (response.data && response.data.success) {
        metrics.value.total_revenue = response.data.data.current_total || 0;
        metrics.value.previous_total_revenue = response.data.data.previous_total || 0;
      }
      
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchTotalRevenue');
    }
  }

  // Fetch total expenses metrics
  async function fetchTotalExpenses() {
    log('Fetching total expenses metrics');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/total-expenses', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      log('Total expenses metrics fetched successfully', response.data);
      
      if (response.data && response.data.success) {
        metrics.value.total_expenses = response.data.data.current_total || 0;
        metrics.value.previous_total_expenses = response.data.data.previous_total || 0;
      }
      
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchTotalExpenses');
    }
  }

  // Fetch net profit metrics
  async function fetchNetProfit() {
    log('Fetching net profit metrics');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/net-profit', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      log('Net profit metrics fetched successfully', response.data);
      
      if (response.data && response.data.success) {
        metrics.value.net_profit = response.data.data.current_total || 0;
        metrics.value.previous_net_profit = response.data.data.previous_total || 0;
      }
      
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchNetProfit');
    }
  }

  // Fetch cash flow metrics
  async function fetchCashFlow() {
    log('Fetching cash flow metrics');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/cash-flow', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      log('Cash flow metrics fetched successfully', response.data);
      
      if (response.data && response.data.success) {
        metrics.value.cash_flow = response.data.data.current_total || 0;
        metrics.value.previous_cash_flow = response.data.data.previous_total || 0;
      }
      
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchCashFlow');
    }
  }

  // Fetch revenue trend
  async function fetchRevenueTrend() {
    log('Fetching revenue trend');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/revenue-trend', {
        params: { 
          start_date: startDate, 
          end_date: endDate,
          granularity: 'monthly' // Could be dynamic based on date range
        }
      });
      
      log('Revenue trend fetched successfully', response.data);
      revenueTrend.value = response.data || [];
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchRevenueTrend');
    }
  }

  // Fetch expenses by category
  async function fetchExpensesByCategory() {
    log('Fetching expenses by category');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/expenses-by-category', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      log('Expenses by category fetched successfully', response.data);
      expensesByCategory.value = response.data || [];
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchExpensesByCategory');
    }
  }

  // Fetch revenue by source
  async function fetchRevenueBySource() {
    log('Fetching revenue by source');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/revenue-by-source', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      log('Revenue by source fetched successfully', response.data);
      revenueBySource.value = response.data || [];
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchRevenueBySource');
    }
  }

  // Fetch recent transactions
  async function fetchRecentTransactions() {
    log('Fetching recent transactions');
    const [startDate, endDate] = formatDateRange();
    
    try {
      const response = await apiClient.get('/api/accounting/recent-transactions', {
        params: { 
          start_date: startDate, 
          end_date: endDate,
          limit: 10
        }
      });
      
      log('Recent transactions fetched successfully', response.data);
      recentTransactions.value = response.data || [];
      return response.data;
    } catch (err) {
      return handleError(err, 'fetchRecentTransactions');
    }
  }

  // Fetch all dashboard data
  async function fetchAllData() {
    log('Fetching all dashboard data');
    clearError();
    isLoading.value = true;

    try {
      await Promise.all([
        fetchTotalRevenue(),
        fetchTotalExpenses(),
        fetchNetProfit(),
        fetchCashFlow(),
        fetchRevenueTrend(),
        fetchExpensesByCategory(),
        fetchRevenueBySource(),
        fetchRecentTransactions()
      ]);
      
      log('All dashboard data fetched successfully');
      return true;
    } catch (err: any) {
      handleError(err, 'fetchAllData');
      return false;
    } finally {
      isLoading.value = false;
    }
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
  async function fetchBalanceSheet(asOfDate: string) {
    clearError();
    isLoading.value = true;
    
    try {
      const response = await apiClient.get('/api/accounting/reports/balanceSheet', {
        params: { date: asOfDate }
      });
      
      if (response.data && response.data.value) {
        reportData.value = response.data.value;
        return reportData.value;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      handleError(err, 'fetchBalanceSheet');
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch income statement
  async function fetchIncomeStatement(startDate: string, endDate: string) {
    clearError();
    isLoading.value = true;
    
    try {
      const response = await apiClient.get('/api/accounting/reports/incomeStatement', {
        params: { startDate, endDate }
      });
      
      if (response.data && response.data.value) {
        reportData.value = response.data.value;
        return reportData.value;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      handleError(err, 'fetchIncomeStatement');
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch cash flow statement
  async function fetchCashFlowStatement(startDate: string, endDate: string) {
    clearError();
    isLoading.value = true;
    
    try {
      const response = await apiClient.get('/api/accounting/reports/cashFlow', {
        params: { startDate, endDate }
      });
      
      if (response.data && response.data.value) {
        reportData.value = response.data.value;
        return reportData.value;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      handleError(err, 'fetchCashFlowStatement');
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch retained earnings
  async function fetchRetainedEarnings(asOfDate: string) {
    clearError();
    isLoading.value = true;
    
    try {
      const response = await apiClient.get('/api/accounting/reports/retainedEarnings', {
        params: { date: asOfDate }
      });
      
      if (response.data && response.data.value) {
        reportData.value = response.data.value;
        return reportData.value;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      handleError(err, 'fetchRetainedEarnings');
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch trial balance
  async function fetchTrialBalance(asOfDate: string) {
    clearError();
    isLoading.value = true;
    
    try {
      const response = await apiClient.get('/api/accounting/reports/trialBalance', {
        params: { date: asOfDate }
      });
      
      if (response.data && response.data.value) {
        reportData.value = response.data.value;
        return reportData.value;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      handleError(err, 'fetchTrialBalance');
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Return store
  return {
    companies,
    isLoading,
    error,
    reportData,
    metrics,
    dateRange,
    revenueTrend,
    expensesByCategory,
    revenueBySource,
    recentTransactions,
    clearError,
    clearReportData,
    fetchCompanies,
    fetchBalanceSheet,
    fetchIncomeStatement,
    fetchCashFlowStatement,
    fetchRetainedEarnings,
    fetchTrialBalance,
    setDateRange,
    fetchAllData,
    // Export individual fetch functions for metrics for flexibility
    fetchTotalRevenue,
    fetchTotalExpenses,
    fetchNetProfit,
    fetchCashFlow,
    fetchRevenueTrend,
    fetchExpensesByCategory,
    fetchRevenueBySource,
    fetchRecentTransactions
  };
});