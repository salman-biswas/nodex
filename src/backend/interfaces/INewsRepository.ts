import { DatabaseStatus, NewsItem, NewsSource, PipelineRunLog } from '../types';

export interface INewsRepository {
  /**
   * Initializes database schema or fallback storage connection.
   */
  initialize(): Promise<void>;

  /**
   * Checks database connection status.
   */
  getDatabaseStatus(): Promise<DatabaseStatus>;

  /**
   * Retrieves all news items, optionally filtering by source, category, or duplicate status.
   */
  getAllNews(options?: {
    includeDuplicates?: boolean;
    sourceId?: string;
    category?: string;
    limit?: number;
  }): Promise<NewsItem[]>;

  /**
   * Saves a collection of news items (unique & duplicate records).
   */
  saveNewsItems(items: NewsItem[]): Promise<{ savedCount: number; errors: string[] }>;

  /**
   * Retrieves all news sources.
   */
  getSources(): Promise<NewsSource[]>;

  /**
   * Saves or updates a news source.
   */
  saveSource(source: NewsSource): Promise<NewsSource>;

  /**
   * Deletes a news source by ID.
   */
  deleteSource(sourceId: string): Promise<boolean>;

  /**
   * Logs a pipeline execution run.
   */
  logPipelineRun(log: PipelineRunLog): Promise<void>;

  /**
   * Retrieves recent pipeline run logs.
   */
  getPipelineLogs(limit?: number): Promise<PipelineRunLog[]>;
}
