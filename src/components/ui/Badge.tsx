import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'breaking' | 'positive' | 'negative' | 'high-impact' | 'pulse';
  children: React.ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors shrink-0';

  const variants = {
    default:
      'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700',
    secondary:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
    outline:
      'border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 bg-transparent',
    breaking:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold animate-pulse',
    positive:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    negative:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20',
    'high-impact':
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold',
    pulse:
      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
