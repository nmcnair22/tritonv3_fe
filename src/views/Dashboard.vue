<template>
  <div class="dashboard">
    <!-- Page Title and Filter -->
    <div class="page-header">
      <h1>Dashboard</h1>
      <div class="time-filter">
        <span>{{ selectedPeriod }}</span>
        <Button icon="pi pi-chevron-down" text />
      </div>
    </div>
    
    <!-- Statistics Cards -->
    <div class="stat-cards">
      <!-- Active Projects -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Active Projects</h3>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.activeProjects.value }}</div>
          <div class="stat-trend up">
            <i class="pi pi-arrow-up"></i>
            <span>{{ stats.activeProjects.trend }}%</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="pi pi-briefcase"></i>
        </div>
        <div class="stat-footer">
          <div class="last-updated">
            <i class="pi pi-clock"></i>
            <span>Last updated: {{ stats.activeProjects.updated }}</span>
          </div>
        </div>
      </div>
      
      <!-- Completed Tasks -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Completed Tasks</h3>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedTasks.value }}</div>
          <div class="stat-trend up">
            <i class="pi pi-arrow-up"></i>
            <span>{{ stats.completedTasks.trend }}%</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="pi pi-check-square"></i>
        </div>
        <div class="stat-footer">
          <div class="last-updated">
            <i class="pi pi-clock"></i>
            <span>Last updated: {{ stats.completedTasks.updated }}</span>
          </div>
        </div>
      </div>
      
      <!-- Team Members -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Team Members</h3>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.teamMembers.value }}</div>
          <div class="stat-indicator">
            <span>+ New</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="stat-footer">
          <div class="last-updated">
            <i class="pi pi-user"></i>
            <span>{{ stats.teamMembers.info }}</span>
          </div>
        </div>
      </div>
      
      <!-- Budget Used -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Budget Used</h3>
        </div>
        <div class="stat-content">
          <div class="stat-value">${{ stats.budgetUsed.value.toLocaleString() }}</div>
          <div class="stat-trend up">
            <i class="pi pi-arrow-up"></i>
            <span>{{ stats.budgetUsed.trend }}%</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="stat-footer">
          <div class="last-updated">
            <i class="pi pi-clock"></i>
            <span>Last updated: {{ stats.budgetUsed.updated }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Project Progress Graph -->
    <div class="chart-card">
      <div class="card-header">
        <h3>Project Progress</h3>
        <div class="card-header-right">
          <div class="progress-summary">
            <div class="progress-percentage">{{ overallProgress }}%</div>
            <div class="progress-label">Overall</div>
            <div class="progress-trend up">
              <i class="pi pi-arrow-up"></i>
              <span>{{ progressTrend }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content">
        <!-- Chart component would go here -->
        <div class="chart-placeholder">
          <!-- In an actual implementation, you would use a Chart component here -->
          <div class="chart-image"></div>
        </div>
      </div>
    </div>
    
    <!-- Recent Tasks Table -->
    <div class="tasks-card">
      <div class="card-header">
        <h3>Recent Tasks</h3>
        <div class="card-header-right">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <InputText placeholder="Search Tasks" v-model="searchTasks" />
          </span>
        </div>
      </div>
      <div class="card-content">
        <table class="tasks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks" :key="task.id">
              <td class="task-id">{{ task.id }}</td>
              <td class="task-name">{{ task.name }}</td>
              <td class="task-project">{{ task.project }}</td>
              <td class="task-assignee">
                <div class="assignee">
                  <div class="assignee-avatar">{{ task.assigneeInitials }}</div>
                  <span>{{ task.assignee }}</span>
                </div>
              </td>
              <td class="task-status">
                <span class="status-badge" :class="task.statusClass">{{ task.status }}</span>
              </td>
              <td class="task-actions">
                <Button icon="pi pi-ellipsis-v" text rounded />
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination">
          <button class="pagination-button" disabled>
            <i class="pi pi-angle-double-left"></i>
          </button>
          <button class="pagination-button" disabled>
            <i class="pi pi-angle-left"></i>
          </button>
          
          <button class="pagination-button active">1</button>
          <button class="pagination-button">2</button>
          <button class="pagination-button">3</button>
          
          <button class="pagination-button">
            <i class="pi pi-angle-right"></i>
          </button>
          <button class="pagination-button">
            <i class="pi pi-angle-double-right"></i>
          </button>
          
          <div class="pagination-info">
            Showing 1 to 5 of 15 entries
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

// Dashboard state
const selectedPeriod = ref('This Week');
const searchTasks = ref('');

// Mock statistics data
const stats = ref({
  activeProjects: {
    value: 24,
    trend: 3,
    updated: '2 hours ago'
  },
  completedTasks: {
    value: 142,
    trend: 8,
    updated: '45 minutes ago'
  },
  teamMembers: {
    value: 8,
    info: '1 member joined this week'
  },
  budgetUsed: {
    value: 28450,
    trend: 12,
    updated: 'Today'
  }
});

// Project progress data
const overallProgress = ref(76);
const progressTrend = ref(2);

// Tasks data
const tasks = ref([
  {
    id: 'TASK-1001',
    name: 'Design UI mockups for client dashboard',
    project: 'Client Portal',
    assignee: 'Jane Cooper',
    assigneeInitials: 'JC',
    status: 'Completed',
    statusClass: 'completed'
  },
  {
    id: 'TASK-1002',
    name: 'Develop API integration for payment processing',
    project: 'Payment Gateway',
    assignee: 'Alex Johnson',
    assigneeInitials: 'AJ',
    status: 'In Progress',
    statusClass: 'in-progress'
  },
  {
    id: 'TASK-1003',
    name: 'QA Testing for mobile responsiveness',
    project: 'Mobile App',
    assignee: 'Emily Chen',
    assigneeInitials: 'EC',
    status: 'In Review',
    statusClass: 'in-review'
  },
  {
    id: 'TASK-1004',
    name: 'Implement user authentication flow',
    project: 'Client Portal',
    assignee: 'Michael Brown',
    assigneeInitials: 'MB',
    status: 'Pending',
    statusClass: 'pending'
  },
  {
    id: 'TASK-1005',
    name: 'Create documentation for API endpoints',
    project: 'API Gateway',
    assignee: 'Sarah Miller',
    assigneeInitials: 'SM',
    status: 'Completed',
    statusClass: 'completed'
  }
]);

// Computed
const filteredTasks = computed(() => {
  if (!searchTasks.value) return tasks.value;
  
  const searchTerm = searchTasks.value.toLowerCase();
  return tasks.value.filter(task => 
    task.name.toLowerCase().includes(searchTerm) || 
    task.project.toLowerCase().includes(searchTerm) ||
    task.assignee.toLowerCase().includes(searchTerm) ||
    task.status.toLowerCase().includes(searchTerm)
  );
});
</script>

<style scoped>
.dashboard {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.page-header h1 {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--white);
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Statistics Cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.stat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--dark-gray);
}

.stat-content {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.stat-trend.up {
  color: #4CAF50;
}

.stat-trend.down {
  color: #F44336;
}

.stat-indicator {
  font-size: 14px;
  color: var(--morning-blue);
  background-color: rgba(41, 127, 183, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.stat-icon {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 180, 0, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sunrise-yellow);
  font-size: 20px;
}

.stat-footer {
  margin-top: 16px;
  font-size: 12px;
  color: var(--dark-gray);
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Chart Card */
.chart-card, .tasks-card {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--medium-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-summary {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.progress-percentage {
  font-size: 20px;
  font-weight: 600;
}

.progress-label {
  font-size: 14px;
  color: var(--dark-gray);
}

.progress-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.progress-trend.up {
  color: #4CAF50;
}

.card-content {
  padding: 24px;
}

.chart-placeholder {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-image {
  width: 100%;
  height: 100%;
  background-image: url('/images/chart-placeholder.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Tasks Table */
.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: var(--dark-gray);
  border-bottom: 1px solid var(--medium-gray);
}

.tasks-table td {
  padding: 16px;
  border-bottom: 1px solid var(--medium-gray);
  font-size: 14px;
}

.tasks-table tr:last-child td {
  border-bottom: none;
}

.task-id {
  font-family: 'Courier New', monospace;
  color: var(--dark-gray);
}

.task-name {
  font-weight: 500;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assignee-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.status-badge.in-progress {
  background-color: rgba(3, 169, 244, 0.15);
  color: #03A9F4;
}

.status-badge.in-review {
  background-color: rgba(156, 39, 176, 0.15);
  color: #9C27B0;
}

.status-badge.pending {
  background-color: rgba(158, 158, 158, 0.15);
  color: #757575;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  padding: 16px 0 0 0;
  border-top: 1px solid var(--medium-gray);
  margin-top: 16px;
}

.pagination-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  margin-right: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled, .active) {
  background-color: var(--light-gray);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: var(--morning-blue);
  color: white;
  border-color: var(--morning-blue);
}

.pagination-info {
  margin-left: auto;
  font-size: 14px;
  color: var(--dark-gray);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-header-right {
    width: 100%;
  }
  
  .tasks-table {
    display: block;
    overflow-x: auto;
  }
}
</style>