// API utility functions for OrganizeIT platform
import { toast } from "sonner@2.0.3"
import { projectId, publicAnonKey } from './supabase/info'

// Supabase Edge Function URL
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a`

// Generic API request handler with real error handling
async function apiRequest(
  endpoint: string, 
  options: RequestInit = {},
  showToast = true
): Promise<any> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Request failed: ${response.status}`
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      console.error(`API Error [${endpoint}]:`, errorMessage)
      
      if (showToast) {
        toast.error(errorMessage)
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log(`✓ API Success [${endpoint}]`, data)
    
    if (showToast && (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE')) {
      const message = data.message || 'Operation completed successfully'
      toast.success(message)
    }
    
    return data
  } catch (error) {
    console.error(`API Exception [${endpoint}]:`, error)
    
    if (showToast && !(error instanceof Error && error.message.includes('Request failed'))) {
      toast.error('Network error. Please check your connection.')
    }
    
    throw error
  }
}

// IT Operations API functions
export const operationsAPI = {
  // Get operations data (using metrics and alerts endpoints)
  async getOperationsData() {
    const [metrics, alerts, services] = await Promise.all([
      apiRequest('/metrics/dashboard', { method: 'GET' }, false),
      apiRequest('/alerts/current', { method: 'GET' }, false),
      apiRequest('/services/health', { method: 'GET' }, false)
    ])
    return { metrics, alerts, services }
  },

  // Restart a service
  async restartService(serviceId: string) {
    return apiRequest('/services/restart', {
      method: 'POST',
      body: JSON.stringify({ serviceId })
    })
  },

  // Resolve an alert
  async resolveAlert(alertId: string, resolution: string) {
    return apiRequest(`/alerts/${alertId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Resolved', resolution })
    })
  },

  // Scale a service
  async scaleService(serviceId: string, instances: number) {
    return apiRequest('/services/scale', {
      method: 'POST',
      body: JSON.stringify({ serviceId, instances })
    })
  }
}

// FinOps API functions
export const finopsAPI = {
  // Get FinOps data
  async getFinOpsData() {
    const [costs, optimization] = await Promise.all([
      apiRequest('/finops/costs', { method: 'GET' }, false),
      apiRequest('/finops/optimization', { method: 'GET' }, false)
    ])
    return { costs, optimization }
  },

  // Apply cost optimization
  async applyOptimization(optimizationId: string) {
    return apiRequest('/finops/apply-optimization', {
      method: 'POST',
      body: JSON.stringify({ optimizationId })
    })
  },

  // Set budget alert
  async setBudgetAlert(threshold: number, email: string) {
    return apiRequest('/finops/set-budget-alert', {
      method: 'POST',
      body: JSON.stringify({ threshold, email })
    })
  },

  // Export financial report
  async exportReport(reportType: string, dateRange: any, format: string) {
    return apiRequest('/finops/export-report', {
      method: 'POST',
      body: JSON.stringify({ reportType, dateRange, format })
    })
  }
}

// ESG API functions
export const esgAPI = {
  // Get ESG data
  async getESGData() {
    const [carbon, sustainability] = await Promise.all([
      apiRequest('/esg/carbon', { method: 'GET' }, false),
      apiRequest('/esg/sustainability', { method: 'GET' }, false)
    ])
    return { carbon, sustainability }
  },

  // Update ESG target
  async updateTarget(target: string, value: number) {
    return apiRequest('/esg/update-target', {
      method: 'POST',
      body: JSON.stringify({ target, value })
    })
  },

  // Generate ESG report
  async generateReport(period: string, scope: string[]) {
    return apiRequest('/esg/generate-report', {
      method: 'POST',
      body: JSON.stringify({ period, scope })
    })
  }
}

// Project Management API functions
export const projectsAPI = {
  // Get projects data
  async getProjectsData() {
    return apiRequest('/projects', { method: 'GET' }, false)
  },

  // Update project status
  async updateProjectStatus(projectId: string, status: string, notes?: string) {
    return apiRequest('/projects/update-status', {
      method: 'POST',
      body: JSON.stringify({ projectId, status, notes })
    })
  },

  // Create new project
  async createProject(projectData: {
    name: string
    description: string
    priority: string
    budget: number
    team_size: number
    end_date: string
  }) {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    })
  },

  // Create new task
  async createTask(taskData: {
    title: string
    project: string
    assignee: string
    priority: string
    dueDate: string
    description?: string
  }) {
    return apiRequest('/projects/create-task', {
      method: 'POST',
      body: JSON.stringify(taskData)
    })
  },

  // Get project details
  async getProjectDetails(projectId: string) {
    return apiRequest(`/projects/${projectId}/details`, { method: 'GET' }, false)
  },

  // Edit task
  async editTask(taskId: string, updates: {
    status?: string
    assignee?: string
    priority?: string
    dueDate?: string
    notes?: string
  }) {
    return apiRequest(`/projects/tasks/${taskId}/edit`, {
      method: 'POST',
      body: JSON.stringify(updates)
    })
  },

  // Send team message
  async sendTeamMessage(userId: string, message: string, channel?: string) {
    return apiRequest('/team/message', {
      method: 'POST',
      body: JSON.stringify({ userId, message, channel })
    })
  }
}

// AI Insights API functions
export const aiAPI = {
  // Run AI analysis
  async runAnalysis(dataType: string, parameters?: any) {
    return apiRequest('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ dataType, parameters })
    })
  },

  // Run AI optimization
  async runOptimization(optimization_type: string, target_metric: string) {
    return apiRequest('/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ optimization_type, target_metric })
    })
  },

  // Train AI model
  async trainModel(model_name: string, training_data?: any, parameters?: any) {
    return apiRequest('/ai/train-model', {
      method: 'POST',
      body: JSON.stringify({ model_name, training_data, parameters })
    })
  },

  // Generate AI report
  async generateReport(report_type: string, time_period: string, include_predictions = true) {
    return apiRequest('/ai/generate-report', {
      method: 'POST',
      body: JSON.stringify({ report_type, time_period, include_predictions })
    })
  },

  // Dismiss AI insight
  async dismissInsight(insightId: string, reason?: string) {
    return apiRequest('/ai/dismiss-insight', {
      method: 'POST',
      body: JSON.stringify({ insightId, reason })
    })
  },

  // Implement AI insight
  async implementInsight(insightId: string, implementation_plan?: any) {
    return apiRequest('/ai/implement-insight', {
      method: 'POST',
      body: JSON.stringify({ insightId, implementation_plan })
    })
  },

  // Retrain model
  async retrainModel(modelId: string, use_latest_data = true, training_parameters?: any) {
    return apiRequest(`/ai/models/${modelId}/retrain`, {
      method: 'POST',
      body: JSON.stringify({ use_latest_data, training_parameters })
    })
  },

  // Deploy model
  async deployModel(modelId: string, environment = 'production', rollout_strategy = 'gradual') {
    return apiRequest(`/ai/models/${modelId}/deploy`, {
      method: 'POST',
      body: JSON.stringify({ environment, rollout_strategy })
    })
  }
}

// Resource Optimization API functions
export const resourcesAPI = {
  // Configure auto-scaling
  async configureAutoScaling(resource_type: string, scaling_policy: any) {
    return apiRequest('/resources/auto-scale', {
      method: 'POST',
      body: JSON.stringify({ resource_type, scaling_policy })
    })
  },

  // Start resource cleanup
  async startCleanup(resource_types: string[]) {
    return apiRequest('/resources/cleanup', {
      method: 'POST',
      body: JSON.stringify({ resource_types })
    })
  },

  // Schedule optimization
  async scheduleOptimization(optimization_type: string, schedule_time: string, resources?: string[], parameters?: any) {
    return apiRequest('/resources/schedule-optimization', {
      method: 'POST',
      body: JSON.stringify({ optimization_type, schedule_time, resources, parameters })
    })
  },

  // Apply all recommendations
  async applyAllRecommendations(confirm_apply = true, exclude_high_risk = false) {
    return apiRequest('/resources/apply-all-recommendations', {
      method: 'POST',
      body: JSON.stringify({ confirm_apply, exclude_high_risk })
    })
  },

  // Get recommendation details
  async getRecommendationDetails(recommendationId: string) {
    return apiRequest(`/resources/recommendations/${recommendationId}/details`, { method: 'GET' }, false)
  },

  // Implement recommendation
  async implementRecommendation(recommendationId: string, confirm_implementation = true, rollback_plan?: any) {
    return apiRequest(`/resources/recommendations/${recommendationId}/implement`, {
      method: 'POST',
      body: JSON.stringify({ confirm_implementation, rollback_plan })
    })
  },

  // Configure workload scheduling
  async configureWorkload(workload_name: string, schedule_config: any, carbon_aware = true, cost_optimization = true) {
    return apiRequest('/resources/workload-configure', {
      method: 'POST',
      body: JSON.stringify({ workload_name, schedule_config, carbon_aware, cost_optimization })
    })
  }
}

// Identity Management API functions
export const identityAPI = {
  // Reset user password
  async resetPassword(userId: string, email: string) {
    return apiRequest('/identity/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId, email })
    })
  },

  // Update user permissions
  async updatePermissions(userId: string, permissions: string[]) {
    return apiRequest('/identity/update-permissions', {
      method: 'POST',
      body: JSON.stringify({ userId, permissions })
    })
  },

  // Export users
  async exportUsers(format = 'csv', filters?: any, include_sensitive = false) {
    return apiRequest('/identity/export-users', {
      method: 'POST',
      body: JSON.stringify({ format, filters, include_sensitive })
    })
  },

  // Add new user
  async addUser(userData: {
    name: string
    email: string
    role: string
    permissions: string[]
    send_invite?: boolean
  }) {
    return apiRequest('/identity/add-user', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  // Manage user
  async manageUser(userId: string, action: string, updates?: {
    permissions?: string[]
    role?: string
    status?: string
  }) {
    return apiRequest(`/identity/users/${userId}/manage`, {
      method: 'POST',
      body: JSON.stringify({ action, ...updates })
    })
  },

  // Verify credential
  async verifyCredential(credentialId: string, verification_method = 'blockchain') {
    return apiRequest(`/identity/credentials/${credentialId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verification_method })
    })
  },

  // Renew credential
  async renewCredential(credentialId: string, renewal_period = '12 months', auto_renew = false) {
    return apiRequest(`/identity/credentials/${credentialId}/renew`, {
      method: 'POST',
      body: JSON.stringify({ renewal_period, auto_renew })
    })
  }
}

