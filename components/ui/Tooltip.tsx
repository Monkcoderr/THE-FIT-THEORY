'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  theme?: 'admin' | 'nike';
}

export default function Tooltip({
  content,
  children,
  side = 'top',
  theme = 'admin',
}: TooltipProps) {
  const isAdmin = theme === 'admin';

  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-[70] select-none rounded-md px-2.5 py-1.5 text-xs shadow-md animate-scale-in',
              isAdmin
                ? 'border border-admin-border bg-admin-surface text-admin-text'
                : 'bg-nike-ink text-white'
            )}
          >
            {content}
            <RadixTooltip.Arrow
              className={isAdmin ? 'fill-admin-surface' : 'fill-nike-ink'}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
