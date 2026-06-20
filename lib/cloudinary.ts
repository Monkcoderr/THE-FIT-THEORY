import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else {
  // If individual variables are not set, let Cloudinary auto-configure
  // from CLOUDINARY_URL (if present), but ensure secure transfers.
  cloudinary.config({
    secure: true,
  });
}

export default cloudinary;

// Cloudinary upload options for product images
export const PRODUCT_UPLOAD_OPTIONS = {
  folder: 'fit-theory/products',
  transformation: [
    { quality: 'auto', fetch_format: 'auto' },
    { width: 1200, crop: 'limit' },
  ],
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
};

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Kept under Vercel's ~4.5MB serverless function request body limit so
// large uploads fail with a clear message instead of a platform-level 413.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
