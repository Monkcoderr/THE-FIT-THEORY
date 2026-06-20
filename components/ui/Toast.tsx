'use client';

// Centralized toast helpers built on Sonner.
// The <Toaster /> is mounted once in app/layout.tsx.

import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),
  info: (message: string, description?: string) =>
    sonnerToast.message(message, { description }),
  loading: (message: string) => sonnerToast.loading(message),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
};

export default toast;
