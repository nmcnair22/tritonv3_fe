<template>
  <div class="ar-aging-table-wrapper">
    <table class="ar-aging-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Current</th>
          <th>1-30 Days</th>
          <th>31-60 Days</th>
          <th>61-90 Days</th>
          <th>90+ Days</th>
          <th>Total</th>
          <th v-if="!isCompact">Actions</th>
        </tr>
      </thead>
      <tbody v-if="!isLoading && agingData.length > 0">
        <tr v-for="customer in agingData" :key="customer.id">
          <td>
            <div class="customer-info">
              <span class="customer-name">{{ customer.name }}</span>
              <span class="customer-id">{{ customer.id }}</span>
            </div>
          </td>
          <td :class="getCellClass(customer.current)">
            {{ formatCurrency(customer.current) }}
          </td>
          <td :class="getCellClass(customer.days30)">
            {{ formatCurrency(customer.days30) }}
          </td>
          <td :class="getCellClass(customer.days60)">
            {{ formatCurrency(customer.days60) }}
          </td>
          <td :class="getCellClass(customer.days90)">
            {{ formatCurrency(customer.days90) }}
          </td>
          <td :class="getCellClass(customer.days90Plus)">
            {{ formatCurrency(customer.days90Plus) }}
          </td>
          <td :class="getCellClass(calculateTotal(customer))">
            {{ formatCurrency(calculateTotal(customer)) }}
          </td>
          <td v-if="!isCompact" class="actions-cell">
            <button @click="viewCustomer(customer.id)" class="btn-action">
              <span class="icon">visibility</span>
            </button>
            <button @click="sendReminder(customer.id)" class="btn-action">
              <span class="icon">email</span>
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="!isLoading && agingData.length === 0">
        <tr>
          <td colspan="8" class="empty-state">
            No accounts receivable data found.
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="8" class="loading-state">
            <div class="loading-spinner"></div>
            Loading aging data...
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="totals-row">
          <th>Totals</th>
          <th>{{ formatCurrency(calculateColumnTotal('current')) }}</th>
          <th>{{ formatCurrency(calculateColumnTotal('days30')) }}</th>
          <th>{{ formatCurrency(calculateColumnTotal('days60')) }}</th>
          <th>{{ formatCurrency(calculateColumnTotal('days90')) }}</th>
          <th>{{ formatCurrency(calculateColumnTotal('days90Plus')) }}</th>
          <th>{{ formatCurrency(calculateGrandTotal()) }}</th>
          <th v-if="!isCompact"></th>
        </tr>
      </tfoot>
    </table>
    
    <div v-if="!isCompact" class="table-actions">
      <button class="btn-outline" @click="exportData">
        <span class="icon">download</span>
        Export Report
      </button>
      <button class="btn-primary" @click="sendAllReminders">
        <span class="icon">email</span>
        Send All Reminders
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  agingData: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isCompact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['view-customer', 'send-reminder']);

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function calculateTotal(customer) {
  return (
    (customer.current || 0) +
    (customer.days30 || 0) +
    (customer.days60 || 0) +
    (customer.days90 || 0) +
    (customer.days90Plus || 0)
  );
}

function calculateColumnTotal(column) {
  return props.agingData.reduce((sum, customer) => sum + (customer[column] || 0), 0);
}

function calculateGrandTotal() {
  return props.agingData.reduce((sum, customer) => sum + calculateTotal(customer), 0);
}

function getCellClass(value) {
  if (!value) return '';
  
  const valueNum = Number(value);
  if (valueNum <= 0) return '';
  
  return 'has-value';
}

function viewCustomer(customerId) {
  emit('view-customer', customerId);
}

function sendReminder(customerId) {
  emit('send-reminder', customerId);
}

function sendAllReminders() {
  const overdueCustomers = props.agingData
    .filter(customer => (customer.days30 || 0) + (customer.days60 || 0) + (customer.days90 || 0) + (customer.days90Plus || 0) > 0)
    .map(customer => customer.id);
    
  emit('send-reminder', overdueCustomers);
}

function exportData() {
  // Placeholder for export functionality
  alert('Export functionality would be implemented here');
}
</script>

<style scoped>
.ar-aging-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.ar-aging-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.ar-aging-table th,
.ar-aging-table td {
  padding: 0.75rem;
  text-align: right;
  border-bottom: 1px solid var(--border-color);
}

.ar-aging-table th:first-child,
.ar-aging-table td:first-child {
  text-align: left;
  position: sticky;
  left: 0;
  background-color: var(--surface-color);
  z-index: 1;
}

.ar-aging-table thead th {
  font-weight: 600;
  color: var(--text-secondary-color);
  background-color: var(--surface-color);
  position: sticky;
  top: 0;
  z-index: 2;
}

.ar-aging-table thead th:first-child {
  z-index: 3;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
}

.customer-id {
  font-size: 0.75rem;
  color: var(--text-secondary-color);
}

.has-value {
  color: var(--error-color, #c62828);
  font-weight: 500;
}

.totals-row {
  background-color: var(--surface-alt-color, #f5f5f5);
  font-weight: 600;
}

.totals-row th {
  text-align: right;
}

.totals-row th:first-child {
  text-align: left;
}

.actions-cell {
  white-space: nowrap;
  text-align: center !important;
}

.btn-action {
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  color: var(--primary-color);
  transition: background-color 0.2s ease;
}

.btn-action:hover {
  background-color: var(--primary-bg-color, #e3f2fd);
}

.empty-state, .loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary-color);
}

.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* Hover effects for table rows */
.ar-aging-table tbody tr:hover {
  background-color: var(--hover-bg-color, rgba(0, 0, 0, 0.02));
}

/* Responsive styles */
@media (max-width: 1200px) {
  .ar-aging-table {
    font-size: 0.8rem;
  }
  
  .ar-aging-table th,
  .ar-aging-table td {
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .ar-aging-table-wrapper {
    overflow-x: auto;
    margin: 0 -1rem;
    padding: 0 1rem;
  }
  
  .ar-aging-table {
    min-width: 768px;
  }
  
  .table-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .table-actions button {
    margin-bottom: 0.5rem;
  }
}

/* Color coding for aging columns */
.ar-aging-table td:nth-child(3),
.ar-aging-table th:nth-child(3) {
  background-color: rgba(255, 235, 59, 0.05);
}

.ar-aging-table td:nth-child(4),
.ar-aging-table th:nth-child(4) {
  background-color: rgba(255, 152, 0, 0.05);
}

.ar-aging-table td:nth-child(5),
.ar-aging-table th:nth-child(5) {
  background-color: rgba(255, 87, 34, 0.05);
}

.ar-aging-table td:nth-child(6),
.ar-aging-table th:nth-child(6) {
  background-color: rgba(198, 40, 40, 0.05);
}

/* Print styles */
@media print {
  .ar-aging-table-wrapper {
    overflow: visible;
  }
  
  .ar-aging-table {
    width: 100%;
    page-break-inside: auto;
  }
  
  .ar-aging-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  
  .table-actions,
  .btn-action {
    display: none;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 