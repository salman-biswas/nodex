import React from 'react';

interface NewsSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'compact';
}

export function NewsSkeleton({ count = 6, viewMode = 'grid' }: NewsSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (viewMode === 'compact') {
    return (
      <div className="flex flex-col space-y-2.5 w-full">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5"
          >
            <div className="flex flex-col space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </div>
              <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            </div>
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            </div>
            <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          </div>

          {/* Summary */}
          <div className="space-y-1 pt-1">
            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
            <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
            <div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div className="h-7 w-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
