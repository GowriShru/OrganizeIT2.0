import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'
import { AlertTriangle, CheckCircle, RefreshCw, Bug } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface ServerStatusProps {
  onShowDiagnostics?: () => void
}

export function ServerStatus({ onShowDiagnostics }: ServerStatusProps = {}) {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [showAlert, setShowAlert] = useState(false)

  const checkServerStatus = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a/health`,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          signal: controller.signal
        }
      )
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✓ Backend health check:', data)
        setServerStatus('online')
        setShowAlert(false)
      } else {
        console.error('✗ Backend health check failed:', response.status, response.statusText)
        setServerStatus('offline')
        setShowAlert(true)
      }
    } catch (error) {
      console.error('✗ Backend connection error:', error)
      setServerStatus('offline')
      setShowAlert(true)
    }
  }

  useEffect(() => {
    checkServerStatus()
    
    // Check server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // Don't show anything when server is online
  if (serverStatus === 'online') return null
  
  // Only show alert when offline
  if (!showAlert) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-orange-800 dark:text-orange-200">Backend Connection Issue</strong>
              <p className="text-sm mt-1 text-orange-700 dark:text-orange-300">
                Unable to connect to Supabase. Please check your connection.
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={checkServerStatus}
                disabled={serverStatus === 'checking'}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${serverStatus === 'checking' ? 'animate-spin' : ''}`} />
                Retry
              </Button>
              {onShowDiagnostics && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onShowDiagnostics}
                >
                  <Bug className="w-3 h-3 mr-1" />
                  Diagnostics
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}