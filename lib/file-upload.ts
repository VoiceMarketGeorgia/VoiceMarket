// Local public-folder upload utility (no Supabase Storage)

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

    // Validate file type (accept by MIME or extension)
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

    // Post to local upload API which writes into /public/uploads
    const form = new FormData()
    form.append('file', file)
    if (options.folder) form.append('folder', options.folder)
    if (options.dir) form.append('dir', options.dir)
    if (options.fileName) form.append('filename', options.fileName)
    const response = await fetch('/api/upload', { method: 'POST', body: form })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return { url: '', path: '', error: err?.error || 'Upload failed' }
    }
    const json = await response.json()
    return { url: json.url, path: json.path }
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
    const res = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
    return res.ok
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

// Helper function to extract path from Supabase URL
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url, window.location.origin)
    // Expect URLs like /uploads/<folder>/<filename>
    const parts = urlObj.pathname.split('/')
    const uploadsIndex = parts.indexOf('uploads')
    if (uploadsIndex !== -1) return parts.slice(uploadsIndex + 1).join('/')
    return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname
  } catch {
    return null
  }
}
