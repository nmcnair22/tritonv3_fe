<template>
  <Card class="financial-summary-card">
    <template #title>
      <div class="card-title">
        <span>{{ title }}</span>
        <i 
          v-if="info" 
          class="pi pi-info-circle text-xs ml-2 cursor-pointer" 
          @click="showInfoModal = true"
        ></i>
      </div>
    </template>
    <template #content>
      <div class="summary-content">
        <div class="value-container">
          <div class="main-value" :class="valueColor">
            {{ formattedValue }}
          </div>
          <div v-if="comparisonValue" class="comparison-value" :class="comparisonDirectionClass">
            <i :class="comparisonIcon"></i>
            {{ formattedComparisonValue }}
          </div>
        </div>
        <div v-if="icon" class="summary-icon">
          <i :class="icon"></i>
        </div>
      </div>
    </template>
    <template #footer v-if="footerText">
      <div class="summary-footer">
        {{ footerText }}
      </div>
    </template>
  </Card>

  <Dialog 
    v-model:visible="showInfoModal" 
    header="Information"
    modal
    :style="{ width: '450px' }"
  >
    <p class="m-0">{{ info }}</p>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  valueColor: {
    type: String,
    default: 'text-primary'
  },
  valuePrefix: {
    type: String,
    default: ''
  },
  valueSuffix: {
    type: String,
    default: ''
  },
  comparisonValue: {
    type: Number,
    default: null
  },
  comparisonType: {
    type: String,
    default: 'percentage', // 'percentage', 'currency', 'number'
    validator: (value) => ['percentage', 'currency', 'number'].includes(value)
  },
  comparisonDirection: {
    type: String,
    default: null, // 'up', 'down', null for auto-detection
    validator: (value) => ['up', 'down', null].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    default: ''
  },
  info: {
    type: String,
    default: ''
  },
  formatOptions: {
    type: Object,
    default: () => ({
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    })
  }
});

const showInfoModal = ref(false);

const formattedValue = computed(() => {
  if (props.formatOptions.style === 'currency') {
    return props.valuePrefix + new Intl.NumberFormat('en-US', props.formatOptions).format(props.value) + props.valueSuffix;
  } else if (props.formatOptions.style === 'percent') {
    return props.valuePrefix + new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(props.value / 100) + props.valueSuffix;
  } else {
    return props.valuePrefix + new Intl.NumberFormat('en-US').format(props.value) + props.valueSuffix;
  }
});

const effectiveComparisonDirection = computed(() => {
  if (props.comparisonDirection) {
    return props.comparisonDirection;
  }
  return props.comparisonValue >= 0 ? 'up' : 'down';
});

const comparisonDirectionClass = computed(() => {
  return {
    'text-green-500': effectiveComparisonDirection.value === 'up',
    'text-red-500': effectiveComparisonDirection.value === 'down'
  };
});

const comparisonIcon = computed(() => {
  return effectiveComparisonDirection.value === 'up' 
    ? 'pi pi-arrow-up' 
    : 'pi pi-arrow-down';
});

const formattedComparisonValue = computed(() => {
  const absValue = Math.abs(props.comparisonValue);
  
  if (props.comparisonType === 'percentage') {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(absValue / 100);
  } else if (props.comparisonType === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(absValue);
  } else {
    return new Intl.NumberFormat('en-US').format(absValue);
  }
});
</script>

<style scoped>
.financial-summary-card {
  height: 100%;
}

.financial-summary-card :deep(.p-card-content) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.financial-summary-card :deep(.p-card-title) {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.card-title {
  display: flex;
  align-items: center;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-container {
  display: flex;
  flex-direction: column;
}

.main-value {
  font-size: 1.75rem;
  font-weight: 600;
}

.comparison-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.summary-icon {
  background-color: var(--primary-color);
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-icon i {
  font-size: 1.5rem;
}

.summary-footer {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}
</style> 