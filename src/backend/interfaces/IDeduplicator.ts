import { DeduplicationResult, NewsItem, RawNewsItem } from '../types';

export interface IDeduplicator {
  /**
   * Evaluates a raw collected news item against existing items in storage/cache
   * to determine if it is a duplicate and calculate similarity metrics.
   */
  processItem(
    rawItem: RawNewsItem,
    existingItems: NewsItem[]
  ): DeduplicationResult;

  /**
   * Normalizes a news title to create a canonical fingerprint string for fast lookup.
   */
  createTitleFingerprint(title: string): string;

  /**
   * Calculates similarity ratio (0 to 1) between two titles.
   */
  calculateSimilarity(titleA: string, titleB: string): number;
}
