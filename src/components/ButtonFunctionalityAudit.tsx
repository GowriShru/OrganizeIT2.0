import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CheckCircle, XCircle, Loader2, AlertTriangle, RefreshCw } from 'lucide-react'
import { toast } from "sonner@2.0.3"
import {
  operationsAPI,
  finopsAPI,
  esgAPI,
  projectsAPI,
  aiAPI,
  resourcesAPI,
  identityAPI,
  notificationsAPI,
  searchAPI,
  exportAPI,
  auditAPI,
  healthAPI,
  initAPI
} from '../utils/api'

interface TestResult {
  name: string
  status: 'pending' | 'testing' | 'success' | 'error'
  message?: string
  error?: string
}

export function ButtonFunctionalityAudit() {
  const [tests, setTests] = useState<Record<string, TestResult[]>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'complete'>('idle')

  const updateTest = (category: string, index: number, updates: Partial<TestResult>) => {
    setTests(prev => ({
      ...prev,
      [category]: prev[category]?.map((test, i) => 
        i === index ? { ...test, ...updates } : test
      ) || []
    }))
  }

  const initializeTests = () => {
    const testSuites: Record<string, TestResult[]> = {
      'System Health': [
        { name: 'Health Check API', status: 'pending' },
        { name: 'Data Initialization Check', status: 'pending' }
      ],
      'IT Operations': [
        { name: 'Get Operations Data', status: 'pending' },
        { name: 'Restart Service', status: 'pending' },
        { name: 'Scale Service', status: 'pending' },
        { name: 'Resolve Alert', status: 'pending' }
      ],
      'FinOps': [
        { name: 'Get FinOps Data', status: 'pending' },
        { name: 'Apply Optimization', status: 'pending' },
        { name: 'Set Budget Alert', status: 'pending' },
        { name: 'Export Financial Report', status: 'pending' }
      ],
      'ESG Monitoring': [
        { name: 'Get ESG Data', status: 'pending' },
        { name: 'Update ESG Target', status: 'pending' },
        { name: 'Generate ESG Report', status: 'pending' }
      ],
      'Project Collaboration': [
        { name: 'Get Projects Data', status: 'pending' },
        { name: 'Create Project', status: 'pending' },
        { name: 'Create Task', status: 'pending' },
        { name: 'Update Project Status', status: 'pending' },
        { name: 'Edit Task', status: 'pending' },
        { name: 'Send Team Message', status: 'pending' }
      ],
      'AI Insights': [
        { name: 'Run AI Analysis', status: 'pending' },
        { name: 'Run Optimization', status: 'pending' },
        { name: 'Train Model', status: 'pending' },
        { name: 'Generate Report', status: 'pending' },
        { name: 'Dismiss Insight', status: 'pending' },
        { name: 'Implement Insight', status: 'pending' },
        { name: 'Retrain Model', status: 'pending' },
        { name: 'Deploy Model', status: 'pending' }
      ],
      'Resource Optimization': [
        { name: 'Configure Auto-Scaling', status: 'pending' },
        { name: 'Start Cleanup', status: 'pending' },
        { name: 'Schedule Optimization', status: 'pending' },
        { name: 'Apply All Recommendations', status: 'pending' },
        { name: 'Get Recommendation Details', status: 'pending' },
        { name: 'Implement Recommendation', status: 'pending' },
        { name: 'Configure Workload', status: 'pending' }
      ],
      'Identity Management': [
        { name: 'Reset Password', status: 'pending' },
        { name: 'Update Permissions', status: 'pending' },
        { name: 'Export Users', status: 'pending' },
        { name: 'Add User', status: 'pending' },
        { name: 'Manage User', status: 'pending' },
        { name: 'Verify Credential', status: 'pending' },
        { name: 'Renew Credential', status: 'pending' }
      ],
      'Notifications': [
        { name: 'Get Notifications', status: 'pending' },
        { name: 'Mark as Read', status: 'pending' },
        { name: 'Configure Notifications', status: 'pending' }
      ],
      'Search & Export': [
        { name: 'Global Search', status: 'pending' },
        { name: 'Export Data', status: 'pending' }
      ],
      'Audit Trails': [
        { name: 'Apply Filters', status: 'pending' },
        { name: 'Export Audit Logs', status: 'pending' },
        { name: 'Search Logs', status: 'pending' },
        { name: 'Get Log Details', status: 'pending' }
      ]
    }
    
    setTests(testSuites)
  }

  useEffect(() => {
    initializeTests()
  }, [])

  const runAllTests = async () => {
    setIsRunning(true)
    setOverallStatus('running')
    initializeTests() // Reset all tests
    
    try {
      // System Health Tests
      await runTest('System Health', 0, async () => {
        const result = await healthAPI.checkHealth()
        return { success: true, message: `Status: ${result.status}` }
      })

      await runTest('System Health', 1, async () => {
        const result = await initAPI.checkInitialized()
        return { success: true, message: `Initialized: ${result.initialized}` }
      })

      // IT Operations Tests
      await runTest('IT Operations', 0, async () => {
        const result = await operationsAPI.getOperationsData()
        return { success: true, message: `Loaded ${result.alerts?.data?.length || 0} alerts` }
      })

      await runTest('IT Operations', 1, async () => {
        const result = await operationsAPI.restartService('test-service-001')
        return { success: true, message: result.message || 'Service restart initiated' }
      })

      await runTest('IT Operations', 2, async () => {
        const result = await operationsAPI.scaleService('test-service-001', 3)
        return { success: true, message: result.message || 'Service scaled to 3 instances' }
      })

      await runTest('IT Operations', 3, async () => {
        const result = await operationsAPI.resolveAlert('test-alert-001', 'Test resolution')
        return { success: true, message: result.message || 'Alert resolved' }
      })

      // FinOps Tests
      await runTest('FinOps', 0, async () => {
        const result = await finopsAPI.getFinOpsData()
        return { success: true, message: `Loaded cost data` }
      })

      await runTest('FinOps', 1, async () => {
        const result = await finopsAPI.applyOptimization('OPT-001')
        return { success: true, message: result.message || 'Optimization applied' }
      })

      await runTest('FinOps', 2, async () => {
        const result = await finopsAPI.setBudgetAlert(100000, 'test@example.com')
        return { success: true, message: result.message || 'Budget alert configured' }
      })

      await runTest('FinOps', 3, async () => {
        const result = await finopsAPI.exportReport('cost-analysis', { start: '2024-01-01', end: '2024-12-31' }, 'pdf')
        return { success: true, message: result.message || 'Report exported' }
      })

      // ESG Tests
      await runTest('ESG Monitoring', 0, async () => {
        const result = await esgAPI.getESGData()
        return { success: true, message: `Loaded ESG data` }
      })

      await runTest('ESG Monitoring', 1, async () => {
        const result = await esgAPI.updateTarget('carbon_reduction', 30)
        return { success: true, message: result.message || 'Target updated' }
      })

      await runTest('ESG Monitoring', 2, async () => {
        const result = await esgAPI.generateReport('quarterly', ['scope1', 'scope2'])
        return { success: true, message: result.message || 'ESG report generated' }
      })

      // Projects Tests
      await runTest('Project Collaboration', 0, async () => {
        const result = await projectsAPI.getProjectsData()
        return { success: true, message: `Loaded ${result.data?.projects?.length || 0} projects` }
      })

      await runTest('Project Collaboration', 1, async () => {
        const result = await projectsAPI.createProject({
          name: 'Test Project',
          description: 'Test project description',
          priority: 'High',
          budget: 50000,
          team_size: 5,
          end_date: '2024-12-31'
        })
        return { success: true, message: result.message || 'Project created' }
      })

      await runTest('Project Collaboration', 2, async () => {
        const result = await projectsAPI.createTask({
          title: 'Test Task',
          project: 'Test Project',
          assignee: 'Test User',
          priority: 'High',
          dueDate: '2024-12-31'
        })
        return { success: true, message: result.message || 'Task created' }
      })

      await runTest('Project Collaboration', 3, async () => {
        const result = await projectsAPI.updateProjectStatus('PRJ-001', 'In Progress', 'Test update')
        return { success: true, message: result.message || 'Project status updated' }
      })

      await runTest('Project Collaboration', 4, async () => {
        const result = await projectsAPI.editTask('TSK-001', { status: 'In Progress', notes: 'Test edit' })
        return { success: true, message: result.message || 'Task updated' }
      })

      await runTest('Project Collaboration', 5, async () => {
        const result = await projectsAPI.sendTeamMessage('user-001', 'Test message')
        return { success: true, message: result.message || 'Message sent' }
      })

      // AI Insights Tests
      await runTest('AI Insights', 0, async () => {
        const result = await aiAPI.runAnalysis('cost-optimization')
        return { success: true, message: result.message || 'Analysis completed' }
      })

      await runTest('AI Insights', 1, async () => {
        const result = await aiAPI.runOptimization('resource', 'cost')
        return { success: true, message: result.message || 'Optimization completed' }
      })

      await runTest('AI Insights', 2, async () => {
        const result = await aiAPI.trainModel('cost-predictor')
        return { success: true, message: result.message || 'Model training initiated' }
      })

      await runTest('AI Insights', 3, async () => {
        const result = await aiAPI.generateReport('insights', 'monthly', true)
        return { success: true, message: result.message || 'Report generated' }
      })

      await runTest('AI Insights', 4, async () => {
        const result = await aiAPI.dismissInsight('INS-001', 'Not applicable')
        return { success: true, message: result.message || 'Insight dismissed' }
      })

      await runTest('AI Insights', 5, async () => {
        const result = await aiAPI.implementInsight('INS-002')
        return { success: true, message: result.message || 'Insight implemented' }
      })

      await runTest('AI Insights', 6, async () => {
        const result = await aiAPI.retrainModel('model-001', true)
        return { success: true, message: result.message || 'Model retraining initiated' }
      })

      await runTest('AI Insights', 7, async () => {
        const result = await aiAPI.deployModel('model-001', 'production', 'gradual')
        return { success: true, message: result.message || 'Model deployment initiated' }
      })

      // Resource Optimization Tests
      await runTest('Resource Optimization', 0, async () => {
        const result = await resourcesAPI.configureAutoScaling('compute', { min: 2, max: 10 })
        return { success: true, message: result.message || 'Auto-scaling configured' }
      })

      await runTest('Resource Optimization', 1, async () => {
        const result = await resourcesAPI.startCleanup(['storage', 'compute'])
        return { success: true, message: result.message || 'Cleanup initiated' }
      })

      await runTest('Resource Optimization', 2, async () => {
        const result = await resourcesAPI.scheduleOptimization('cost', '2024-12-31T00:00:00Z')
        return { success: true, message: result.message || 'Optimization scheduled' }
      })

      await runTest('Resource Optimization', 3, async () => {
        const result = await resourcesAPI.applyAllRecommendations(true, true)
        return { success: true, message: result.message || 'All recommendations applied' }
      })

      await runTest('Resource Optimization', 4, async () => {
        const result = await resourcesAPI.getRecommendationDetails('REC-001')
        return { success: true, message: `Got details for recommendation` }
      })

      await runTest('Resource Optimization', 5, async () => {
        const result = await resourcesAPI.implementRecommendation('REC-001', true)
        return { success: true, message: result.message || 'Recommendation implemented' }
      })

      await runTest('Resource Optimization', 6, async () => {
        const result = await resourcesAPI.configureWorkload('analytics-batch', { schedule: 'nightly' }, true, true)
        return { success: true, message: result.message || 'Workload configured' }
      })

      // Identity Management Tests
      await runTest('Identity Management', 0, async () => {
        const result = await identityAPI.resetPassword('user-001', 'test@example.com')
        return { success: true, message: result.message || 'Password reset initiated' }
      })

      await runTest('Identity Management', 1, async () => {
        const result = await identityAPI.updatePermissions('user-001', ['read', 'write'])
        return { success: true, message: result.message || 'Permissions updated' }
      })

      await runTest('Identity Management', 2, async () => {
        const result = await identityAPI.exportUsers('csv', {}, false)
        return { success: true, message: result.message || 'Users exported' }
      })

      await runTest('Identity Management', 3, async () => {
        const result = await identityAPI.addUser({
          name: 'Test User',
          email: 'test@example.com',
          role: 'User',
          permissions: ['read'],
          send_invite: false
        })
        return { success: true, message: result.message || 'User added' }
      })

      await runTest('Identity Management', 4, async () => {
        const result = await identityAPI.manageUser('user-001', 'update', { status: 'active' })
        return { success: true, message: result.message || 'User managed' }
      })

      await runTest('Identity Management', 5, async () => {
        const result = await identityAPI.verifyCredential('CRED-001', 'blockchain')
        return { success: true, message: result.message || 'Credential verified' }
      })

      await runTest('Identity Management', 6, async () => {
        const result = await identityAPI.renewCredential('CRED-001', '12 months', false)
        return { success: true, message: result.message || 'Credential renewed' }
      })

      // Notifications Tests
      await runTest('Notifications', 0, async () => {
        const result = await notificationsAPI.getNotifications()
        return { success: true, message: `Loaded ${result.data?.length || 0} notifications` }
      })

      await runTest('Notifications', 1, async () => {
        const result = await notificationsAPI.markAsRead(['NOT-001'])
        return { success: true, message: 'Notifications marked as read' }
      })

      await runTest('Notifications', 2, async () => {
        const result = await notificationsAPI.configureNotifications(['email', 'sms'], 'daily', ['alerts', 'reports'])
        return { success: true, message: result.message || 'Notifications configured' }
      })

      // Search & Export Tests
      await runTest('Search & Export', 0, async () => {
        const result = await searchAPI.search('test query')
        return { success: true, message: `Found ${result.results?.length || 0} results` }
      })

      await runTest('Search & Export', 1, async () => {
        const result = await exportAPI.exportData('dashboard', 'pdf', { start: '2024-01-01', end: '2024-12-31' }, true)
        return { success: true, message: result.message || 'Data exported' }
      })

      // Audit Trails Tests
      await runTest('Audit Trails', 0, async () => {
        const result = await auditAPI.applyFilters({ type: 'login' })
        return { success: true, message: result.message || 'Filters applied' }
      })

      await runTest('Audit Trails', 1, async () => {
        const result = await auditAPI.exportAuditLogs('csv', { start: '2024-01-01', end: '2024-12-31' }, true)
        return { success: true, message: result.message || 'Audit logs exported' }
      })

      await runTest('Audit Trails', 2, async () => {
        const result = await auditAPI.searchLogs('test query', {}, 'comprehensive')
        return { success: true, message: `Found ${result.results?.length || 0} logs` }
      })

      await runTest('Audit Trails', 3, async () => {
        const result = await auditAPI.getLogDetails('LOG-001')
        return { success: true, message: `Got log details` }
      })

      setOverallStatus('complete')
      toast.success('All button functionality tests completed!')
    } catch (error) {
      console.error('Test suite error:', error)
      toast.error('Some tests encountered errors')
      setOverallStatus('complete')
    } finally {
      setIsRunning(false)
    }
  }

  const runTest = async (category: string, index: number, testFn: () => Promise<{ success: boolean, message?: string }>) => {
    updateTest(category, index, { status: 'testing' })
    
    try {
      const result = await testFn()
      updateTest(category, index, { 
        status: 'success', 
        message: result.message 
      })
    } catch (error: any) {
      updateTest(category, index, { 
        status: 'error', 
        error: error.message || 'Test failed'
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
      case 'testing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getCategoryStats = (category: string) => {
    const categoryTests = tests[category] || []
    const total = categoryTests.length
    const success = categoryTests.filter(t => t.status === 'success').length
    const error = categoryTests.filter(t => t.status === 'error').length
    const pending = categoryTests.filter(t => t.status === 'pending').length
    const testing = categoryTests.filter(t => t.status === 'testing').length

    return { total, success, error, pending, testing }
  }

  const getOverallStats = () => {
    let total = 0, success = 0, error = 0, pending = 0, testing = 0
    
    Object.keys(tests).forEach(category => {
      const stats = getCategoryStats(category)
      total += stats.total
      success += stats.success
      error += stats.error
      pending += stats.pending
      testing += stats.testing
    })

    return { total, success, error, pending, testing }
  }

  const overallStats = getOverallStats()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1>Button Functionality Audit</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive test of all backend API endpoints and button functionalities
        </p>
      </div>

      {/* Overall Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Test Results</CardTitle>
          <CardDescription>
            {overallStatus === 'idle' && 'Click "Run All Tests" to begin testing'}
            {overallStatus === 'running' && 'Tests in progress...'}
            {overallStatus === 'complete' && 'All tests completed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="font-bold">{overallStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="font-bold text-green-600">{overallStats.success}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="font-bold text-red-600">{overallStats.error}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="font-bold text-blue-600">{overallStats.testing}</div>
              <div className="text-sm text-muted-foreground">Testing</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="font-bold text-gray-600">{overallStats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={initializeTests}
              disabled={isRunning}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results by Category */}
      <Tabs defaultValue={Object.keys(tests)[0]} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          {Object.keys(tests).slice(0, 6).map(category => {
            const stats = getCategoryStats(category)
            return (
              <TabsTrigger key={category} value={category} className="relative">
                {category.split(' ')[0]}
                {stats.error > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.keys(tests).map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>
                      {getCategoryStats(category).success} / {getCategoryStats(category).total} tests passed
                    </CardDescription>
                  </div>
                  <Badge variant={getCategoryStats(category).error > 0 ? 'destructive' : 'default'}>
                    {getCategoryStats(category).error > 0 ? 'Issues Found' : 'All Good'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tests[category]?.map((test, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="mt-0.5">
                        {getStatusIcon(test.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{test.name}</div>
                        {test.message && (
                          <div className="text-sm text-green-600 mt-1">
                            ✓ {test.message}
                          </div>
                        )}
                        {test.error && (
                          <div className="text-sm text-red-600 mt-1 flex items-start gap-1">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{test.error}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Badge variant={test.status === 'success' ? 'default' : test.status === 'error' ? 'destructive' : 'outline'}>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Second set of tabs for remaining categories */}
      {Object.keys(tests).length > 6 && (
        <Tabs defaultValue={Object.keys(tests)[6]} className="w-full mt-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            {Object.keys(tests).slice(6).map(category => {
              const stats = getCategoryStats(category)
              return (
                <TabsTrigger key={category} value={category} className="relative">
                  {category.split(' ')[0]}
                  {stats.error > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.keys(tests).slice(6).map(category => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category}</CardTitle>
                      <CardDescription>
                        {getCategoryStats(category).success} / {getCategoryStats(category).total} tests passed
                      </CardDescription>
                    </div>
                    <Badge variant={getCategoryStats(category).error > 0 ? 'destructive' : 'default'}>
                      {getCategoryStats(category).error > 0 ? 'Issues Found' : 'All Good'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tests[category]?.map((test, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="mt-0.5">
                          {getStatusIcon(test.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{test.name}</div>
                          {test.message && (
                            <div className="text-sm text-green-600 mt-1">
                              ✓ {test.message}
                            </div>
                          )}
                          {test.error && (
                            <div className="text-sm text-red-600 mt-1 flex items-start gap-1">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{test.error}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Badge variant={test.status === 'success' ? 'default' : test.status === 'error' ? 'destructive' : 'outline'}>
                            {test.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
