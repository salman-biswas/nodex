import React from 'react';
import { Radio } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-lg py-6 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
            <Radio className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
            Nodex News Intelligence
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span>© 2026</span>
        </div>

        <div className="text-[11px] text-zinc-400">
          Verified Sources: The Daily Star, Prothom Alo, TBS, Financial Express
        </div>
      </div>
    </footer>
  );
}
