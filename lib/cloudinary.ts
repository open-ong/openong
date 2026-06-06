import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary binary storage for chat attachments and campaign images.
 *
 * Configuration is read from environment variables. Either set `CLOUDINARY_URL`
 * (cloudinary://<api_key>:<api_secret>@<cloud_name>) or the three discrete vars:
 *   - CLOUDINARY_CLOUD_NAME
 *   - CLOUDINARY_API_KEY
 *   - CLOUDINARY_API_SECRET
 *
 * Uploads are server-side and signed, so no unsigned preset or secret is ever
 * exposed to the browser.
 */

let configured = false;

function ensureConfigured() {
  if (configured) return;
  // The SDK auto-reads CLOUDINARY_URL; only set discrete vars when present.
  if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
  configured = true;
}

export function isCloudinaryConfigured(): boolean {
  return cloudinaryConfigError() === null;
}

/**
 * Returns a human-readable reason when Cloudinary is not usable, or null when
 * it is correctly configured. Used to surface an actionable error instead of a
 * generic "could not host" message.
 */
export function cloudinaryConfigError(): string | null {
  if (process.env.CLOUDINARY_URL) return null;

  const missing = (
    [
      ['CLOUDINARY_CLOUD_NAME', process.env.CLOUDINARY_CLOUD_NAME],
      ['CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY],
      ['CLOUDINARY_API_SECRET', process.env.CLOUDINARY_API_SECRET]
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length === 0) return null;
  return `Cloudinary is not configured: missing ${missing.join(', ')}`;
}

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

/**
 * Uploads a file buffer to Cloudinary and returns its secure URL.
 *
 * @param buffer   Raw file bytes.
 * @param folder   Logical folder (e.g. `openong/<subdomain>`).
 * @param mimeType Used to pick the resource type (image vs raw file).
 */
export async function uploadToCloudinary(
  buffer: ArrayBuffer,
  folder: string,
  mimeType: string
): Promise<CloudinaryUploadResult> {
  ensureConfigured();

  const resourceType = mimeType.startsWith('image/') ? 'image' : 'raw';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Force public delivery: `type: 'upload'` (not 'authenticated'/'private')
        // and `access_mode: 'public'` so the secure_url is openly accessible even
        // if the account defaults assets to restricted access.
        type: 'upload',
        access_mode: 'public'
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload returned no result'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(Buffer.from(buffer));
  });
}
