<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>
    
    <div class="stats-grid">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <div class="stat-icon" :style="{ backgroundColor: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <Card class="chart-card">
        <template #title>Monthly Activity</template>
        <template #content>
          <div class="chart-placeholder">
            <i class="pi pi-chart-bar"></i>
            <p>Chart will be displayed here</p>
          </div>
        </template>
      </Card>
      
      <Card class="activity-card">
        <template #title>Recent Activity</template>
        <template #content>
          <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
            <i :class="activity.icon" class="activity-icon"></i>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="tasks-card">
        <template #title>Pending Tasks</template>
        <template #content>
          <div v-for="(task, index) in tasks" :key="index" class="task-item">
            <Checkbox v-model="task.completed" :binary="true" />
            <span class="task-text" :class="{ 'completed': task.completed }">{{ task.text }}</span>
          </div>
          <div class="add-task">
            <Button label="Add Task" icon="pi pi-plus" class="p-button-sm" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const stats = ref([
  { label: 'Users', value: '256', icon: 'pi pi-users', color: 'var(--p-primary-500)' },
  { label: 'Revenue', value: '$8,256', icon: 'pi pi-dollar', color: 'var(--p-success-500)' },
  { label: 'Tasks', value: '12', icon: 'pi pi-check-square', color: 'var(--p-info-500)' },
  { label: 'Messages', value: '48', icon: 'pi pi-envelope', color: 'var(--p-warning-500)' }
])

const recentActivity = ref([
  { text: 'John Smith completed project setup', time: '2 hours ago', icon: 'pi pi-check-circle' },
  { text: 'Sarah Johnson added new task', time: '4 hours ago', icon: 'pi pi-plus' },
  { text: 'New user registered', time: 'Yesterday', icon: 'pi pi-user-plus' },
  { text: 'System update completed', time: '2 days ago', icon: 'pi pi-refresh' }
])

const tasks = ref([
  { text: 'Complete dashboard design', completed: false },
  { text: 'Fix login page validation', completed: true },
  { text: 'Implement user settings page', completed: false },
  { text: 'Write API documentation', completed: false },
  { text: 'Plan next feature release', completed: false }
])
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--p-surface-0);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 1rem;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  line-height: 1.2;
}

.stat-label {
  margin: 0;
  color: var(--p-surface-600);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

.chart-card {
  grid-column: 1 / 3;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: var(--p-surface-50);
  border-radius: 0.5rem;
  color: var(--p-surface-500);
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--p-surface-100);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.25rem;
  color: var(--p-primary-500);
  margin-right: 0.75rem;
  margin-top: 0.25rem;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: var(--p-surface-500);
}

.task-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--p-surface-100);
}

.task-item:last-child {
  border-bottom: none;
}

.task-text {
  margin-left: 0.75rem;
}

.task-text.completed {
  text-decoration: line-through;
  color: var(--p-surface-500);
}

.add-task {
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    grid-column: 1 / 2;
  }
}
</style> 