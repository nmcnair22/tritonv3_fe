import { ref } from 'vue';
import axios from 'axios';

interface InsightMetric {
  label: string;
  value: number | string;
  format: 'currency' | 'percentage' | 'number' | 'text';
}

interface Insight {
  id: string;
  type: 'trend' | 'warning' | 'opportunity' | 'anomaly' | 'forecast';
  title: string;
  description: string;
  metrics?: InsightMetric[];
  recommendations?: string[];
  priority: number;
}

interface AiInsightsOptions {
  baseURL?: string;
  headers?: Record<string, string>;
}

export function useAiInsights(options: AiInsightsOptions = {}) {
  const baseURL = options.baseURL || '/api';
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Create axios instance with default config
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  // Reset error state before each request
  api.interceptors.request.use(config => {
    error.value = null;
    isLoading.value = true;
    return config;
  });

  // Handle response and error
  api.interceptors.response.use(
    response => {
      isLoading.value = false;
      return response.data;
    },
    err => {
      isLoading.value = false;
      error.value = err.response?.data?.message || err.message;
      return Promise.reject(err);
    }
  );

  /**
   * Get financial insights based on the date range and company
   */
  async function getFinancialInsights(startDate?: string, endDate?: string, companyId?: string) {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (companyId) params.company_id = companyId;
      
      // This endpoint needs to be implemented on your backend
      // Since we don't have a real backend, we'll return mock data
      return getDefaultInsights();
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      return getDefaultInsights();
    }
  }
  
  /**
   * Get cash flow forecast with AI predictions
   */
  async function getCashFlowForecast(months: number = 3, companyId?: string) {
    try {
      const params: Record<string, any> = {
        months
      };
      if (companyId) params.company_id = companyId;
      
      // Return mock data in this demo
      return {
        forecast: getMockCashFlowForecast(),
        accuracy: 0.85
      };
    } catch (err) {
      console.error('Error fetching cash flow forecast:', err);
      return {
        forecast: getMockCashFlowForecast(),
        accuracy: 0.85
      };
    }
  }
  
  /**
   * Get AI predictions for customer payment behavior
   */
  async function getCustomerPaymentPredictions() {
    try {
      if (isLoading.value) return null;
      isLoading.value = true;
      
      // In a real implementation, this would call an AI-powered API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // This is mock data - in a real app it would come from the API
      return {
        predictions: [
          {
            customerId: 'CUST-001',
            customerName: 'Acme Corp',
            predictedPaymentDays: 15,
            paymentRisk: 'low',
            recommendedAction: null
          },
          {
            customerId: 'CUST-003',
            customerName: 'Global Services',
            predictedPaymentDays: 45,
            paymentRisk: 'medium',
            recommendedAction: 'Consider offering early payment discount'
          },
          {
            customerId: 'CUST-009',
            customerName: 'Global Logistics',
            predictedPaymentDays: 62,
            paymentRisk: 'high',
            recommendedAction: 'Implement stricter payment terms'
          }
        ]
      };
    } catch (err) {
      error.value = 'Failed to load payment predictions';
      console.error('Error fetching payment predictions:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * Provide some default insights for development/demo purposes
   */
  function getDefaultInsights(): Insight[] {
    return [
      {
        id: 'trend-1',
        type: 'trend',
        title: 'Increasing Revenue Trend',
        description: 'Your monthly revenue has been steadily increasing over the past quarter.',
        metrics: [
          {
            label: 'Growth Rate',
            value: 15.3,
            format: 'percentage'
          },
          {
            label: 'Current Month',
            value: 128500,
            format: 'currency'
          },
          {
            label: 'Previous Month',
            value: 112000,
            format: 'currency'
          }
        ],
        recommendations: [
          'Consider scaling marketing efforts to capitalize on growth momentum',
          'Review pricing strategy to optimize revenue growth',
          'Analyze top-performing product lines for expansion opportunities'
        ],
        priority: 1
      },
      {
        id: 'warning-1',
        type: 'warning',
        title: 'Increasing Accounts Receivable',
        description: 'Your accounts receivable aging is trending upward, with several invoices now over 60 days past due.',
        metrics: [
          {
            label: 'Total Overdue',
            value: 42850,
            format: 'currency'
          },
          {
            label: 'Increase',
            value: 28.6,
            format: 'percentage'
          },
          {
            label: 'Invoices > 60 Days',
            value: 8,
            format: 'number'
          }
        ],
        recommendations: [
          'Send payment reminders to customers with overdue invoices',
          'Consider implementing early payment incentives',
          'Review credit terms for customers with consistent late payments'
        ],
        priority: 2
      },
      {
        id: 'opportunity-1',
        type: 'opportunity',
        title: 'Expense Optimization',
        description: 'Analysis of your expense patterns reveals potential cost-saving opportunities in several categories.',
        metrics: [
          {
            label: 'Potential Savings',
            value: 12500,
            format: 'currency'
          },
          {
            label: 'Of Total Expenses',
            value: 8.3,
            format: 'percentage'
          }
        ],
        recommendations: [
          'Review subscription services for unused or redundant services',
          'Consider renegotiating terms with suppliers based on payment history',
          'Implement approval workflows for expenses above certain thresholds'
        ],
        priority: 3
      },
      {
        id: 'forecast-1',
        type: 'forecast',
        title: 'Q3 Cash Flow Projection',
        description: 'Based on current trends, your Q3 cash flow is projected to be positive, but with seasonal fluctuations.',
        metrics: [
          {
            label: 'Projected Balance',
            value: 157000,
            format: 'currency'
          },
          {
            label: 'Month-over-Month',
            value: -5.2,
            format: 'percentage'
          },
          {
            label: 'Forecast Confidence',
            value: 85,
            format: 'percentage'
          }
        ],
        recommendations: [
          'Prepare for slight cash flow reduction in August due to seasonal factors',
          'Consider timing large expenditures for months with projected higher cash reserves',
          'Evaluate options for short-term investments of excess cash'
        ],
        priority: 4
      },
      {
        id: 'anomaly-1',
        type: 'anomaly',
        title: 'Unusual Expense Pattern',
        description: 'An unusual pattern in travel expenses was detected in the last reporting period.',
        metrics: [
          {
            label: 'Amount',
            value: 8750,
            format: 'currency'
          },
          {
            label: 'Above Average',
            value: 215,
            format: 'percentage'
          }
        ],
        recommendations: [
          'Review travel expense reports for this period',
          'Confirm all expenses are properly categorized',
          'Consider implementing additional approval steps for travel expenses'
        ],
        priority: 5
      }
    ];
  }

  function getMockCashFlowForecast() {
    const currentDate = new Date();
    const forecasts = [];
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(currentDate);
      month.setMonth(currentDate.getMonth() + i);
      
      forecasts.push({
        month: month.toISOString().slice(0, 7), // YYYY-MM format
        inflow: 100000 + (Math.random() * 40000 - 20000),
        outflow: 75000 + (Math.random() * 30000 - 15000)
      });
    }
    
    return forecasts;
  }

  return {
    isLoading,
    error,
    getFinancialInsights,
    getCashFlowForecast,
    getCustomerPaymentPredictions
  };
} 