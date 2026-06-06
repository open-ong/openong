import { NextResponse } from 'next/server';
import {
  MAX_FILE_SIZE,
  extractText,
  isSupported
} from '@/lib/files/extract';
import {
  cloudinaryConfigError,
  uploadToCloudinary
} from '@/lib/cloudinary';
import type { ChatAttachment } from '@/lib/onboarding/types';

/**
 * POST /api/files/upload  (multipart/form-data, fields: "file", optional "folder")
 *
 * Accepts a single file, validates type/size, persists the binary to Cloudinary
 * (when configured), extracts text for text-like files (TXT/MD/CSV), and returns
 * `ChatAttachment` metadata including the hosted `url`.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Expected multipart/form-data' },
      { status: 400 }
    );
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing "file" field' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_FILE_SIZE / (1024 * 1024)} MB)` },
      { status: 413 }
    );
  }

  if (!isSupported(file.type, file.name)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || file.name}` },
      { status: 415 }
    );
  }

  const buffer = await file.arrayBuffer();
  const mimeType = file.type || 'application/octet-stream';

  let extraction;
  try {
    extraction = await extractText(buffer, file.type, file.name);
  } catch (err) {
    console.warn('[files/upload] extraction failed:', err);
    extraction = { extractionPending: true as const };
  }

  // Persist the binary to Cloudinary so the chat / page can reference a stable
  // URL. When Cloudinary is not configured we still return metadata (the file
  // just won't have a hosted url).
  const folder = (form.get('folder') as string) || 'openong';
  let url: string | undefined;
  let storageError: string | null = cloudinaryConfigError();
  if (!storageError) {
    try {
      ({ url } = await uploadToCloudinary(buffer, folder, mimeType));
    } catch (err) {
      console.warn('[files/upload] Cloudinary upload failed:', err);
      storageError =
        err instanceof Error ? err.message : 'Cloudinary upload failed';
    }
  }

  const attachment: ChatAttachment = {
    id: crypto.randomUUID(),
    fileName: file.name,
    mimeType,
    size: file.size,
    url,
    extractedText: extraction.extractedText,
    createdAt: new Date().toISOString()
  };

  return NextResponse.json({
    attachment,
    extractionPending: extraction.extractionPending,
    storageError
  });
}
