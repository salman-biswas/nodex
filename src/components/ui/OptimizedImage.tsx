import React, { useState } from 'react';
import { Newspaper } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  fallbackCategory?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = '16/9',
  fallbackCategory,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-4/3';
      case '1/1':
        return 'aspect-square';
      default:
        return '';
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-xl p-4 ${getAspectClass()} ${className}`}
      >
        <Newspaper className="h-8 w-8 mb-1.5 opacity-60 text-emerald-500" />
        <span className="text-[10px] font-mono font-medium uppercase tracking-wider">
          {fallbackCategory || 'News Image'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-xl ${getAspectClass()} ${className}`}>
      {/* Skeleton Pulse loader before image load */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
