<template>
  <div class="revenue-chart-container">
    <div v-if="!data || data.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="pi pi-chart-bar" style="font-size: 2rem"></i>
      </div>
      <p class="empty-text">
        No chart data available. Try adjusting your date range or check back later.
      </p>
    </div>
    
    <div v-else>
      <div class="chart-header">
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color revenue"></div>
            <span class="legend-label">Revenue</span>
          </div>
          <div class="legend-item">
            <div class="legend-color expenses"></div>
            <span class="legend-label">Expenses</span>
          </div>
          <div class="legend-item">
            <div class="legend-color profit"></div>
            <span class="legend-label">Profit</span>
          </div>
        </div>
        
        <div class="chart-controls">
          <select v-model="chartType" class="chart-type-select" @change="updateChartType">
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      </div>
      
      <div class="chart-wrapper">
        <Chart :type="chartType" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Chart from 'primevue/chart';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: 'USD'
  }
});

// Chart type state (bar, line, area)
const chartType = ref('bar');

// Helper functions for formatting chart values
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency,
    maximumFractionDigits: 0
  }).format(value || 0);
}

function updateChartType() {
  if (chartType.value === 'area') {
    // Switch to line chart with fill
    chartType.value = 'line';
    chartOptions.value.elements.line.fill = true;
  } else {
    chartOptions.value.elements.line.fill = false;
  }
}

// Chart data transformed for PrimeVue Chart
const chartData = computed(() => {
  const labels = props.data.map(item => item.month);
  const revenueData = props.data.map(item => item.revenue);
  const expensesData = props.data.map(item => item.expenses);
  const profitData = props.data.map(item => item.revenue - item.expenses);

  return {
    labels: labels,
    datasets: [
      {
        type: 'bar',
        label: 'Revenue',
        backgroundColor: '#42A5F5',
        data: revenueData
      },
      {
        type: 'bar',
        label: 'Expenses',
        backgroundColor: '#FFA726',
        data: expensesData
      },
      {
        type: 'line',
        label: 'Profit',
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: profitData
      }
    ]
  };
});

// Chart options for PrimeVue Chart
const chartOptions = ref({
  maintainAspectRatio: false,
  aspectRatio: 1.5,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatCurrency(context.parsed.y);
          }
          return label;
        }
      }
    },
    legend: {
      display: false
    }
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#495057'
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        color: '#495057',
        callback: function(value) {
          return formatCurrency(value).replace('.00', '');
        }
      },
      grid: {
        color: '#EBEDEF'
      }
    }
  }
});

// Format date for chart display
function formatChartDate(dateString) {
  if (!dateString) return '';
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const date = new Date(dateString);
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}
</script>

<style scoped>
.revenue-chart-container {
  width: 100%;
  height: 100%;
  min-height: 350px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-color-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--surface-400);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 1rem;
  height: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 2px;
}

.legend-color.revenue {
  background-color: #42A5F5;
}

.legend-color.expenses {
  background-color: #FFA726;
}

.legend-color.profit {
  background-color: #66BB6A;
}

.legend-label {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.chart-type-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--surface-300);
  background-color: var(--surface-0);
  font-size: 0.75rem;
}

.chart-wrapper {
  height: 300px;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .chart-legend {
    margin-bottom: 0.5rem;
  }
}
</style> 