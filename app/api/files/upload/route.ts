import { NextResponse } from 'next/server';
import {
  MAX_FILE_SIZE,
  extractText,
  isSupported
} from '@/lib/files/extract';
import type { ChatAttachment } from '@/lib/onboarding/types';

/**
 * POST /api/files/upload  (multipart/form-data, field name: "file")
 *
 * Accepts a single file, validates type/size, extracts text for text-like
 * files (TXT/MD/CSV), and returns `ChatAttachment` metadata.
 *
 * Storage: this MVP does NOT persist the binary anywhere. It returns metadata
 * + extracted text so the chat can attach it to a message and feed the agent.
 * TODO(prod): persist the binary to Vercel Blob / S3 and set `url`.
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
  let extraction;
  try {
    extraction = await extractText(buffer, file.type, file.name);
  } catch (err) {
    console.warn('[files/upload] extraction failed:', err);
    extraction = { extractionPending: true as const };
  }

  const attachment: ChatAttachment = {
    id: crypto.randomUUID(),
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    extractedText: extraction.extractedText,
    createdAt: new Date().toISOString()
    // url: TODO(prod) — set when binary storage is configured.
  };

  return NextResponse.json({
    attachment,
    extractionPending: extraction.extractionPending
  });
}
