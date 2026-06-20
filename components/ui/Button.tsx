'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Visual theme: 'nike' = square pill light store, 'admin' = Vercel dark */
  theme?: 'nike' | 'admin';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      theme = 'admin',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] whitespace-nowrap select-none';

    const sizes: Record<Size, string> = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-sm', // 44px min touch target
      lg: 'h-12 px-8 text-base',
      icon: 'h-11 w-11',
    };

    // Nike: square-ish pill, bold, black/white
    const nikeVariants: Record<Variant, string> = {
      primary:
        'bg-nike-ink text-white rounded-full hover:bg-nike-charcoal focus-visible:ring-nike-ink',
      secondary:
        'bg-nike-cloud text-nike-ink rounded-full hover:bg-nike-hairline-soft focus-visible:ring-nike-ink',
      outline:
        'bg-white text-nike-ink border border-nike-hairline rounded-full hover:border-nike-ink focus-visible:ring-nike-ink',
      ghost:
        'bg-transparent text-nike-ink rounded-full hover:bg-nike-cloud focus-visible:ring-nike-ink',
      danger:
        'bg-nike-sale text-white rounded-full hover:bg-nike-sale-deep focus-visible:ring-nike-sale',
      success:
        'bg-nike-success text-white rounded-full hover:opacity-90 focus-visible:ring-nike-success',
    };

    // Admin: Vercel pill / rounded-md, blue accent on dark shell
    const adminVariants: Record<Variant, string> = {
      primary:
        'bg-admin-blue text-white rounded-md hover:bg-admin-blue-hover focus-visible:ring-admin-blue focus-visible:ring-offset-admin-bg',
      secondary:
        'bg-admin-surface-2 text-admin-text border border-admin-border rounded-md hover:bg-admin-border focus-visible:ring-admin-blue focus-visible:ring-offset-admin-bg',
      outline:
        'bg-transparent text-admin-text border border-admin-border rounded-md hover:border-admin-text-soft focus-visible:ring-admin-blue focus-visible:ring-offset-admin-bg',
      ghost:
        'bg-transparent text-admin-text-soft rounded-md hover:bg-admin-surface-2 hover:text-admin-text focus-visible:ring-admin-blue focus-visible:ring-offset-admin-bg',
      danger:
        'bg-admin-red text-white rounded-md hover:opacity-90 focus-visible:ring-admin-red focus-visible:ring-offset-admin-bg',
      success:
        'bg-admin-green text-black rounded-md hover:opacity-90 focus-visible:ring-admin-green focus-visible:ring-offset-admin-bg',
    };

    const variants = theme === 'nike' ? nikeVariants : adminVariants;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          sizes[size],
          variants[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
