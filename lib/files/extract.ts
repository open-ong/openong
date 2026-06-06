/**
 * Lightweight text extraction for chat attachments.
 *
 * MVP scope — NO heavy dependencies (keeps the hackathon build fast and the
 * bundle small):
 *   - TXT / Markdown : read as UTF-8 text
 *   - CSV            : read as UTF-8 text (plain preview)
 *   - PDF / DOCX     : NOT extracted here — file is stored and flagged as
 *                      "extracción pendiente". See TODO below.
 *   - Images         : not extracted (no OCR); stored as metadata only.
 *
 * TODO(prod): add `pdf-parse` (PDF) and `mammoth` (DOCX) behind a dynamic
 * import so they don't bloat the main bundle, and add OCR for images.
 */

export const SUPPORTED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/png',
  'image/jpeg',
  'image/webp'
];

/** MIME types we can extract text from in the MVP. */
const TEXT_LIKE = new Set(['text/plain', 'text/markdown', 'text/csv']);

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export type ExtractionResult = {
  extractedText?: string;
  /** True when the file was accepted but text extraction is deferred. */
  extractionPending: boolean;
};

function isTextLike(mimeType: string, fileName: string): boolean {
  if (TEXT_LIKE.has(mimeType)) return true;
  // Some browsers send octet-stream / empty type for .md/.csv/.txt.
  return /\.(txt|md|markdown|csv|tsv|json)$/i.test(fileName);
}

export function isSupported(mimeType: string, fileName: string): boolean {
  return (
    SUPPORTED_MIME_TYPES.includes(mimeType) ||
    isTextLike(mimeType, fileName) ||
    /\.(pdf|docx)$/i.test(fileName)
  );
}

/**
 * Extracts text from a file buffer based on its MIME type / name.
 * Never throws on unsupported types — returns `extractionPending: true`.
 */
export async function extractText(
  buffer: ArrayBuffer,
  mimeType: string,
  fileName: string
): Promise<ExtractionResult> {
  if (isTextLike(mimeType, fileName)) {
    const text = new TextDecoder('utf-8').decode(buffer);
    // Cap stored text so we never blow up the session/Redis payload.
    return { extractedText: text.slice(0, 20_000), extractionPending: false };
  }

  // PDF / DOCX / images: stored, extraction deferred for the MVP.
  return { extractionPending: true };
}
