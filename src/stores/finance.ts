import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../services/api';

// Types
interface ReportData {
  [key: string]: any;
}

// Create finance store
export const useFinanceStore = defineStore('finance', () => {
  // State
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const reportData = ref<ReportData | null>(null);

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

  // Fetch balance sheet
  async function fetchBalanceSheet(asOfDate: string) {
    clearError();
    isLoading.value = true;
    
    try {
      const response = await apiClient.get('/api/accounting/financial-reports/balanceSheet', {
        params: { date: asOfDate }
      });
      
      if (response.data && response.data.success && response.data.data) {
        reportData.value = response.data.data;
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
      const response = await apiClient.get('/api/accounting/financial-reports/incomeStatement', {
        params: { startDate, endDate }
      });
      
      if (response.data && response.data.success && response.data.data) {
        reportData.value = response.data.data;
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
      const response = await apiClient.get('/api/accounting/financial-reports/cashFlow', {
        params: { startDate, endDate }
      });
      
      if (response.data && response.data.success && response.data.data) {
        reportData.value = response.data.data;
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
      const response = await apiClient.get('/api/accounting/financial-reports/retainedEarnings', {
        params: { date: asOfDate }
      });
      
      if (response.data && response.data.success && response.data.data) {
        reportData.value = response.data.data;
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
      const response = await apiClient.get('/api/accounting/financial-reports/trialBalance', {
        params: { date: asOfDate }
      });
      
      if (response.data && response.data.success && response.data.data) {
        reportData.value = response.data.data;
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
    // State
    isLoading,
    error,
    reportData,
    
    // Actions
    clearError,
    clearReportData,
    fetchBalanceSheet,
    fetchIncomeStatement,
    fetchCashFlowStatement,
    fetchRetainedEarnings,
    fetchTrialBalance
  };
}); 