// Notifications API functions
export const notificationsAPI = {
  // Get notifications
  async getNotifications() {
    return apiRequest('/notifications', { method: 'GET' }, false)
  },

  // Mark notifications as read
  async markAsRead(notificationIds: string[]) {
    // Mark each notification individually
    const promises = notificationIds.map(id => 
      apiRequest(`/notifications/${id}/read`, {
        method: 'PUT',
        body: JSON.stringify({ read: true })
      })
    )
    return Promise.all(promises)
  },

  // Configure notification preferences
  async configureNotifications(channels: string[], frequency: string, types: string[]) {
    return apiRequest('/notifications/configure', {
      method: 'POST',
      body: JSON.stringify({ channels, frequency, types })
    })
  }
}

// Search API functions
export const searchAPI = {
  // Global search
  async search(query: string, filters?: any) {
    return apiRequest('/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters })
    }, false)
  }
}

// Export API functions
export const exportAPI = {
  // Export module data
  async exportData(module: string, format: string, dateRange?: any, includeCharts = true) {
    return apiRequest('/export', {
      method: 'POST',
      body: JSON.stringify({ module, format, dateRange, includeCharts })
    })
  }
}

// Bulk operations API functions
export const bulkAPI = {
  // Execute bulk actions
  async executeBulkAction(action: string, items: string[], parameters?: any) {
    return apiRequest('/bulk-actions', {
      method: 'POST',
      body: JSON.stringify({ action, items, parameters })
    })
  }
}

