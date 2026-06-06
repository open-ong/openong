'use client';

import { useRef, useState } from 'react';

/**
 * Puck custom field: upload an image to Cloudinary (via /api/files/upload) or
 * paste a URL. Stores the resulting hosted URL as the field value.
 */
export function CloudinaryImageField({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'openong/pages');
      const res = await fetch('/api/files/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'No se pudo subir la imagen');
      if (json?.storageError) throw new Error(json.storageError);
      if (!json?.attachment?.url) {
        throw new Error('La imagen se subió pero no devolvió URL');
      }
      onChange(json.attachment.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          style={{
            width: '100%',
            maxHeight: 140,
            objectFit: 'cover',
            borderRadius: 8,
            border: '1px solid #e5e7eb'
          }}
        />
      ) : null}

      <input
        type="text"
        value={value ?? ''}
        placeholder="URL de la imagen o subí un archivo"
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          fontSize: 13,
          borderRadius: 6,
          border: '1px solid #d1d5db'
        }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 6,
            border: '1px solid #2563eb',
            background: uploading ? '#93c5fd' : '#2563eb',
            color: '#fff',
            cursor: uploading ? 'default' : 'pointer'
          }}
        >
          {uploading ? 'Subiendo…' : 'Subir imagen'}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              padding: '8px 10px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            Quitar
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {error ? (
        <span style={{ color: '#dc2626', fontSize: 12 }}>{error}</span>
      ) : null}
    </div>
  );
}
