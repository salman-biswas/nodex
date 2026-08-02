import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INewsRepository } from '../interfaces/INewsRepository';
import { DatabaseStatus, NewsItem, NewsSource, PipelineRunLog } from '../types';

export class SupabaseNewsRepository implements INewsRepository {
  private client: SupabaseClient | null = null;
  private supabaseUrl: string;
  private supabaseKey: string;
  private isConnected: boolean = false;

  constructor(url?: string, key?: string) {
    this.supabaseUrl = url || process.env.SUPABASE_URL || '';
    this.supabaseKey = key || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  }

  async initialize(): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('[SupabaseNewsRepository] Missing SUPABASE_URL or SUPABASE_ANON_KEY/SERVICE_ROLE_KEY');
      this.isConnected = false;
      return;
    }

    try {
      this.client = createClient(this.supabaseUrl, this.supabaseKey, {
        auth: { persistSession: false }
      });

      // Quick ping test
      const { error } = await this.client.from('news_sources').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.warn('[SupabaseNewsRepository] Connection test note:', error.message);
      }
      this.isConnected = true;
      console.log('[SupabaseNewsRepository] Connected successfully to Supabase:', this.supabaseUrl);
    } catch (err) {
      console.error('[SupabaseNewsRepository] Error initializing client:', err);
      this.isConnected = false;
    }
  }

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    return {
      type: 'supabase',
      connected: this.isConnected,
      url: this.supabaseUrl || 'Not configured',
      message: this.isConnected
        ? `Connected to Supabase project at ${this.supabaseUrl}`
        : 'Supabase credentials missing or unreachable. Falling back to local/in-memory database.',
      tableSchemaSql: this.getSupabaseSchemaSql()
    };
  }

  async getAllNews(options?: {
    includeDuplicates?: boolean;
    sourceId?: string;
    category?: string;
    limit?: number;
  }): Promise<NewsItem[]> {
    if (!this.client) return [];

    let query = this.client.from('news_items').select('*');

    if (!options?.includeDuplicates) {
      query = query.eq('is_duplicate', false);
    }

    if (options?.sourceId) {
      query = query.eq('source_id', options.sourceId);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    query = query.order('published_at', { ascending: false }).limit(options?.limit || 100);

    const { data, error } = await query;

    if (error) {
      console.error('[SupabaseNewsRepository] Error fetching news:', error.message);
      return [];
    }

    return (data || []).map(row => this.mapRowToNewsItem(row));
  }

  async saveNewsItems(items: NewsItem[]): Promise<{ savedCount: number; errors: string[] }> {
    if (!this.client || items.length === 0) return { savedCount: 0, errors: [] };

    const rows = items.map(item => this.mapNewsItemToRow(item));
    const { data, error } = await this.client
      .from('news_items')
      .upsert(rows, { onConflict: 'canonical_url', ignoreDuplicates: false })
      .select('id');

    if (error) {
      console.error('[SupabaseNewsRepository] Error upserting items:', error.message);
      return { savedCount: 0, errors: [error.message] };
    }

    return { savedCount: data ? data.length : items.length, errors: [] };
  }

  async getSources(): Promise<NewsSource[]> {
    if (!this.client) return [];

    const { data, error } = await this.client.from('news_sources').select('*');
    if (error) {
      console.error('[SupabaseNewsRepository] Error fetching sources:', error.message);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      url: row.url,
      category: row.category,
      enabled: row.enabled,
      selector: row.selector,
      apiKey: row.api_key,
      description: row.description,
      lastFetchedAt: row.last_fetched_at
    }));
  }

  async saveSource(source: NewsSource): Promise<NewsSource> {
    if (!this.client) return source;

    const row = {
      id: source.id,
      name: source.name,
      type: source.type,
      url: source.url,
      category: source.category,
      enabled: source.enabled,
      selector: source.selector,
      api_key: source.apiKey,
      description: source.description,
      last_fetched_at: source.lastFetchedAt
    };

    const { error } = await this.client.from('news_sources').upsert(row);
    if (error) {
      console.error('[SupabaseNewsRepository] Error saving source:', error.message);
    }
    return source;
  }

  async deleteSource(sourceId: string): Promise<boolean> {
    if (!this.client) return false;
    const { error } = await this.client.from('news_sources').delete().eq('id', sourceId);
    return !error;
  }

  async logPipelineRun(log: PipelineRunLog): Promise<void> {
    if (!this.client) return;

    const row = {
      id: log.id,
      timestamp: log.timestamp,
      duration_ms: log.durationMs,
      sources_processed: log.sourcesProcessed,
      raw_collected: log.rawCollected,
      new_unique_saved: log.newUniqueSaved,
      duplicates_detected: log.duplicatesDetected,
      status: log.status,
      logs: log.logs
    };

    await this.client.from('pipeline_logs').insert(row);
  }

  async getPipelineLogs(limit: number = 20): Promise<PipelineRunLog[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('pipeline_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) return [];

    return (data || []).map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      durationMs: row.duration_ms,
      sourcesProcessed: row.sources_processed,
      rawCollected: row.raw_collected,
      newUniqueSaved: row.new_unique_saved,
      duplicatesDetected: row.duplicates_detected,
      status: row.status,
      logs: row.logs || []
    }));
  }

  private mapRowToNewsItem(row: any): NewsItem {
    return {
      id: row.id,
      title: row.title,
      link: row.link,
      summary: row.summary,
      content: row.content,
      publishedAt: row.published_at,
      sourceId: row.source_id,
      sourceName: row.source_name,
      sourceType: row.source_type,
      category: row.category,
      author: row.author,
      imageUrl: row.image_url,
      canonicalUrl: row.canonical_url,
      contentHash: row.content_hash,
      titleFingerprint: row.title_fingerprint,
      isDuplicate: row.is_duplicate,
      duplicateOfId: row.duplicate_of_id,
      similarityScore: row.similarity_score,
      aiEnrichment: row.ai_enrichment || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapNewsItemToRow(item: NewsItem): any {
    return {
      id: item.id,
      title: item.title,
      link: item.link,
      summary: item.summary,
      content: item.content,
      published_at: item.publishedAt,
      source_id: item.sourceId,
      source_name: item.sourceName,
      source_type: item.sourceType,
      category: item.category,
      author: item.author,
      image_url: item.imageUrl,
      canonical_url: item.canonicalUrl,
      content_hash: item.contentHash,
      title_fingerprint: item.titleFingerprint,
      is_duplicate: item.isDuplicate,
      duplicate_of_id: item.duplicateOfId,
      similarity_score: item.similarityScore,
      ai_enrichment: item.aiEnrichment || null,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  }

  private getSupabaseSchemaSql(): string {
    return `-- Supabase DDL SQL Schema for News Intelligence System

-- 1. News Sources Table
CREATE TABLE IF NOT EXISTS public.news_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('rss', 'official_api', 'web_scraper')),
    url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    enabled BOOLEAN NOT NULL DEFAULT true,
    selector TEXT,
    api_key TEXT,
    description TEXT,
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. News Items Table (With Deduplication Indexes)
CREATE TABLE IF NOT EXISTS public.news_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_id TEXT NOT NULL REFERENCES public.news_sources(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    author TEXT,
    image_url TEXT,
    canonical_url TEXT NOT NULL UNIQUE,
    content_hash TEXT NOT NULL,
    title_fingerprint TEXT NOT NULL,
    is_duplicate BOOLEAN NOT NULL DEFAULT false,
    duplicate_of_id TEXT REFERENCES public.news_items(id) ON DELETE SET NULL,
    similarity_score NUMERIC(3, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance & deduplication
CREATE INDEX IF NOT EXISTS idx_news_items_canonical ON public.news_items(canonical_url);
CREATE INDEX IF NOT EXISTS idx_news_items_fingerprint ON public.news_items(title_fingerprint);
CREATE INDEX IF NOT EXISTS idx_news_items_published ON public.news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_duplicate ON public.news_items(is_duplicate);

-- 3. Pipeline Logs Table
CREATE TABLE IF NOT EXISTS public.pipeline_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_ms INTEGER NOT NULL,
    sources_processed INTEGER NOT NULL,
    raw_collected INTEGER NOT NULL,
    new_unique_saved INTEGER NOT NULL,
    duplicates_detected INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'PARTIAL', 'FAILED')),
    logs JSONB
);

-- Enable RLS & Policies for public read
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read sources" ON public.news_sources FOR SELECT USING (true);
CREATE POLICY "Allow public read news" ON public.news_items FOR SELECT USING (true);
CREATE POLICY "Allow public read logs" ON public.pipeline_logs FOR SELECT USING (true);
`;
  }
}
