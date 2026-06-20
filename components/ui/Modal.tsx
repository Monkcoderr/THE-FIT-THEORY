'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** 'admin' (dark, centered) or 'nike' (light, centered/sheet) */
  theme?: 'admin' | 'nike';
  showClose?: boolean;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  theme = 'admin',
  showClose = true,
}: ModalProps) {
  const isAdmin = theme === 'admin';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 animate-fade-in',
            isAdmin ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/50'
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 animate-scale-in shadow-2xl focus:outline-none',
            isAdmin
              ? 'rounded-lg border border-admin-border bg-admin-surface text-admin-text'
              : 'rounded-2xl bg-white text-nike-ink',
            'p-6',
            className
          )}
        >
          {(title || showClose) && (
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                {title && (
                  <Dialog.Title
                    className={cn(
                      'text-lg font-semibold',
                      isAdmin ? 'text-admin-text' : 'text-nike-ink'
                    )}
                  >
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description
                    className={cn(
                      'mt-1 text-sm',
                      isAdmin ? 'text-admin-text-soft' : 'text-nike-mute'
                    )}
                  >
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showClose && (
                <Dialog.Close
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors',
                    isAdmin
                      ? 'text-admin-text-soft hover:bg-admin-surface-2 hover:text-admin-text'
                      : 'text-nike-mute hover:bg-nike-cloud hover:text-nike-ink'
                  )}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              )}
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
