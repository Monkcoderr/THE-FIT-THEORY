'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  theme?: 'admin' | 'nike';
  className?: string;
  disabled?: boolean;
}

export default function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  label,
  error,
  theme = 'admin',
  className,
  disabled,
}: SelectProps) {
  const isAdmin = theme === 'admin';

  return (
    <div className="w-full">
      {label && (
        <label
          className={cn(
            'mb-1.5 block text-sm font-medium',
            isAdmin ? 'text-admin-text' : 'text-nike-ink'
          )}
        >
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          aria-invalid={!!error}
          className={cn(
            'flex h-11 w-full items-center justify-between gap-2 px-3 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            isAdmin
              ? 'rounded-md border border-admin-border bg-admin-surface-2 text-admin-text focus:border-admin-blue focus:ring-1 focus:ring-admin-blue data-[placeholder]:text-admin-mute'
              : 'rounded-md border border-nike-hairline bg-white text-nike-ink focus:border-nike-ink data-[placeholder]:text-nike-stone',
            error && (isAdmin ? 'border-admin-red' : 'border-nike-sale'),
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-[60] max-h-[300px] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md shadow-lg animate-scale-in',
              isAdmin
                ? 'border border-admin-border bg-admin-surface text-admin-text'
                : 'border border-nike-hairline bg-white text-nike-ink'
            )}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex h-9 cursor-pointer select-none items-center rounded px-8 text-sm outline-none data-[highlighted]:outline-none',
                    isAdmin
                      ? 'data-[highlighted]:bg-admin-surface-2 data-[state=checked]:text-admin-blue'
                      : 'data-[highlighted]:bg-nike-cloud data-[state=checked]:font-medium'
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && (
        <p
          className={cn(
            'mt-1.5 text-xs',
            isAdmin ? 'text-admin-red' : 'text-nike-sale'
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
