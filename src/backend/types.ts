export type SourceType = 'rss' | 'official_api' | 'web_scraper';

export interface NewsSource {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  category: string;
  enabled: boolean;
  selector?: string; // For web scraper (e.g., 'article.news-card', 'a.title')
  apiKey?: string;   // For official APIs
  description?: string;
  lastFetchedAt?: string;
}

export interface RawNewsItem {
  title: string;
  link: string;
  summary?: string;
  content?: string;
  publishedAt?: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  category: string;
  author?: string;
  imageUrl?: string;
}

export interface AiEnrichment {
  shortSummary: string;
  mediumSummary: string;
  bulletSummary: string[];
  headlineRewrite: string;
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  importantPersons: string[];
  importantPlaces: string[];
  keywords: string[];
  generatedAt: string;
}

export interface NewsItem extends RawNewsItem {
  id: string;
  canonicalUrl: string;
  contentHash: string;
  titleFingerprint: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
  similarityScore?: number;
  aiEnrichment?: AiEnrichment;
  createdAt: string;
  updatedAt: string;
}

export interface DeduplicationResult {
  uniqueItem: NewsItem;
  isDuplicate: boolean;
  duplicateOfId?: string;
  similarityScore?: number;
  reason?: string;
}

export interface PipelineRunLog {
  id: string;
  timestamp: string;
  durationMs: number;
  sourcesProcessed: number;
  rawCollected: number;
  newUniqueSaved: number;
  duplicatesDetected: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  logs: string[];
}

export interface SchedulerStatus {
  isRunning: boolean;
  intervalMinutes: number;
  lastRunTime?: string;
  nextRunTime?: string;
  totalRuns: number;
  totalArticlesCollected: number;
  totalDuplicatesDetected: number;
  usingSupabase: boolean;
  supabaseUrlConfigured: boolean;
}

export interface DatabaseStatus {
  type: 'supabase' | 'in_memory';
  connected: boolean;
  message: string;
  url?: string;
  tableSchemaSql: string;
}
