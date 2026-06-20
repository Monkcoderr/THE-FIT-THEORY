import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
