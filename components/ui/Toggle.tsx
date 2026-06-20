'use client';

import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  theme?: 'admin' | 'nike';
  id?: string;
}

export default function Toggle({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  theme = 'admin',
  id,
}: ToggleProps) {
  const isAdmin = theme === 'admin';

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'text-sm font-medium',
                isAdmin ? 'text-admin-text' : 'text-nike-ink'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span
              className={cn(
                'text-xs',
                isAdmin ? 'text-admin-mute' : 'text-nike-mute'
              )}
            >
              {description}
            </span>
          )}
        </div>
      )}
      <RadixSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          isAdmin
            ? 'bg-admin-border data-[state=checked]:bg-admin-blue focus-visible:ring-admin-blue focus-visible:ring-offset-admin-bg'
            : 'bg-nike-hairline data-[state=checked]:bg-nike-ink focus-visible:ring-nike-ink'
        )}
      >
        <RadixSwitch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
      </RadixSwitch.Root>
    </div>
  );
}
