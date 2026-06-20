'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Camera, Loader2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

// Keep in sync with MAX_UPLOAD_BYTES in lib/cloudinary.ts.
// Kept under Vercel's ~4.5MB serverless request body limit.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  value,
  onChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef<number | null>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const remaining = maxImages - value.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }
      const toUpload = list.slice(0, remaining);
      setUploading(true);

      const uploaded: string[] = [];
      for (const file of toUpload) {
        // Guard client-side against the platform body limit (Vercel rejects
        // request bodies > ~4.5MB before the API route runs).
        if (file.size > MAX_UPLOAD_BYTES) {
          toast.error(
            `"${file.name}" is too large (max ${Math.round(
              MAX_UPLOAD_BYTES / (1024 * 1024)
            )}MB).`
          );
          continue;
        }

        const fd = new FormData();
        fd.append('file', file);
        try {
          // eslint-disable-next-line no-await-in-loop
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: fd,
          });

          // The platform may reject oversized/blocked requests with a
          // non-JSON body (e.g. a 413). Parse defensively so we never
          // surface a misleading "check your connection" message.
          // eslint-disable-next-line no-await-in-loop
          const data = await res.json().catch(() => null);

          if (!res.ok) {
            if (res.status === 413) {
              toast.error(
                `"${file.name}" is too large for the server (max ~4MB).`
              );
            } else {
              const base = data?.error ?? `Upload failed (HTTP ${res.status})`;
              toast.error(data?.detail ? `${base} (${data.detail})` : base);
            }
            continue;
          }

          if (!data?.url) {
            toast.error('Upload failed: unexpected server response.');
            continue;
          }
          uploaded.push(data.url);
        } catch {
          toast.error('Upload failed. Check your connection.');
        }
      }

      if (uploaded.length) {
        onChange([...value, ...uploaded]);
        toast.success(
          `${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`
        );
      }
      setUploading(false);
    },
    [value, onChange, maxImages]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors',
          dragOver
            ? 'border-admin-blue bg-admin-blue/5'
            : 'border-admin-border bg-admin-surface-2'
        )}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-admin-blue" />
        ) : (
          <UploadCloud className="h-6 w-6 text-admin-mute" />
        )}
        <p className="mt-2 text-sm text-admin-text-soft">
          Drag &amp; drop images, or
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-admin-border bg-admin-surface px-3 text-sm text-admin-text hover:bg-admin-surface-2 disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" /> Browse
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-admin-border bg-admin-surface px-3 text-sm text-admin-text hover:bg-admin-surface-2 disabled:opacity-50 sm:hidden"
          >
            <Camera className="h-4 w-4" /> Camera
          </button>
        </div>
        <p className="mt-2 text-xs text-admin-mute">
          JPG, PNG, WebP · up to 4MB · {value.length}/{maxImages}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null) reorder(dragIndex.current, i);
                dragIndex.current = null;
              }}
              className="group relative aspect-square overflow-hidden rounded-md border border-admin-border bg-admin-surface-2"
            >
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-admin-blue px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}
              <span className="absolute right-1 top-1 cursor-grab rounded bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-3 w-3" />
              </span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-admin-red group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
