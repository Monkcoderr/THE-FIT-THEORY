'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  variant?: 'danger' | 'primary';
  theme?: 'admin' | 'nike';
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  loading = false,
  variant = 'danger',
  theme = 'admin',
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      theme={theme}
      showClose={false}
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        {variant === 'danger' && (
          <div className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admin-red/10 sm:mb-0 sm:mr-4">
            <AlertTriangle className="h-5 w-5 text-admin-red" />
          </div>
        )}
        <div>
          <h3
            className={
              theme === 'admin'
                ? 'text-lg font-semibold text-admin-text'
                : 'text-lg font-semibold text-nike-ink'
            }
          >
            {title}
          </h3>
          {description && (
            <p
              className={
                theme === 'admin'
                  ? 'mt-1 text-sm text-admin-text-soft'
                  : 'mt-1 text-sm text-nike-mute'
              }
            >
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          theme={theme}
          variant="ghost"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          theme={theme}
          variant={variant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
