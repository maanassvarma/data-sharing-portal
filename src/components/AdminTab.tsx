import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { LIST_THINGS, CREATE_THING } from '@/graphql/operations'
import { createThingSchema, type CreateThingInput } from '@/lib/validations'
import { Loader2, Plus, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Thing {
  id: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | string
  created_at: string
}

export function AdminTab(): JSX.Element {
  const [newThingName, setNewThingName] = useState<string>('')
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { toast } = useToast()

  // Query to fetch all things
  //const { data, loading, error, refetch } = useQuery<{ listThings: Thing[] }>(LIST_THINGS)

  type ListThingsData = { things: Thing[] }

  const { data, loading, error, refetch } = useQuery<ListThingsData>(LIST_THINGS, {
    fetchPolicy: 'cache-first',
  })
  
  // Mutation to create a new thing
  type CreateThingData = { createThing: Thing }
  type CreateThingVars = { name: string }

  const [createThing] = useMutation<CreateThingData, CreateThingVars>(CREATE_THING, {
    onCompleted: () => {
      void refetch()
      setNewThingName('')
      setIsCreating(false)
      toast({
        title: 'Thing created',
        description: 'New thing has been created successfully.',
      })
    },
    onError: (error) => {
      setIsCreating(false)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleCreateThing = async (): Promise<void> => {
    if (!newThingName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the new thing.',
        variant: 'destructive',
      })
      return
    }

    try {
      const validatedInput = createThingSchema.parse({ name: newThingName.trim() })
      setIsCreating(true)
      await createThing({
        variables: validatedInput,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation failed'
      toast({
        title: 'Validation error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      void handleCreateThing()
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New Thing */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Thing</CardTitle>
          <CardDescription>
            Add a new thing to the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="thing-name">Name</Label>
            <div className="flex space-x-2">
              <Input
                id="thing-name"
                value={newThingName}
                onChange={(e) => setNewThingName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter thing name..."
                disabled={isCreating}
                aria-describedby="thing-name-help"
              />
              <Button
                onClick={handleCreateThing}
                disabled={!newThingName.trim() || isCreating}
                aria-label="Create new thing"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p id="thing-name-help" className="text-sm text-muted-foreground">
              Enter a name for the new thing (1-100 characters)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Things List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Things</CardTitle>
              <CardDescription>
                Manage your things in the system
              </CardDescription>
            </div>
            <Button
              onClick={() => void refetch()}
              variant="outline"
              size="sm"
              disabled={loading}
              aria-label="Refresh things list"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading things...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-4 border rounded-lg bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Error loading things</p>
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          )}

          {!loading && !error && data?.things && data.things.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No things found. Create your first thing above.</p>
            </div>
          )}

          {!loading && !error && data?.things && data.things.length > 0 && (
            <div className="space-y-3">
              {data.things.map((thing) => (
                <div
                  key={thing.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium truncate">{thing.name}</h3>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                          getStatusColor(thing.status)
                        )}
                      >
                        {thing.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {formatDate(thing.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-xs text-muted-foreground">ID: {thing.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 