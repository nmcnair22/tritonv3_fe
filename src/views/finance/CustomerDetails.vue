<template>
  <div class="customer-details p-4">
    <div v-if="isLoading" class="p-card p-4 flex justify-content-center">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="customer" class="p-grid">
      <!-- Customer Header -->
      <div class="p-col-12">
        <div class="p-card p-4 mb-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <h1 class="m-0">{{ customer.name }}</h1>
              <p class="text-sm text-500 mt-2 mb-0">Customer ID: {{ customer.id }}</p>
            </div>
            <div>
              <Button label="Edit Customer" icon="pi pi-pencil" class="p-button-outlined mr-2" @click="onEditCustomer" />
              <Button label="View All Invoices" icon="pi pi-list" @click="onViewAllInvoices" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Customer Info and Summary Cards -->
      <div class="p-col-12 p-md-4">
        <div class="p-card p-4 h-full">
          <h2>Customer Information</h2>
          <div class="customer-info mt-3">
            <div class="info-row mb-2">
              <span class="text-500">Company:</span>
              <span>{{ customer.company }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">Email:</span>
              <span>{{ customer.email }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">Phone:</span>
              <span>{{ customer.phone }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">Address:</span>
              <span>{{ customer.address }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">City:</span>
              <span>{{ customer.city }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">State/Province:</span>
              <span>{{ customer.state }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">Postal Code:</span>
              <span>{{ customer.postalCode }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">Country:</span>
              <span>{{ customer.country }}</span>
            </div>
            <div class="info-row mb-2">
              <span class="text-500">Tax ID:</span>
              <span>{{ customer.taxId || 'Not provided' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-col-12 p-md-8">
        <div class="p-grid">
          <!-- Financial Summary -->
          <div class="p-col-12 p-lg-4">
            <div class="p-card p-4 summary-card">
              <h3>Outstanding</h3>
              <div class="summary-value">{{ formatCurrency(customer.outstandingAmount) }}</div>
              <div class="text-sm text-500">Total unpaid invoices</div>
            </div>
          </div>
          
          <div class="p-col-12 p-lg-4">
            <div class="p-card p-4 summary-card">
              <h3>YTD Revenue</h3>
              <div class="summary-value">{{ formatCurrency(customer.ytdRevenue) }}</div>
              <div class="text-sm text-500">This year</div>
            </div>
          </div>
          
          <div class="p-col-12 p-lg-4">
            <div class="p-card p-4 summary-card">
              <h3>Lifetime Value</h3>
              <div class="summary-value">{{ formatCurrency(customer.lifetimeValue) }}</div>
              <div class="text-sm text-500">All time</div>
            </div>
          </div>
          
          <!-- Recent Invoices -->
          <div class="p-col-12">
            <div class="p-card p-4">
              <div class="flex justify-content-between align-items-center mb-3">
                <h2 class="m-0">Recent Invoices</h2>
                <Button 
                  label="View All" 
                  icon="pi pi-external-link" 
                  class="p-button-text" 
                  @click="onViewAllInvoices" 
                />
              </div>
              
              <SalesInvoicesList 
                :invoices="recentInvoices" 
                :isLoading="isLoadingInvoices"
                :isCompact="true"
                @view-invoice="onViewInvoice"
                @record-payment="onRecordPayment"
                @send-reminder="onSendReminder"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else class="p-card p-4">
      <Message severity="error" :closable="false">
        <div class="flex align-items-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem;"></i>
          <div>
            <h2 class="mt-0 mb-2">Customer Not Found</h2>
            <p class="m-0">The customer you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button label="Go Back" icon="pi pi-arrow-left" class="mt-3" @click="$router.back()" />
          </div>
        </div>
      </Message>
    </div>
    
    <!-- Invoice Dialog -->
    <Dialog v-model:visible="showInvoiceDialog" :style="{width: '80vw'}" :modal="true" :closable="true" :dismissableMask="true">
      <template #header>
        <h2 class="m-0">Invoice Details - {{ selectedInvoice?.invoiceNumber }}</h2>
      </template>
      
      <div v-if="selectedInvoice" class="p-fluid">
        <!-- Invoice details here -->
        <div class="p-grid">
          <div class="p-col-12 p-md-6">
            <div class="field">
              <label>Invoice Number</label>
              <div>{{ selectedInvoice.invoiceNumber }}</div>
            </div>
            <div class="field">
              <label>Customer</label>
              <div>{{ selectedInvoice.customerName }}</div>
            </div>
            <div class="field">
              <label>Date</label>
              <div>{{ formatDate(selectedInvoice.date) }}</div>
            </div>
            <div class="field">
              <label>Due Date</label>
              <div>{{ formatDate(selectedInvoice.dueDate) }}</div>
            </div>
          </div>
          <div class="p-col-12 p-md-6">
            <div class="field">
              <label>Status</label>
              <div>
                <Tag :severity="getStatusSeverity(selectedInvoice.status)">
                  {{ selectedInvoice.status }}
                </Tag>
              </div>
            </div>
            <div class="field">
              <label>Amount</label>
              <div>{{ formatCurrency(selectedInvoice.amount) }}</div>
            </div>
            <div class="field">
              <label>Paid</label>
              <div>{{ formatCurrency(selectedInvoice.amountPaid) }}</div>
            </div>
            <div class="field">
              <label>Balance</label>
              <div>{{ formatCurrency(selectedInvoice.amount - selectedInvoice.amountPaid) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="Close" icon="pi pi-times" class="p-button-text" @click="showInvoiceDialog = false" />
        <Button v-if="selectedInvoice?.status !== 'Paid'" label="Record Payment" icon="pi pi-dollar" @click="onRecordPayment(selectedInvoice)" />
        <Button label="View Full Invoice" icon="pi pi-external-link" @click="$router.push(`/finance/invoices/${selectedInvoice.id}`)" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import SalesInvoicesList from '@/components/finance/accountsReceivable/SalesInvoicesList.vue';

const route = useRoute();
const router = useRouter();
const customerId = computed(() => route.params.id);

// State
const customer = ref(null);
const isLoading = ref(true);
const recentInvoices = ref([]);
const isLoadingInvoices = ref(true);
const showInvoiceDialog = ref(false);
const selectedInvoice = ref(null);

// Load customer data
async function loadCustomer() {
  isLoading.value = true;
  try {
    // This would be an API call in a real app
    // Example: const response = await api.get(`/customers/${customerId.value}`);
    // In this case we're mocking the data
    setTimeout(() => {
      customer.value = {
        id: customerId.value,
        name: 'Acme Corporation',
        company: 'Acme Corporation',
        email: 'billing@acmecorp.com',
        phone: '(555) 123-4567',
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        postalCode: '94105',
        country: 'United States',
        taxId: 'US123456789',
        outstandingAmount: 12500.00,
        ytdRevenue: 85000.00,
        lifetimeValue: 237500.00
      };
      isLoading.value = false;
      loadRecentInvoices();
    }, 1000);
  } catch (error) {
    console.error('Error loading customer:', error);
    isLoading.value = false;
  }
}

// Load recent invoices
async function loadRecentInvoices() {
  isLoadingInvoices.value = true;
  try {
    // This would be an API call in a real app
    // Example: const response = await api.get(`/customers/${customerId.value}/invoices?limit=5`);
    setTimeout(() => {
      recentInvoices.value = [
        {
          id: '101',
          invoiceNumber: 'INV-2023-0101',
          customerName: 'Acme Corporation',
          customerId: customerId.value,
          date: new Date(2023, 5, 15),
          dueDate: new Date(2023, 6, 15),
          amount: 5000.00,
          amountPaid: 5000.00,
          remainingAmount: 0,
          status: 'Paid'
        },
        {
          id: '102',
          invoiceNumber: 'INV-2023-0125',
          customerName: 'Acme Corporation',
          customerId: customerId.value,
          date: new Date(2023, 6, 20),
          dueDate: new Date(2023, 7, 20),
          amount: 7500.00,
          amountPaid: 0,
          remainingAmount: 7500.00,
          status: 'Overdue'
        },
        {
          id: '103',
          invoiceNumber: 'INV-2023-0142',
          customerName: 'Acme Corporation',
          customerId: customerId.value,
          date: new Date(2023, 7, 10),
          dueDate: new Date(2023, 8, 10),
          amount: 5000.00,
          amountPaid: 0,
          remainingAmount: 5000.00,
          status: 'Outstanding'
        }
      ];
      isLoadingInvoices.value = false;
    }, 1500);
  } catch (error) {
    console.error('Error loading invoices:', error);
    isLoadingInvoices.value = false;
  }
}

// Event handlers
function onViewAllInvoices() {
  router.push({
    name: 'AccountsReceivable',
    query: { customer: customerId.value }
  });
}

function onViewInvoice(invoice) {
  selectedInvoice.value = invoice;
  showInvoiceDialog.value = true;
}

function onRecordPayment(invoice) {
  // In a real app, this would open a payment dialog or redirect to a payment page
  console.log('Recording payment for invoice:', invoice.id);
  // For demo purposes, we'll just show the invoice details
  selectedInvoice.value = invoice;
  showInvoiceDialog.value = true;
}

function onSendReminder(invoice) {
  // In a real app, this would send a reminder email
  console.log('Sending reminder for invoice:', invoice.id);
  // You could show a toast notification here
}

function onEditCustomer() {
  // In a real app, this would open a customer edit dialog or redirect to a customer edit page
  console.log('Editing customer:', customerId.value);
}

// Utility functions
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function getStatusSeverity(status) {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Outstanding':
      return 'info';
    case 'Overdue':
      return 'danger';
    case 'Partially Paid':
      return 'warning';
    default:
      return 'info';
  }
}

// Load data on component mount
onMounted(() => {
  loadCustomer();
});
</script>

<style scoped>
.customer-details .info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-200);
}

.customer-details .info-row:last-child {
  border-bottom: none;
}

.customer-details .summary-card {
  height: 100%;
}

.customer-details .summary-card .summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .customer-details .info-row {
    flex-direction: column;
  }
  
  .customer-details .info-row .text-500 {
    margin-bottom: 0.25rem;
  }
}
</style> 