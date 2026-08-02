import React, { useEffect, useRef } from 'react';
import { NewsItem } from '../types';
import { NewsCard } from './NewsCard';
import { NewsSkeleton } from './NewsSkeleton';
import { FileQuestion, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

interface NewsGridProps {
  items: NewsItem[];
  onSelectNews: (id: string) => void;
  viewMode: 'grid' | 'compact';
  onResetFilters?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
}

export function NewsGrid({
  items,
  onSelectNews,
  viewMode,
  onResetFilters,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage
}: NewsGridProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Setup Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage || !onFetchNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  if (isLoading) {
    return <NewsSkeleton count={6} viewMode={viewMode} />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center my-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
          <FileQuestion className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          No Intelligence Reports Match Filter
        </h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
          Try expanding your category search or resetting sentiment filters to view all live news streams.
        </p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters} className="mt-4 gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'flex flex-col space-y-2.5'
        }
      >
        {items.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            onSelect={onSelectNews}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Infinite Scroll Bottom Loading State / Sentinel */}
      <div ref={sentinelRef} className="pt-4 pb-8 flex flex-col items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 rounded-full border border-emerald-500/20">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more live intelligence reports...</span>
          </div>
        )}

        {!hasNextPage && items.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 dark:text-zinc-500 pt-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>All live news intelligence streams loaded ({items.length} stories)</span>
          </div>
        )}
      </div>
    </div>
  );
}
