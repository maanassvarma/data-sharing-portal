import React, { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/toaster'
import { UploadTab } from '@/components/UploadTab'
import { AdminTab } from '@/components/AdminTab'
import { client } from '@/graphql/client'
import { startMSW } from '@/mocks/browser'
import { BarChart3, Upload, Settings } from 'lucide-react'
import QuickSightEmbed from '@/components/QuickSightEmbed'
import DatasetsTab from '@/components/DatasetsTab'
import { useRole } from '@/hooks/useRole'

function App(): JSX.Element {
  // Start MSW before rendering the app in dev
  const [mswReady, setMswReady] = useState(!import.meta.env.DEV)
  const { role, setRole } = useRole()
  useEffect(() => {
    if (import.meta.env.DEV) {
      startMSW().then(() => setMswReady(true))
    }
  }, [])

  if (!mswReady) {
    return <div className="p-6 text-sm">Starting mock server…</div>
  }

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          {/* Header with role switch */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modern Admin Dashboard</h1>
              <p className="text-muted-foreground">
                A comprehensive admin interface with analytics, file upload, and data management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="role" className="text-sm text-muted-foreground">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'collab')}
                className="border rounded px-2 py-1"
              >
                <option value="admin">Admin</option>
                <option value="collab">Collaborator</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            {/* Use flex so the tab count can change when Upload is hidden */}
            <TabsList className="flex flex-wrap gap-2 w-full">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>

              {/* Show Upload only for admins */}
              {role === 'admin' && (
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Data</span>
                </TabsTrigger>
              )}

              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin Data</span>
              </TabsTrigger>

              <TabsTrigger value="datasets">Datasets</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <QuickSightEmbed />
            </TabsContent>

            {role === 'admin' && (
              <TabsContent value="upload" className="space-y-4">
                <UploadTab />
              </TabsContent>
            )}

            <TabsContent value="admin" className="space-y-4">
              <AdminTab />
            </TabsContent>

            <TabsContent value="datasets">
              <DatasetsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </ApolloProvider>
  )
}

export default App
