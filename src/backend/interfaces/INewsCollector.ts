import { NewsSource, RawNewsItem, SourceType } from '../types';

/**
 * Single Responsibility Principle (SRP): Each collector is ONLY responsible
 * for fetching and parsing raw news from its respective source type.
 * 
 * Liskov Substitution Principle (LSP): Any collector implementation can be
 * substituted seamlessly in the collection pipeline.
 */
export interface INewsCollector {
  readonly collectorType: SourceType;
  
  /**
   * Checks whether this collector supports the given source.
   */
  supports(source: NewsSource): boolean;

  /**
   * Fetches raw news items from the specified news source.
   */
  collect(source: NewsSource): Promise<RawNewsItem[]>;
}
