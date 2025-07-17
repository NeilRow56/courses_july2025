'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState
} from './RenderState'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface UploaderState {
  id: string | null
  file: File | null
  uploading: boolean
  progress: number
  key?: string
  isDeleting: boolean
  error: boolean
  objectUrl?: string
  fileType: 'image' | 'video' | 'pdf' | 'doc' | 'xls'
}

interface iAppProps {
  value?: string
  onChange?: (value: string) => void
}

export function Uploader({ onChange, value }: iAppProps) {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: 'image',
    key: value
  })

  const uploadFile = async (file: File) => {
    setFileState(prev => ({
      ...prev,
      uploading: true,
      progress: 0
    }))
    try {
      // Get presigned URL
      const presignedResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true
        })
      })
      if (!presignedResponse.ok) {
        toast.error('Failed to get presignedURL')
        setFileState(prev => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true
        }))

        return
      }

      const { presignedUrl, key } = await presignedResponse.json()

      // 2. Upload file to S3

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = event => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100
            setFileState(prev => ({
              ...prev,
              progress: Math.round(percentComplete)
            }))
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            // 3. File fully uploaded - set progress to 100
            setFileState(prev => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key
            }))

            onChange?.(key)

            toast.success('File uploaded successfully')

            resolve()
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`))
          }
        }

        xhr.onerror = () => {
          reject(new Error('Upload failed'))
        }

        xhr.open('PUT', presignedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    } catch {
      toast.error('Something went wrong')
      setFileState(prev => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false
      }))
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        //clean up url
        if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
          URL.revokeObjectURL(fileState.objectUrl)
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: 'image'
        })

        uploadFile(file)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileState.objectUrl]
  )

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return

    try {
      setFileState(prev => ({
        ...prev,
        isDeleting: true
      }))

      const request = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: fileState.key
        })
      })

      if (!request.ok) {
        toast.error('Failed to remove file from storage')

        setFileState(prev => ({
          ...prev,
          isDeleting: true,
          error: true
        }))

        return
      }

      //clean up url
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl)
      }

      onChange?.('')

      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: 'image',
        id: null,
        isDeleting: false
      }))
      toast.success('File deleted successfully')
    } catch {
      toast.error('Error removing file. Please try again')

      setFileState(prev => ({
        ...prev,
        isDeleting: false,
        error: true
      }))
    }
  }

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        rejection => rejection.errors[0].code === 'too-many-files'
      )

      const fileSizeTooBig = fileRejection.find(
        rejection => rejection.errors[0].code === 'file-too-large'
      )

      if (fileSizeTooBig) {
        toast.error('File selected is too big, max is 5MB')
      }

      if (tooManyFiles) {
        toast.error('Too many files selected, max is 1')
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      )
    }
    if (fileState.error) {
      return <RenderErrorState />
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          previewUrl={fileState.objectUrl}
        />
      )
    }
    return <RenderEmptyState isDragActive={isDragActive} />
  }

  useEffect(() => {
    return () => {
      //clean up url
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl)
      }
    }
  }, [fileState.objectUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': []
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl
  })
  return (
    <Card
      {...getRootProps()}
      className={cn(
        'relative h-64 w-full border-2 border-dashed transition-colors duration-200 ease-in-out',
        isDragActive
          ? 'border-primary bg-primary/10 border-solid'
          : 'border-border hover:border-primary'
      )}
    >
      <CardContent className='flex h-full w-full items-center justify-center p-4'>
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  )
}
