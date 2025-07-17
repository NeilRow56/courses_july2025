import { cn } from '@/lib/utils'
import {
  CloudUploadIcon,
  ImageIcon,
  Loader2,
  RotateCcw,
  XIcon
} from 'lucide-react'
import { Button } from '../ui/button'
import Image from 'next/image'

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className='text-center'>
      <div className='bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full'>
        <CloudUploadIcon
          className={cn(
            'text-muted-foreground size-6',
            isDragActive && 'text-primary'
          )}
        />
      </div>
      <p className='text-foreground text-base font-semibold'>
        Drop your files here or{' '}
        <span className='text-primary cursor-pointer font-bold'>
          click to upload
        </span>
      </p>
      <Button type='button' className='m-4'>
        Select File
      </Button>
    </div>
  )
}

export function RenderErrorState() {
  return (
    <div className='text-destructive text-center'>
      <div className='bg-destructive/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full'>
        <ImageIcon className={cn('text-destructive size-6')} />
      </div>
      <p className='text-base font-semibold'>Operation Failed</p>
      <p className='mt-1 text-xs'>Something went wrong!</p>
      <Button type='button' size='sm' className='mt-4'>
        Retry File Selection <RotateCcw className='ml-1 size-4' />
      </Button>
    </div>
  )
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile
}: {
  previewUrl: string
  isDeleting: boolean
  handleRemoveFile: () => void
}) {
  return (
    <div className=''>
      <Image
        src={previewUrl}
        alt='preview uploaded file'
        fill
        className='object-contain p-2'
      />
      <Button
        variant='destructive'
        size='icon'
        className={cn('absolute top-4 right-4')}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <XIcon className='size-4' />
        )}
      </Button>
    </div>
  )
}
export function RenderUploadingState({
  progress,
  file
}: {
  progress: number
  file: File
}) {
  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <p>{progress}</p>
      <p className='text-foreground mt-2 text-sm font-medium'>Loading...</p>
      <p className='text-muted-foreground mt-1 max-w-xs truncate text-xs'>
        {file.name}
      </p>
    </div>
  )
}
