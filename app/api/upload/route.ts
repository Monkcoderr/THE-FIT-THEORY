import { NextRequest, NextResponse } from 'next/server';
import cloudinary, {
  PRODUCT_UPLOAD_OPTIONS,
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
} from '@/lib/cloudinary';
import { getSessionFromCookies } from '@/lib/auth';

export const runtime = 'nodejs';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function POST(request: NextRequest) {
  // Auth guard (defense-in-depth on top of middleware)
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate that Cloudinary is configured (either via individual vars or CLOUDINARY_URL)
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    return NextResponse.json(
      {
        error: 'Cloudinary is not configured on the server.',
        detail: 'Missing environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) or CLOUDINARY_URL in the deployment settings.',
      },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid form submission.' },
      { status: 400 }
    );
  }

  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'No file provided.' },
      { status: 400 }
    );
  }

  // Validate MIME type BEFORE upload
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Use JPG, PNG, or WebP.' },
      { status: 415 }
    );
  }

  // Validate size BEFORE upload
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 5MB.' },
      { status: 413 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          PRODUCT_UPLOAD_OPTIONS,
          (err, res) => {
            if (err || !res) {
              reject(err ?? new Error('Upload failed'));
              return;
            }
            resolve(res as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    const detail =
      err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Image upload failed. Please try again.',
        detail,
      },
      { status: 500 }
    );
  }
}
