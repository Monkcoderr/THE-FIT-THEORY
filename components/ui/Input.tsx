'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  theme?: 'admin' | 'nike';
  leftElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, theme = 'admin', leftElement, id, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isAdmin = theme === 'admin';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              isAdmin ? 'text-admin-text' : 'text-nike-ink'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              'h-11 w-full text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              leftElement ? 'pl-10 pr-3' : 'px-3',
              isAdmin
                ? 'rounded-md border border-admin-border bg-admin-surface-2 text-admin-text placeholder:text-admin-mute focus:border-admin-blue focus:ring-1 focus:ring-admin-blue'
                : 'rounded-md border border-nike-hairline bg-white text-nike-ink placeholder:text-nike-stone focus:border-nike-ink focus:ring-1 focus:ring-nike-ink',
              error &&
                (isAdmin
                  ? 'border-admin-red focus:border-admin-red focus:ring-admin-red'
                  : 'border-nike-sale focus:border-nike-sale focus:ring-nike-sale'),
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p
            className={cn(
              'mt-1.5 text-xs',
              isAdmin ? 'text-admin-red' : 'text-nike-sale'
            )}
          >
            {error}
          </p>
        ) : hint ? (
          <p
            className={cn(
              'mt-1.5 text-xs',
              isAdmin ? 'text-admin-mute' : 'text-nike-mute'
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
