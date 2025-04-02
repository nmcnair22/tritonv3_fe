<template>
  <div class="sales-invoices-list">
    <DataTable 
      :value="invoices" 
      :loading="isLoading"
      class="p-datatable-sm"
      stripedRows
      responsiveLayout="scroll"
    >
      <Column field="invoiceNumber" header="Invoice #" sortable>
        <template #body="slotProps">
          <div class="invoice-number">
            <a href="#" @click.prevent="viewInvoice(slotProps.data)">
              {{ slotProps.data.invoiceNumber }}
            </a>
          </div>
        </template>
      </Column>
      
      <Column field="customerName" header="Customer" sortable>
        <template #body="slotProps">
          <div class="customer-name">
            {{ slotProps.data.customerName }}
          </div>
        </template>
      </Column>
      
      <Column field="date" header="Date" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date) }}
        </template>
      </Column>
      
      <Column field="dueDate" header="Due Date" sortable>
        <template #body="slotProps">
          <span :class="{ 'text-danger': isOverdue(slotProps.data) }">
            {{ formatDate(slotProps.data.dueDate) }}
          </span>
        </template>
      </Column>
      
      <Column field="amount" header="Amount" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount) }}
        </template>
      </Column>
      
      <Column v-if="!isCompact" field="remainingAmount" header="Remaining" sortable>
        <template #body="slotProps">
          <span :class="{ 'text-danger': slotProps.data.remainingAmount > 0 }">
            {{ formatCurrency(slotProps.data.remainingAmount) }}
          </span>
        </template>
      </Column>
      
      <Column field="status" header="Status" sortable>
        <template #body="slotProps">
          <Tag 
            :value="slotProps.data.status" 
            :severity="getStatusSeverity(slotProps.data.status)" 
          />
        </template>
      </Column>
      
      <Column v-if="!isCompact" header="Actions">
        <template #body="slotProps">
          <div class="invoice-actions">
            <Button 
              icon="pi pi-eye" 
              class="p-button-rounded p-button-text p-button-sm" 
              v-tooltip="'View Invoice'"
              @click="viewInvoice(slotProps.data)"
            />
            
            <Button 
              v-if="slotProps.data.status !== 'Paid' && slotProps.data.remainingAmount > 0"
              icon="pi pi-dollar" 
              class="p-button-rounded p-button-text p-button-sm" 
              v-tooltip="'Record Payment'"
              @click="recordPayment(slotProps.data)"
            />
            
            <Button 
              v-if="slotProps.data.status === 'Overdue'"
              icon="pi pi-envelope" 
              class="p-button-rounded p-button-text p-button-sm" 
              v-tooltip="'Send Reminder'"
              @click="sendReminder(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const props = defineProps({
  invoices: {
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

const emit = defineEmits(['view-invoice', 'record-payment', 'send-reminder']);

// Format currency with USD
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value || 0);
}

// Format date to readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Check if an invoice is overdue
function isOverdue(invoice) {
  if (invoice.status === 'Paid') return false;
  
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  
  return dueDate < today;
}

// Get severity class for status tag
function getStatusSeverity(status) {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'overdue':
      return 'danger';
    case 'open':
      return 'info';
    default:
      return 'secondary';
  }
}

// Event handlers
function viewInvoice(invoice) {
  emit('view-invoice', invoice);
}

function recordPayment(invoice) {
  emit('record-payment', invoice);
}

function sendReminder(invoice) {
  emit('send-reminder', invoice);
}
</script>

<style scoped>
.sales-invoices-list {
  width: 100%;
}

.invoice-number a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.invoice-number a:hover {
  text-decoration: underline;
}

.text-danger {
  color: var(--red-500, #f44336);
}

.invoice-actions {
  display: flex;
  gap: 0.25rem;
}
</style> 