// Supabase Storage file upload utility

import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface FileUploadOptions {
  bucket: 'actor-photos' | 'audio-samples'
  folder?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
  // New: control public path location and naming
  dir?: 'audios' | 'photos'
  fileName?: string
}

const DEFAULT_OPTIONS: Partial<FileUploadOptions> = {
  maxSize: 10 * 1024 * 1024, // 10MB
}

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a']

// Map bucket names to Supabase storage buckets
const BUCKET_MAP = {
  'actor-photos': 'photos',
  'audio-samples': 'audios'
}

export async function uploadFile(
  file: File, 
  options: FileUploadOptions
): Promise<UploadResult> {
  try {
    // Validate file size
    const maxSize = options.maxSize || DEFAULT_OPTIONS.maxSize!
    if (file.size > maxSize) {
      return {
        url: '',
        path: '',
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    // Validate file type
    const allowedTypes = options.allowedTypes || 
      (options.bucket === 'actor-photos' ? IMAGE_TYPES : AUDIO_TYPES)
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const mimeAllowed = allowedTypes.includes(file.type)
    const extAllowed = fileExt ? allowedTypes.some(t => t.replace('.', '').toLowerCase().includes(fileExt)) : false
    if (!mimeAllowed && !extAllowed) {
      return {
        url: '',
        path: '',
        error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`
      }
    }

    // Generate file path
    const bucketName = BUCKET_MAP[options.bucket]
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).slice(2, 8)
    const ext = file.name.split('.').pop()
    const fileName = options.fileName || `${timestamp}-${randomStr}.${ext}`
    const filePath = options.folder ? `${options.folder}/${fileName}` : fileName

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message || 'Upload failed'
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const bucketName = BUCKET_MAP[bucket as keyof typeof BUCKET_MAP] || bucket
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

// Helper function to extract path from Supabase Storage URL
export function extractPathFromUrl(url: string): string | null {
  try {
    // Supabase Storage URLs format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const publicIndex = pathParts.indexOf('public')
    
    if (publicIndex !== -1 && pathParts.length > publicIndex + 2) {
      // Skip bucket name, return the file path
      return pathParts.slice(publicIndex + 2).join('/')
    }
    
    // Fallback for local URLs
    if (url.startsWith('/')) {
      return url.slice(1)
    }
    
    return null
  } catch {
    return null
  }
}
