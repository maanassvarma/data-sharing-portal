import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getPresignUrl, uploadFileToS3 } from '@/lib/api'
import { fileUploadSchema, type FileUploadInput } from '@/lib/validations'
import { Loader2, Upload, File, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@apollo/client'
import { CREATE_DATASET, LIST_DATASETS, CREATE_THING, LIST_THINGS } from '@/graphql/operations'

interface UploadState {
  isUploading: boolean
  progress: number
  error: string
  success: boolean
}

export function UploadTab(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: '',
    success: false,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [createThing] = useMutation(CREATE_THING, {
    update(cache, { data }) {
      const created = data?.createThing
      if (!created) return
  
      cache.updateQuery<{ things: any[] }>({ query: LIST_THINGS }, (prev) => {
        const prevThings = prev?.things ?? []
        // de-dupe by id
        if (prevThings.some(t => t.id === created.id)) return prev
        return { things: [created, ...prevThings] }
      })
    },
  })

  const [createDataset] = useMutation(CREATE_DATASET, {
    update(cache, { data }) {
      const created = data?.createDataset
      if (!created) return
      const existing = cache.readQuery<{ datasets: any[] }>({ query: LIST_DATASETS })
      const next = existing?.datasets ? [created, ...existing.datasets] : [created]
      cache.writeQuery({ query: LIST_DATASETS, data: { datasets: next } })
    },
  })  
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setUploadState({
      isUploading: false,
      progress: 0,
      error: '',
      success: false,
    })
  }

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      })
      return
    }

    // Enforce CSV and 10MB max
    if (!((selectedFile.type === 'text/csv') || selectedFile.name.toLowerCase().endsWith('.csv'))) {
      toast({ title: 'Invalid file', description: 'Please select a CSV file.', variant: 'destructive' })
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 10MB.', variant: 'destructive' })
      return
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: '',
      success: false,
    })

    try {
      // Validate file input
      const fileInput: FileUploadInput = {
        fileName: selectedFile.name,
        contentType: selectedFile.type,
      }
      
      fileUploadSchema.parse(fileInput)

      // 1) Get presigned URL
      const presignResponse = await getPresignUrl(fileInput)
      const { uploadUrl, fileKey } = presignResponse // ⬅️ grab fileKey for UI

      // 2) Simulate progress while uploading (kept from your code)
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }))
      }, 100)

      // 3) Upload file (your helper)
      await uploadFileToS3(selectedFile, uploadUrl)

      // 4) Stop progress and mark success
      clearInterval(progressInterval)
      setUploadState({
        isUploading: false,
        progress: 100,
        error: '',
        success: true,
      })

      // bump dashboard KPI
      const COUNTER_KEY = 'uploads_count'
      const next = (parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) || 0) + 1
      localStorage.setItem(COUNTER_KEY, String(next))

      // create Dataset (portal-shaped)
      await createDataset({
        variables: { name: selectedFile.name },
        optimisticResponse: {
          createDataset: {
            __typename: 'Dataset',
            id: (globalThis.crypto?.randomUUID?.() ?? String(Math.random())).toString(),
            name: selectedFile.name,
            owner: 'you',          // mock
            visibility: 'private', // mock
            created_at: new Date().toISOString(),
          },
        },
      })
      // also create Thing so your existing Admin tab shows it
      await createThing({
        variables: { name: selectedFile.name },
        optimisticResponse: {
          createThing: {
            __typename: 'Thing',
            id: (globalThis.crypto?.randomUUID?.() ?? String(Math.random())).toString(),
            name: selectedFile.name,
            status: 'ACTIVE',
            created_at: new Date().toISOString(),
          },
        },
        // your createThing hook already updates LIST_THINGS; leaving update here is fine too
      })

      // 7) Toast with where it “landed” (mocked key)
      toast({
        title: 'Upload successful',
        description: `Uploaded to ${fileKey}`,
      })  
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
      })
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Data</CardTitle>
          <CardDescription>
            Upload files to your S3 storage bucket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileSelect}
                disabled={uploadState.isUploading}
                aria-describedby="file-upload-help"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={uploadState.isUploading}
                aria-label="Browse files"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p id="file-upload-help" className="text-sm text-muted-foreground">
              Select a file to upload to S3 storage
            </p>
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50">
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                </p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadState.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadState.success && (
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">Upload completed successfully!</span>
            </div>
          )}

          {/* Error State */}
          {uploadState.error && (
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-800">{uploadState.error}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadState.isUploading}
            className="w-full"
            aria-label="Upload selected file"
          >
            {uploadState.isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 