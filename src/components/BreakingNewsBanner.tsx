import React, { useState } from 'react';
import { Zap, X, Sparkles, ArrowUpRight, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface BreakingNewsBannerProps {
  breakingNews: NewsItem[];
  onSelectNews: (id: string) => void;
  onOpenAiSummary?: () => void;
}

export function BreakingNewsBanner({
  breakingNews,
  onSelectNews,
  onOpenAiSummary,
}: BreakingNewsBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (dismissed || breakingNews.length === 0) return null;

  const currentItem = breakingNews[currentIndex] || breakingNews[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 dark:border-rose-500/20 bg-gradient-to-r from-rose-950/30 via-zinc-900/90 to-zinc-950/90 backdrop-blur-xl p-3.5 sm:p-4 text-white shadow-lg transition-all linear-glow">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Badge variant="breaking" className="shrink-0 text-[10px] px-2.5 py-1 rounded-xl shadow-xs gap-1.5 font-bold uppercase tracking-wider">
            <Zap className="h-3 w-3 fill-rose-500 text-rose-500 animate-pulse" />
            BREAKING INTEL
          </Badge>

          <button
            onClick={() => onSelectNews(currentItem.id)}
            className="group flex items-center gap-2 text-left text-xs sm:text-sm font-medium text-zinc-100 hover:text-rose-300 transition-colors truncate cursor-pointer"
          >
            <span className="truncate">{currentItem.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-rose-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {breakingNews.length > 1 && (
            <button
              onClick={handleNext}
              className="text-[11px] font-mono text-zinc-300 hover:text-white px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{currentIndex + 1}/{breakingNews.length}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          )}

          {onOpenAiSummary && (
            <Button
              variant="linear"
              size="sm"
              onClick={onOpenAiSummary}
              className="h-8 text-xs gap-1.5 px-3 rounded-xl font-medium cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              AI Executive Brief
            </Button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
