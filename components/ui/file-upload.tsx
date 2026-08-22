'use client'

import { useState, useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { uploadFile, deleteFile, extractPathFromUrl, FileUploadOptions } from '@/lib/file-upload'
import { Upload, X, Image as ImageIcon, Music, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onUpload: (url: string) => void
  onRemove?: () => void
  currentUrl?: string
  bucket: 'actor-photos' | 'audio-samples'
  folder?: string
  dirOverride?: 'audios' | 'photos'
  fileName?: string
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
  placeholder?: string
}

export function FileUpload({
  onUpload,
  onRemove,
  currentUrl,
  bucket,
  folder,
  dirOverride,
  fileName,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = "",
  placeholder
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const isImage = bucket === 'actor-photos'
  const defaultAccept: Record<string, string[]> = isImage
    ? { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
    : { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'] }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setUploadError(null)

    try {
      const options: FileUploadOptions = {
        bucket,
        folder,
        maxSize,
        allowedTypes: Object.keys(accept || defaultAccept).map(key => 
          (accept || defaultAccept)[key]).flat(),
        dir: dirOverride || (bucket === 'audio-samples' ? 'audios' : 'photos'),
        fileName
      }

      const result = await uploadFile(file, options)
      
      if (result.error) {
        setUploadError(result.error)
      } else {
        onUpload(result.url)
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [bucket, folder, maxSize, accept, defaultAccept, onUpload, dirOverride, fileName])

  const handleRemove = async () => {
    if (!currentUrl) {
      if (onRemove) onRemove()
      return
    }

    const path = extractPathFromUrl(currentUrl)
    if (path) {
      await deleteFile(bucket, path)
      if (onRemove) onRemove()
    } else {
      if (onRemove) onRemove()
    }
  }

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (!fileRejections || fileRejections.length === 0) return
    const rejection = fileRejections[0]
    const error = rejection.errors[0]
    if (!error) return
    if (error.code === 'file-too-large') {
      setUploadError(`ფაილი ძალიან დიდია. მაქსიმალური ზომა ${Math.round(maxSize / 1024 / 1024)}MB`)
    } else if (error.code === 'file-invalid-type') {
      setUploadError(isImage ? 'ფაილის ტიპი არასწორია. დასაშვებია JPG, PNG, WebP' : 'ფაილის ტიპი არასწორია. დასაშვებია WAV')
    } else {
      setUploadError(error.message)
    }
  }, [isImage, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: accept || defaultAccept,
    maxFiles: 1,
    maxSize,
    disabled: uploading
  })

  const defaultPlaceholder = isImage 
    ? "ფოტოს ატვირთვა (გადმოიტანეთ ან დააკლიკეთ)"
    : "აუდიოს ატვირთვა (გადმოიტანეთ ან დააკლიკეთ)"

  return (
    <div className={className}>
      {currentUrl ? (
        <div className="space-y-2">
          <Card className="p-3">
            <div className="flex items-center gap-3">
              {isImage ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={currentUrl} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isImage ? 'ფოტო ატვირთულია' : 'აუდიო ატვირთულია'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isImage ? 'დააკლიკეთ X-ზე წასაშლელად' : 'დააკლიკეთ X-ზე წასაშლელად'}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <Card
          {...getRootProps()}
          className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20' 
              : 'border-muted-foreground/25 hover:border-orange-400'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="text-center space-y-3">
            {uploading ? (
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-orange-500" />
            ) : (
              <div className="flex flex-col items-center">
                {isImage ? (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <Music className="h-12 w-12 text-muted-foreground" />
                )}
                <Upload className="h-6 w-6 text-muted-foreground -mt-2" />
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium">
                {uploading ? 'იტვირთება...' : (placeholder || defaultPlaceholder)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isImage ? `მაქსიმუმ ${Math.round(maxSize / 1024 / 1024)}MB, JPG, PNG, WebP` : 'მაქსიმუმ 10MB, MP3, WAV, OGG'}
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {uploadError && (
        <p className="text-sm text-red-500 mt-2">{uploadError}</p>
      )}
    </div>
  )
}

// Specific component for image uploads
export function ImageUpload(props: Omit<FileUploadProps, 'bucket'>) {
  return (
      <FileUpload
      {...props}
        bucket="actor-photos"
      accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
      maxSize={10 * 1024 * 1024} // 10MB for images
    />
  )
}

// Specific component for audio uploads
export function AudioUpload(props: Omit<FileUploadProps, 'bucket'>) {
  return (
      <FileUpload
      {...props}
        bucket="audio-samples"
      accept={{ 'audio/*': ['.wav'] }}
      maxSize={10 * 1024 * 1024} // 10MB for audio
    />
  )
}