// Admin dashboard API functions
export const adminAPI = {
  // Get admin dashboard data
  async getDashboardData() {
    return apiRequest('/metrics/dashboard', { method: 'GET' }, false)
  },

  // Manage users
  async manageUsers(action: string = 'view', filters?: any) {
    return apiRequest('/admin/manage-users', {
      method: 'POST',
      body: JSON.stringify({ action, filters })
    })
  },

  // Run security audit
  async runAudit(audit_type: string = 'comprehensive', scope?: string[]) {
    return apiRequest('/admin/run-audit', {
      method: 'POST',
      body: JSON.stringify({ audit_type, scope })
    })
  },

  // Start system backup
  async startBackup(backup_type: string = 'full', include_databases = true, include_files = true) {
    return apiRequest('/admin/start-backup', {
      method: 'POST',
      body: JSON.stringify({ backup_type, include_databases, include_files })
    })
  },

  // Configure system
  async configureSystem(settings: any) {
    return apiRequest('/admin/configure-system', {
      method: 'POST',
      body: JSON.stringify({ settings })
    })
  },

  // Generate system reports
  async generateReports(report_types: string[] = ['system', 'security', 'performance', 'compliance']) {
    return apiRequest('/admin/generate-reports', {
      method: 'POST',
      body: JSON.stringify({ report_types })
    })
  },

  // Resolve critical issues
  async resolveIssues(issue_ids?: string[], auto_resolve = false) {
    return apiRequest('/admin/resolve-issues', {
      method: 'POST',
      body: JSON.stringify({ issue_ids, auto_resolve })
    })
  }
}

