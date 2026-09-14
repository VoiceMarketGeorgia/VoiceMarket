// Supabase Storage file upload utility

import { createSupabaseClient } from './supabase'

// Uploads happen from the admin panel only. Use the session-carrying client so
// storage sees the signed-in admin rather than the anonymous role - otherwise
// the buckets have to stay writable by anyone holding the public anon key.
const supabase = createSupabaseClient()

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
// Kept in step with what the `audios` storage bucket actually accepts.
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']

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
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()

    // Files are named after what they belong to: actor 52's photo is
    // "52.jpg", its samples are "52.1.mp3", "52.2.mp3", "52.3.mp3". Sample
    // numbers are unique per actor (see audio-sample-manager), so every sample
    // has its own file.
    //
    // Only a real media extension is stripped from the name - never the
    // number after the dot. Stripping "everything after the last dot" once
    // turned 52.1, 52.2 and 52.3 into the same "52", and all samples of an
    // actor overwrote one file.
    const baseName = options.fileName
      ? options.fileName.replace(/\.(mp3|wav|ogg|m4a|jpe?g|png|webp)$/i, '')
      : `${timestamp}-${randomStr}`
    const fileName = `${baseName}.${ext}`
    const filePath = options.folder ? `${options.folder}/${fileName}` : fileName

    // upsert: replacing the audio of sample 52.2 (or an actor's photo) writes
    // to the same path again.
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message || 'Upload failed'
      }
    }

    // Get public URL. The ?v= marker lives in the link only, not the file
    // name: when a file is replaced under the same name, the new link makes
    // browsers and the CDN fetch the new audio instead of a cached old copy.
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return {
      url: `${publicUrl}?v=${timestamp}`,
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
