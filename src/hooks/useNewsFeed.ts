import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { NewsItem, CategoryId, Sentiment } from '../types';
import { MOCK_NEWS } from '../data/mockNews';

export interface UseNewsFeedOptions {
  category: CategoryId;
  sentiment: 'all' | Sentiment;
  sortBy: 'latest' | 'impact' | 'trending';
  searchQuery: string;
  onlyBreaking: boolean;
}

export function useNewsFeed(options: UseNewsFeedOptions) {
  const queryClient = useQueryClient();

  // Infinite Query for news items
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['newsFeed', options.category, options.sentiment, options.sortBy, options.searchQuery, options.onlyBreaking],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const params = new URLSearchParams({
          page: String(pageParam),
          limit: '9'
        });
        if (options.category !== 'all') {
          params.append('category', options.category);
        }

        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch backend news');
        }

        const json = await res.json();
        const rawArticles = json.articles || [];

        const mappedArticles: NewsItem[] = rawArticles.map((item: any, idx: number) => {
          const ai = item.aiEnrichment;
          return {
            id: item.id || `backend_${pageParam}_${idx}`,
            title: item.title || 'Untitled Article',
            summary: ai?.shortSummary || item.summary || item.title || '',
            fullContent: ai?.mediumSummary || item.content || item.summary || item.title || '',
            category: (item.category?.toLowerCase() || 'general') as CategoryId,
            publishedAt: item.publishedAt || new Date().toISOString(),
            readTimeMinutes: Math.max(2, Math.floor(((item.content || item.summary || '').length) / 300)),
            source: {
              name: item.sourceName || 'News Stream',
              domain: item.sourceName ? `${item.sourceName.toLowerCase().replace(/\s+/g, '')}.com` : 'news.com',
              verified: true,
              logoUrl: item.imageUrl || undefined
            },
            keyTakeaways: ai?.bulletSummary && ai.bulletSummary.length > 0
              ? ai.bulletSummary
              : Array.isArray(item.keyTakeaways) && item.keyTakeaways.length > 0
              ? item.keyTakeaways
              : [
                  item.summary || item.title || 'Key news update from verified source.',
                  `Source: ${item.sourceName || 'News Collector'}`,
                  `Category: ${item.category || 'General'}`
                ],
            entities: ai
              ? Array.from(new Set([...(ai.importantPersons || []), ...(ai.importantPlaces || []), ...(ai.keyTopics || [])]))
              : Array.isArray(item.entities) && item.entities.length > 0
              ? item.entities
              : [item.category || 'News', item.sourceName || 'Media'],
            sentiment: (ai?.sentiment || item.sentiment || 'neutral') as Sentiment,
            impactScore: 82 + ((idx + pageParam) % 15),
            isBreaking: idx === 0 && pageParam === 1,
            isTrending: idx < 3,
            url: item.link || '#',
            bookmarkCount: 12 + idx,
            viewsCount: 240 + idx * 10,
            aiEnrichment: ai || undefined
          };
        });

        // Merge with MOCK_NEWS on page 1 if list is short
        let finalArticles = mappedArticles;
        if (pageParam === 1 && rawArticles.length < 5) {
          const existingIds = new Set(mappedArticles.map(a => a.id));
          const uniqueMocks = MOCK_NEWS.filter(m => !existingIds.has(m.id));
          finalArticles = [...mappedArticles, ...uniqueMocks];
        }

        return {
          articles: finalArticles,
          page: pageParam,
          hasMore: json.hasMore !== undefined ? json.hasMore : (pageParam < 3 && rawArticles.length > 0)
        };
      } catch (err) {
        console.warn('News API fetch error, returning fallback page:', err);
        return {
          articles: pageParam === 1 ? MOCK_NEWS : [],
          page: pageParam,
          hasMore: false
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 1000 * 60 * 2 // 2 minutes cache
  });

  // Flatten pages into single list
  const allFetchedItems = useMemo(() => {
    if (!data?.pages) return MOCK_NEWS;
    const combined: NewsItem[] = [];
    const seen = new Set<string>();

    for (const page of data.pages) {
      for (const article of page.articles) {
        if (!seen.has(article.id)) {
          seen.add(article.id);
          combined.push(article);
        }
      }
    }
    return combined.length > 0 ? combined : MOCK_NEWS;
  }, [data]);

  // Client-side filtering & sorting
  const filteredArticles = useMemo(() => {
    return allFetchedItems.filter((item) => {
      if (options.category !== 'all' && item.category !== options.category) {
        return false;
      }
      if (options.sentiment !== 'all' && item.sentiment !== options.sentiment) {
        return false;
      }
      if (options.onlyBreaking && !item.isBreaking) {
        return false;
      }
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesEntity = (item.entities || []).some((e) => e.toLowerCase().includes(query));
        const matchesSource = item.source.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesEntity && !matchesSource) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (options.sortBy === 'impact') {
        return b.impactScore - a.impactScore;
      }
      if (options.sortBy === 'trending') {
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      }
      // Latest
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [allFetchedItems, options]);

  return {
    articles: filteredArticles,
    allFetchedItems,
    isLoading,
    isError,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}