// Audit Trails API functions
export const auditAPI = {
  // Apply audit log filters
  async applyFilters(filters: any, date_range?: any, risk_levels?: string[], users?: string[], services?: string[]) {
    return apiRequest('/audit/filter', {
      method: 'POST',
      body: JSON.stringify({ filters, date_range, risk_levels, users, services })
    })
  },

  // Export audit logs
  async exportAuditLogs(format = 'csv', date_range?: any, include_blockchain = true, filters?: any) {
    return apiRequest('/audit/export', {
      method: 'POST',
      body: JSON.stringify({ format, date_range, include_blockchain, filters })
    })
  },

  // Search audit logs
  async searchLogs(query: string, filters?: any, search_type = 'comprehensive') {
    return apiRequest('/audit/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters, search_type })
    })
  },

  // Get audit log details
  async getLogDetails(logId: string) {
    return apiRequest(`/audit/${logId}/details`, { method: 'GET' }, false)
  }
}

// Health check
export const healthAPI = {
  async checkHealth() {
    return apiRequest('/health', { method: 'GET' }, false)
  }
}

// Data initialization
export const initAPI = {
  async initializeData() {
    return apiRequest('/init/data', { method: 'POST' }, false)
  },
  async checkInitialized() {
    return apiRequest('/init/status', { method: 'GET' }, false)
  }
}

// Utility function to handle loading states
export function withLoading<T extends any[]>(
  fn: (...args: T) => Promise<any>,
  loadingCallback?: (loading: boolean) => void
) {
  return async (...args: T) => {
    try {
      loadingCallback?.(true)
      const result = await fn(...args)
      return result
    } finally {
      loadingCallback?.(false)
    }
  }
}

// Error boundary for API calls
export function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorCallback?: (error: Error) => void
): Promise<T | null> {
  return operation().catch((error) => {
    console.error('Async operation failed:', error)
    errorCallback?.(error)
    return null
  })
}