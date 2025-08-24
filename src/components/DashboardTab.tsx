import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getQuickSightEmbedUrl } from '@/lib/api'
import { Loader2, RefreshCw } from 'lucide-react'

export function DashboardTab(): JSX.Element {
  const [embedUrl, setEmbedUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { toast } = useToast()

  const fetchEmbedUrl = async (): Promise<void> => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await getQuickSightEmbedUrl()
      setEmbedUrl(response.url)
      toast({
        title: 'Dashboard loaded',
        description: 'QuickSight dashboard has been loaded successfully.',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchEmbedUrl()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View your business metrics and analytics in real-time
              </CardDescription>
            </div>
            <Button
              onClick={fetchEmbedUrl}
              disabled={isLoading}
              variant="outline"
              size="sm"
              aria-label="Refresh dashboard"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && !embedUrl && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchEmbedUrl} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {embedUrl && !isLoading && (
            <div className="relative w-full h-96 border rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title="Analytics Dashboard"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                aria-label="QuickSight analytics dashboard"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 