import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, XCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface TestResult {
  name: string
  endpoint: string
  status: 'pending' | 'success' | 'error'
  message?: string
  details?: any
}

export function BackendDiagnostics() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a`

  const tests = [
    { name: 'Health Check', endpoint: '/health' },
    { name: 'Metrics Dashboard', endpoint: '/metrics/dashboard' },
    { name: 'Projects List', endpoint: '/projects' },
    { name: 'Alerts', endpoint: '/alerts/current' },
    { name: 'Notifications', endpoint: '/notifications' },
    { name: 'Services Health', endpoint: '/services/health' },
    { name: 'FinOps Costs', endpoint: '/finops/costs' },
    { name: 'ESG Carbon', endpoint: '/esg/carbon' },
  ]

  const runDiagnostics = async () => {
    setIsRunning(true)
    const testResults: TestResult[] = tests.map(test => ({
      ...test,
      status: 'pending' as const
    }))
    setResults(testResults)

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          testResults[i] = {
            ...test,
            status: 'success',
            message: `Success (${response.status})`,
            details: data
          }
        } else {
          const errorText = await response.text()
          testResults[i] = {
            ...test,
            status: 'error',
            message: `Error ${response.status}: ${response.statusText}`,
            details: errorText
          }
        }
      } catch (error) {
        testResults[i] = {
          ...test,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }

      setResults([...testResults])
    }

    setIsRunning(false)
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Backend Diagnostics</CardTitle>
          <CardDescription>
            Test connectivity to Supabase Edge Functions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div><strong>Project ID:</strong> {projectId}</div>
                <div><strong>Backend URL:</strong> {API_BASE_URL}</div>
                <div><strong>Auth Key:</strong> {publicAnonKey.substring(0, 20)}...</div>
              </div>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Diagnostics
              </>
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Badge variant={successCount === tests.length ? "default" : errorCount > 0 ? "destructive" : "secondary"}>
                  {successCount} / {tests.length} Passed
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive">{errorCount} Failed</Badge>
                )}
              </div>

              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    {result.status === 'pending' && (
                      <Loader2 className="w-5 h-5 mt-0.5 text-muted-foreground animate-spin" />
                    )}
                    {result.status === 'success' && (
                      <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
                    )}
                    {result.status === 'error' && (
                      <XCircle className="w-5 h-5 mt-0.5 text-red-600" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.name}</span>
                        <code className="text-xs text-muted-foreground">
                          {result.endpoint}
                        </code>
                      </div>
                      {result.message && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {result.message}
                        </div>
                      )}
                      {result.status === 'error' && result.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-muted-foreground">
                            View Details
                          </summary>
                          <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-x-auto">
                            {typeof result.details === 'string' 
                              ? result.details 
                              : JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorCount > 0 && !isRunning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Connection Issues Detected</p>
                  <p className="text-sm">
                    The Supabase Edge Function may not be deployed or accessible. This is expected in Figma Make preview mode.
                  </p>
                  <p className="text-sm">
                    <strong>Note:</strong> The backend will work once the app is published or when the Edge Function is properly deployed.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}