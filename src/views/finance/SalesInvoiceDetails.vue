<template>
  <div class="invoice-details p-4">
    <div v-if="isLoading" class="p-card p-4 flex justify-content-center">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="invoice" class="p-grid">
      <!-- Invoice Header -->
      <div class="p-col-12">
        <div class="p-card p-4 mb-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <h1 class="m-0">Invoice #{{ invoice.invoiceNumber }}</h1>
              <p class="text-sm text-500 mt-2 mb-0">Created on {{ formatDate(invoice.date) }}</p>
            </div>
            <div>
              <Tag :severity="getStatusSeverity(invoice.status)" class="mr-2 invoice-status">
                {{ invoice.status }}
              </Tag>
              <span v-if="invoice.status === 'Overdue'" class="text-danger mr-2">
                {{ getDaysOverdue(invoice.dueDate) }} days overdue
              </span>
              <div class="invoice-actions mt-2">
                <Button v-if="invoice.status !== 'Paid'" label="Record Payment" icon="pi pi-dollar" class="p-button-outlined mr-2" @click="showPaymentDialog = true" />
                <Button label="Download PDF" icon="pi pi-download" class="p-button-outlined mr-2" @click="onDownloadPdf" />
                <Button v-if="invoice.status !== 'Paid'" label="Send Reminder" icon="pi pi-send" class="p-button-outlined" @click="onSendReminder" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Invoice Details -->
      <div class="p-col-12 p-lg-8">
        <div class="p-card p-4">
          <h2>Invoice Information</h2>
          
          <div class="p-grid">
            <!-- Customer Info -->
            <div class="p-col-12 p-md-6">
              <h3>Customer</h3>
              <div class="customer-info mb-4">
                <strong>{{ invoice.customerName }}</strong>
                <p class="m-0">{{ invoice.customerAddress }}</p>
                <p class="m-0">{{ invoice.customerCity }}, {{ invoice.customerState }} {{ invoice.customerPostalCode }}</p>
                <p class="m-0">{{ invoice.customerCountry }}</p>
                <p class="m-0">{{ invoice.customerEmail }}</p>
                <p class="m-0">{{ invoice.customerPhone }}</p>
                <router-link :to="`/finance/customers/${invoice.customerId}`" class="mt-2 block">
                  View Customer Details
                </router-link>
              </div>
            </div>
            
            <!-- Invoice Details -->
            <div class="p-col-12 p-md-6">
              <h3>Invoice Details</h3>
              <div class="invoice-info mb-4">
                <div class="info-row">
                  <span class="text-500">Invoice Number:</span>
                  <span>{{ invoice.invoiceNumber }}</span>
                </div>
                <div class="info-row">
                  <span class="text-500">Issue Date:</span>
                  <span>{{ formatDate(invoice.date) }}</span>
                </div>
                <div class="info-row">
                  <span class="text-500">Due Date:</span>
                  <span>{{ formatDate(invoice.dueDate) }}</span>
                </div>
                <div class="info-row">
                  <span class="text-500">Payment Terms:</span>
                  <span>{{ invoice.paymentTerms }}</span>
                </div>
                <div class="info-row">
                  <span class="text-500">PO Number:</span>
                  <span>{{ invoice.poNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Line Items -->
            <div class="p-col-12">
              <h3>Line Items</h3>
              <DataTable :value="invoice.lineItems" :loading="isLoading" class="p-datatable-sm" responsiveLayout="scroll">
                <Column field="description" header="Description"></Column>
                <Column field="quantity" header="Quantity" class="text-right">
                  <template #body="{ data }">
                    {{ data.quantity }}
                  </template>
                </Column>
                <Column field="unitPrice" header="Unit Price" class="text-right">
                  <template #body="{ data }">
                    {{ formatCurrency(data.unitPrice) }}
                  </template>
                </Column>
                <Column field="amount" header="Amount" class="text-right">
                  <template #body="{ data }">
                    {{ formatCurrency(data.quantity * data.unitPrice) }}
                  </template>
                </Column>
              </DataTable>
            </div>
            
            <!-- Invoice Notes -->
            <div class="p-col-12 mt-4">
              <h3>Notes</h3>
              <div class="notes p-3 surface-100 border-round">
                {{ invoice.notes || 'No notes for this invoice.' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Invoice Summary -->
      <div class="p-col-12 p-lg-4">
        <div class="p-card p-4 mb-3">
          <h2>Invoice Summary</h2>
          <div class="invoice-summary">
            <div class="info-row">
              <span class="text-500">Subtotal:</span>
              <span>{{ formatCurrency(invoice.subtotal) }}</span>
            </div>
            <div class="info-row">
              <span class="text-500">Tax ({{ invoice.taxRate }}%):</span>
              <span>{{ formatCurrency(invoice.taxAmount) }}</span>
            </div>
            <div class="info-row font-bold">
              <span>Total:</span>
              <span>{{ formatCurrency(invoice.total) }}</span>
            </div>
            <div class="info-row" v-if="invoice.amountPaid > 0">
              <span class="text-500">Amount Paid:</span>
              <span>{{ formatCurrency(invoice.amountPaid) }}</span>
            </div>
            <div class="info-row font-bold" v-if="invoice.status !== 'Paid'">
              <span>Balance Due:</span>
              <span>{{ formatCurrency(invoice.total - invoice.amountPaid) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Payment History -->
        <div class="p-card p-4">
          <h2>Payment History</h2>
          <div v-if="invoice.paymentHistory && invoice.paymentHistory.length > 0">
            <div v-for="(payment, index) in invoice.paymentHistory" :key="index" class="payment-item p-3 mb-2 surface-100 border-round">
              <div class="payment-date">{{ formatDate(payment.date) }}</div>
              <div class="payment-amount font-bold">{{ formatCurrency(payment.amount) }}</div>
              <div class="payment-method text-sm text-500">{{ payment.method }}</div>
              <div v-if="payment.reference" class="payment-reference text-sm text-500">
                Ref: {{ payment.reference }}
              </div>
            </div>
          </div>
          <div v-else class="p-3 surface-100 border-round">
            <p class="m-0 text-center">No payments recorded yet.</p>
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
            <h2 class="mt-0 mb-2">Invoice Not Found</h2>
            <p class="m-0">The invoice you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button label="Go Back" icon="pi pi-arrow-left" class="mt-3" @click="$router.back()" />
          </div>
        </div>
      </Message>
    </div>
    
    <!-- Payment Dialog -->
    <Dialog v-model:visible="showPaymentDialog" header="Record Payment" :style="{width: '450px'}" :modal="true">
      <div class="p-fluid">
        <div class="field">
          <label for="paymentAmount">Payment Amount</label>
          <InputNumber id="paymentAmount" v-model="paymentAmount" :max="invoice?.total - invoice?.amountPaid" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="field">
          <label for="paymentDate">Payment Date</label>
          <Calendar id="paymentDate" v-model="paymentDate" dateFormat="mm/dd/yy" />
        </div>
        <div class="field">
          <label for="paymentMethod">Payment Method</label>
          <Dropdown id="paymentMethod" v-model="paymentMethod" :options="paymentMethods" optionLabel="name" optionValue="value" placeholder="Select a payment method" />
        </div>
        <div class="field">
          <label for="paymentReference">Reference (Optional)</label>
          <InputText id="paymentReference" v-model="paymentReference" placeholder="Check number, transaction ID, etc." />
        </div>
        <div class="field">
          <label for="paymentNotes">Notes (Optional)</label>
          <Textarea id="paymentNotes" v-model="paymentNotes" rows="3" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showPaymentDialog = false" />
        <Button label="Record Payment" icon="pi pi-check" class="p-button-primary" @click="onRecordPayment" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const route = useRoute();
const router = useRouter();
const invoiceId = computed(() => route.params.id);

// State
const invoice = ref(null);
const isLoading = ref(true);

// Payment dialog state
const showPaymentDialog = ref(false);
const paymentAmount = ref(0);
const paymentDate = ref(new Date());
const paymentMethod = ref(null);
const paymentReference = ref('');
const paymentNotes = ref('');
const paymentMethods = [
  { name: 'Credit Card', value: 'credit_card' },
  { name: 'Bank Transfer', value: 'bank_transfer' },
  { name: 'Check', value: 'check' },
  { name: 'Cash', value: 'cash' },
  { name: 'PayPal', value: 'paypal' },
  { name: 'Other', value: 'other' }
];

// Load invoice data
async function loadInvoice() {
  isLoading.value = true;
  try {
    // This would be an API call in a real app
    // Example: const response = await api.get(`/invoices/${invoiceId.value}`);
    // In this case we're mocking the data
    setTimeout(() => {
      invoice.value = {
        id: invoiceId.value,
        invoiceNumber: 'INV-2023-0125',
        customerId: '789',
        customerName: 'Acme Corporation',
        customerAddress: '123 Main Street',
        customerCity: 'Anytown',
        customerState: 'CA',
        customerPostalCode: '94105',
        customerCountry: 'United States',
        customerEmail: 'billing@acmecorp.com',
        customerPhone: '(555) 123-4567',
        date: new Date(2023, 6, 20),
        dueDate: new Date(2023, 7, 20),
        paymentTerms: 'Net 30',
        poNumber: 'PO-2023-4567',
        subtotal: 7500.00,
        taxRate: 8.25,
        taxAmount: 618.75,
        total: 8118.75,
        amountPaid: 0,
        status: 'Overdue',
        notes: 'Thank you for your business. Please contact us if you have any questions about this invoice.',
        lineItems: [
          {
            id: 1,
            description: 'Professional Services - Software Development',
            quantity: 30,
            unitPrice: 150.00
          },
          {
            id: 2,
            description: 'Server Hosting - Premium Tier',
            quantity: 1,
            unitPrice: 2000.00
          },
          {
            id: 3,
            description: 'Support Services - Priority',
            quantity: 1,
            unitPrice: 1000.00
          }
        ],
        paymentHistory: []
      };
      isLoading.value = false;
      
      // If we have an outstanding balance, set the payment amount to that
      if (invoice.value.total > invoice.value.amountPaid) {
        paymentAmount.value = invoice.value.total - invoice.value.amountPaid;
      }
      
    }, 1000);
  } catch (error) {
    console.error('Error loading invoice:', error);
    isLoading.value = false;
  }
}

// Event handlers
function onRecordPayment() {
  // In a real app, this would make an API call to record the payment
  console.log('Recording payment', {
    invoiceId: invoice.value.id,
    amount: paymentAmount.value,
    date: paymentDate.value,
    method: paymentMethod.value,
    reference: paymentReference.value,
    notes: paymentNotes.value
  });
  
  // For demo purposes, we'll update the invoice locally
  invoice.value.paymentHistory.push({
    date: paymentDate.value,
    amount: paymentAmount.value,
    method: paymentMethods.find(m => m.value === paymentMethod.value)?.name || paymentMethod.value,
    reference: paymentReference.value,
    notes: paymentNotes.value
  });
  
  invoice.value.amountPaid += paymentAmount.value;
  
  // Update the status
  if (invoice.value.amountPaid >= invoice.value.total) {
    invoice.value.status = 'Paid';
  } else if (invoice.value.amountPaid > 0) {
    invoice.value.status = 'Partially Paid';
  }
  
  // Reset and close the payment dialog
  paymentAmount.value = invoice.value.total - invoice.value.amountPaid > 0 ? invoice.value.total - invoice.value.amountPaid : 0;
  paymentReference.value = '';
  paymentNotes.value = '';
  showPaymentDialog.value = false;
}

function onDownloadPdf() {
  // In a real app, this would generate and download a PDF
  console.log('Downloading PDF for invoice:', invoice.value.id);
}

function onSendReminder() {
  // In a real app, this would send a reminder email
  console.log('Sending reminder for invoice:', invoice.value.id);
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

function getDaysOverdue(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = Math.abs(today - due);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Load data on component mount
onMounted(() => {
  loadInvoice();
});
</script>

<style scoped>
.invoice-details .info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-200);
}

.invoice-details .info-row:last-child {
  border-bottom: none;
}

.invoice-details .invoice-status {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.invoice-details .text-danger {
  color: var(--red-500);
}

.invoice-details .payment-item {
  position: relative;
}

.invoice-details .payment-amount {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .invoice-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
  
  .invoice-actions .p-button {
    margin-right: 0 !important;
  }
  
  .invoice-details .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style> 