import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

function sanitizeSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9-_\.]/g, '')
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true })
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const folder = (form.get('folder') as string | null) || ''
    const dir = (form.get('dir') as string | null) || '' // 'audios' | 'photos'
    const providedName = (form.get('filename') as string | null) || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const originalName = (file as any).name || 'upload'
    const ext = path.extname(originalName) || '.bin'
    const safeFolder = sanitizeSegment(folder)
    const safeDir = sanitizeSegment(dir || '') || 'uploads'
    // If a filename is provided, use it as-is (after sanitization) without forcing original extension
    const baseName = providedName ? sanitizeSegment(providedName) : `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    const fileName = baseName

    const root = path.join(process.cwd(), 'public', safeDir)
    const fullDir = path.join(root, safeFolder || '')
    await ensureDir(fullDir)
    const fullPath = path.join(fullDir, fileName)
    await fs.writeFile(fullPath, buffer)

    const urlPath = [safeDir]
      .concat(safeFolder ? [safeFolder] : [])
      .concat([fileName])
      .join('/')

    return NextResponse.json({ url: `/${urlPath}`, path: urlPath })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const relPath = searchParams.get('path') || ''
    if (!relPath) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }
    const safeRel = relPath.replace(/\.+/g, '').replace(/^\/+|\/+$/g, '')
    const fullPath = path.join(process.cwd(), 'public', safeRel)
    const publicRoot = path.join(process.cwd(), 'public')
    if (!fullPath.startsWith(publicRoot)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
    await fs.unlink(fullPath)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Delete failed' }, { status: 500 })
  }
}


