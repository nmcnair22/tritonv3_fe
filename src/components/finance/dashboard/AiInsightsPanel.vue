<template>
  <Card class="ai-insights-panel">
    <template #title>
      <div class="panel-header">
        <div class="title-section">
          <span>{{ title }}</span>
          <Badge v-if="insights && insights.length" :value="insights.length" severity="info" />
        </div>
        <div class="refresh-section">
          <Button 
            icon="pi pi-refresh" 
            text 
            rounded 
            size="small" 
            :loading="isLoading" 
            @click="$emit('refresh')"
            v-tooltip.top="'Refresh insights'"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div v-if="isLoading" class="loading-container">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p>Analyzing your financial data...</p>
      </div>
      
      <div v-else-if="!insights || insights.length === 0" class="empty-state">
        <i class="pi pi-chart-line" style="font-size: 2rem"></i>
        <p>No financial insights available.</p>
        <p class="hint">Try adjusting your date range to get more insights.</p>
      </div>
      
      <div v-else class="insights-container">
        <TabView>
          <TabPanel v-for="insight in insights" :key="insight.id" :header="getTabHeader(insight)">
            <div class="insight-card" :class="getInsightTypeClass(insight.type)">
              <div class="insight-header">
                <i :class="getInsightIcon(insight.type)"></i>
                <h3>{{ insight.title }}</h3>
              </div>
              
              <p class="insight-description">{{ insight.description }}</p>
              
              <div v-if="insight.metrics && insight.metrics.length" class="insight-metrics">
                <div 
                  v-for="(metric, index) in insight.metrics" 
                  :key="index"
                  class="metric"
                >
                  <div class="metric-value">
                    {{ formatMetricValue(metric) }}
                  </div>
                  <div class="metric-label">{{ metric.label }}</div>
                </div>
              </div>
              
              <div v-if="insight.recommendations && insight.recommendations.length" class="recommendations">
                <h4>Recommendations</h4>
                <ul>
                  <li v-for="(rec, index) in insight.recommendations" :key="index">
                    {{ rec }}
                  </li>
                </ul>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  title: {
    type: String,
    default: 'AI Financial Insights'
  },
  insights: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['refresh']);

// Helper functions
function getInsightTypeClass(type) {
  const typeClasses = {
    trend: 'insight-trend',
    warning: 'insight-warning',
    opportunity: 'insight-opportunity',
    anomaly: 'insight-anomaly',
    forecast: 'insight-forecast'
  };
  
  return typeClasses[type] || '';
}

function getInsightIcon(type) {
  const typeIcons = {
    trend: 'pi pi-arrow-up',
    warning: 'pi pi-exclamation-triangle',
    opportunity: 'pi pi-star',
    anomaly: 'pi pi-exclamation-circle',
    forecast: 'pi pi-calendar'
  };
  
  return typeIcons[type] || 'pi pi-info-circle';
}

function getTabHeader(insight) {
  // Keep tab headers short
  const typeLabels = {
    trend: 'Trend',
    warning: 'Warning',
    opportunity: 'Opportunity',
    anomaly: 'Anomaly',
    forecast: 'Forecast'
  };
  
  return typeLabels[insight.type] || 'Insight';
}

function formatMetricValue(metric) {
  const value = metric.value;
  
  if (metric.format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  } else if (metric.format === 'percentage') {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  } else if (metric.format === 'number') {
    return new Intl.NumberFormat('en-US').format(value);
  }
  
  return value;
}
</script>

<style scoped>
.ai-insights-panel {
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color-secondary);
  text-align: center;
  height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color-secondary);
  text-align: center;
  height: 300px;
}

.empty-state .hint {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.insights-container {
  min-height: 300px;
}

.insight-card {
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid var(--primary-color);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.insight-header i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.insight-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.insight-description {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.insight-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.metric {
  min-width: 100px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
}

.recommendations {
  background-color: var(--surface-hover);
  border-radius: 4px;
  padding: 1rem;
}

.recommendations h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.recommendations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.recommendations li {
  margin-bottom: 0.5rem;
}

.recommendations li:last-child {
  margin-bottom: 0;
}

/* Insight type styles */
.insight-trend {
  border-left-color: var(--primary-color, #3B82F6);
}
.insight-trend .insight-header i {
  color: var(--primary-color, #3B82F6);
}

.insight-warning {
  border-left-color: var(--orange-500, #FB8C00);
}
.insight-warning .insight-header i {
  color: var(--orange-500, #FB8C00);
}

.insight-opportunity {
  border-left-color: var(--green-500, #4CAF50);
}
.insight-opportunity .insight-header i {
  color: var(--green-500, #4CAF50);
}

.insight-anomaly {
  border-left-color: var(--red-500, #EF5350);
}
.insight-anomaly .insight-header i {
  color: var(--red-500, #EF5350);
}

.insight-forecast {
  border-left-color: var(--purple-500, #9C27B0);
}
.insight-forecast .insight-header i {
  color: var(--purple-500, #9C27B0);
}
</style> 