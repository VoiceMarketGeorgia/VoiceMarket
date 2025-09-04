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
}

const DEFAULT_OPTIONS: Partial<FileUploadOptions> = {
  maxSize: 10 * 1024 * 1024, // 10MB
}

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a']

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
    
    if (!allowedTypes.includes(file.type)) {
      return {
        url: '',
        path: '',
        error: `File type ${file.type} is not allowed`
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Create file path
    const folder = options.folder || ''
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path)

    // Log upload to database
    await supabase
      .from('file_uploads')
      .insert({
        file_name: file.name,
        file_path: data.path,
        file_type: options.bucket === 'actor-photos' ? 'image' : 'audio',
        file_size: file.size,
        mime_type: file.type,
        related_table: options.bucket === 'actor-photos' ? 'voice_actors' : 'audio_samples'
      })

    return {
      url: urlData.publicUrl,
      path: data.path,
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
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    // Remove from file_uploads table
    await supabase
      .from('file_uploads')
      .delete()
      .eq('file_path', path)

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

// Helper function to extract path from Supabase URL
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const objectIndex = pathParts.findIndex(part => part === 'object')
    if (objectIndex !== -1 && pathParts[objectIndex + 2]) {
      return pathParts.slice(objectIndex + 2).join('/')
    }
    return null
  } catch {
    return null
  }
}
