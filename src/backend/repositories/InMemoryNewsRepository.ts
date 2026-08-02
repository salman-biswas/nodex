import { INewsRepository } from '../interfaces/INewsRepository';
import { DatabaseStatus, NewsItem, NewsSource, PipelineRunLog } from '../types';

export class InMemoryNewsRepository implements INewsRepository {
  private newsItems: Map<string, NewsItem> = new Map();
  private sources: Map<string, NewsSource> = new Map();
  private logs: PipelineRunLog[] = [];

  constructor() {
    this.seedDefaultSources();
    this.seedDefaultNews();
  }

  async initialize(): Promise<void> {
    console.log('[InMemoryNewsRepository] Initialized with', this.sources.size, 'sources and', this.newsItems.size, 'news items');
  }

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    return {
      type: 'in_memory',
      connected: true,
      message: 'Running in High-Performance Local In-Memory Store (Supabase credentials not configured). All collection & deduplication features active.',
      tableSchemaSql: this.getSupabaseSchemaSql()
    };
  }

  async getAllNews(options?: {
    includeDuplicates?: boolean;
    sourceId?: string;
    category?: string;
    limit?: number;
  }): Promise<NewsItem[]> {
    let items = Array.from(this.newsItems.values());

    if (!options?.includeDuplicates) {
      items = items.filter(i => !i.isDuplicate);
    }

    if (options?.sourceId) {
      items = items.filter(i => i.sourceId === options.sourceId);
    }

    if (options?.category) {
      items = items.filter(i => i.category.toLowerCase() === options.category?.toLowerCase());
    }

    // Sort by publication date descending
    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (options?.limit) {
      items = items.slice(0, options.limit);
    }

    return items;
  }

  async saveNewsItems(items: NewsItem[]): Promise<{ savedCount: number; errors: string[] }> {
    let savedCount = 0;
    for (const item of items) {
      this.newsItems.set(item.id, item);
      savedCount++;
    }
    return { savedCount, errors: [] };
  }

  async getSources(): Promise<NewsSource[]> {
    return Array.from(this.sources.values());
  }

  async saveSource(source: NewsSource): Promise<NewsSource> {
    this.sources.set(source.id, source);
    return source;
  }

  async deleteSource(sourceId: string): Promise<boolean> {
    return this.sources.delete(sourceId);
  }

  async logPipelineRun(log: PipelineRunLog): Promise<void> {
    this.logs.unshift(log);
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(0, 50);
    }
  }

  async getPipelineLogs(limit: number = 20): Promise<PipelineRunLog[]> {
    return this.logs.slice(0, limit);
  }

  private seedDefaultSources(): void {
    const defaultSources: NewsSource[] = [
      {
        id: 'src_bd_protthomalo',
        name: 'Prothom Alo RSS',
        type: 'rss',
        url: 'https://en.prothomalo.com/feed',
        category: 'Bangladesh',
        enabled: true,
        description: 'Leading Bangladesh national news outlet RSS feed'
      },
      {
        id: 'src_bbc_world',
        name: 'BBC World News RSS',
        type: 'rss',
        url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
        category: 'International',
        enabled: true,
        description: 'Global international affairs feed from BBC News'
      },
      {
        id: 'src_official_tech',
        name: 'Hacker News API',
        type: 'official_api',
        url: 'https://hn.algolia.com/api/v1/search?tags=front_page',
        category: 'Technology',
        enabled: true,
        description: 'Official tech & engineering JSON API'
      },
      {
        id: 'src_dhaka_tribune',
        name: 'Dhaka Tribune RSS',
        type: 'rss',
        url: 'https://news.google.com/rss/search?q=site:dhakatribune.com&hl=en-US&gl=US&ceid=US:en',
        category: 'Bangladesh',
        enabled: true,
        description: 'Bangladesh national daily newspaper RSS feed'
      },
      {
        id: 'src_scraped_press',
        name: 'Gov Press Release Bulletin',
        type: 'web_scraper',
        url: 'https://news.google.com/rss/search?q=Bangladesh+economy&hl=en-US&gl=US&ceid=US:en',
        category: 'Economy',
        enabled: true,
        selector: 'article, .news-card',
        description: 'Permitted public scraper for official Bangladesh economic announcements'
      }
    ];

    for (const src of defaultSources) {
      this.sources.set(src.id, src);
    }
  }

  private seedDefaultNews(): void {
    const now = new Date();
    const seededItems: NewsItem[] = [
      {
        id: 'seed_1',
        title: 'Bangladesh Tech Sector Exports Surge by 24% in Q3 Fiscal Report',
        link: 'https://en.prothomalo.com/business/local/bd-tech-exports- surge-2026',
        summary: 'Software and IT-enabled service exports from Bangladesh recorded significant growth led by expanding AI and fintech services.',
        content: 'Software and IT-enabled service exports from Bangladesh recorded significant growth led by expanding AI and fintech services across Asian and European markets.',
        publishedAt: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
        sourceId: 'src_bd_protthomalo',
        sourceName: 'Prothom Alo RSS',
        sourceType: 'rss',
        category: 'Bangladesh',
        author: 'Staff Reporter',
        canonicalUrl: 'https://en.prothomalo.com/business/local/bd-tech-exports-surge-2026',
        contentHash: 'hash_seed_1',
        titleFingerprint: 'bangladesh tech sector exports surge by 24 in q3 fiscal report',
        isDuplicate: false,
        aiEnrichment: {
          shortSummary: 'Bangladesh IT and software export revenues climbed 24% year-over-year in Q3.',
          mediumSummary: 'Driven by rising demand for localized AI software and cloud integration services, Bangladesh technology vendors achieved $420M in Q3 exports. European and ASEAN enterprise clients led expansion.',
          bulletSummary: [
            '24% growth YoY in IT/ITES exports reaching $420M total.',
            'Fintech and generative AI custom software generated 45% of total contracts.',
            'Government incentives for freelance tech exporters boosted foreign currency inflows.'
          ],
          headlineRewrite: 'Bangladesh Tech Exports Reach Record High Driven by Global AI Demand',
          keyTopics: ['Technology Exports', 'Economic Growth', 'Software Development', 'Fintech'],
          sentiment: 'positive',
          importantPersons: ['Zaid Ahmed (BASIS President)', 'Dr. Salehudin (Finance Advisor)'],
          importantPlaces: ['Dhaka', 'Chittagong Silicon Valley', 'Singapore', 'Frankfurt'],
          keywords: ['it exports', 'bangladesh tech', 'software revenue', 'outsourcing', 'ai services'],
          generatedAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'seed_2_dup',
        title: 'Tech Exports from Bangladesh Surge 24% in Q3 Fiscal Year',
        link: 'https://www.dhakatribune.com/business/bd-tech-export-growth-2026',
        summary: 'Bangladesh IT and software export sector reaches new high with 24% Q3 revenue increase.',
        content: 'Bangladesh IT and software export sector reaches new high with 24% Q3 revenue increase.',
        publishedAt: new Date(now.getTime() - 1000 * 60 * 20).toISOString(),
        sourceId: 'src_dhaka_tribune',
        sourceName: 'Dhaka Tribune RSS',
        sourceType: 'rss',
        category: 'Bangladesh',
        author: 'Business Desk',
        canonicalUrl: 'https://www.dhakatribune.com/business/bd-tech-export-growth-2026',
        contentHash: 'hash_seed_2',
        titleFingerprint: 'tech exports from bangladesh surge 24 in q3 fiscal year',
        isDuplicate: true,
        duplicateOfId: 'seed_1',
        similarityScore: 0.85,
        aiEnrichment: {
          shortSummary: 'Duplicate article tracking Bangladesh IT export surge.',
          mediumSummary: 'Duplicate report confirmed matching seed_1 with 85% lexical overlap.',
          bulletSummary: ['Identified as duplicate feed item.'],
          headlineRewrite: 'Tech Exports Surge 24% (Secondary Coverage)',
          keyTopics: ['Technology', 'Economy'],
          sentiment: 'positive',
          importantPersons: [],
          importantPlaces: ['Dhaka'],
          keywords: ['tech export', 'bangladesh'],
          generatedAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'seed_3',
        title: 'Global Central Banks Announce Coordinated Policy Framework for AI Risk',
        link: 'http://feeds.bbci.co.uk/news/world-central-bank-ai-policy',
        summary: 'Central banks across major economies issue guidance on algorithmic financial stability controls.',
        content: 'Central banks across major economies issue guidance on algorithmic financial stability controls.',
        publishedAt: new Date(now.getTime() - 1000 * 60 * 75).toISOString(),
        sourceId: 'src_bbc_world',
        sourceName: 'BBC World News RSS',
        sourceType: 'rss',
        category: 'International',
        author: 'BBC Economics',
        canonicalUrl: 'http://feeds.bbci.co.uk/news/world-central-bank-ai-policy',
        contentHash: 'hash_seed_3',
        titleFingerprint: 'global central banks announce coordinated policy framework for ai risk',
        isDuplicate: false,
        aiEnrichment: {
          shortSummary: 'Central banks in the US, EU, and UK released joint regulatory guidelines for high-frequency AI financial trading.',
          mediumSummary: 'The Bank of England, Federal Reserve, and ECB published a joint framework mandating real-time auditability and stress testing for AI models used in automated liquidity provision.',
          bulletSummary: [
            'Joint framework issued by Fed, ECB, and Bank of England.',
            'Mandatory fail-safe kill switches for automated trading algorithms.',
            'Implementation deadline set for Q4 2026.'
          ],
          headlineRewrite: 'World Central Banks Roll Out Strict Controls for Algorithmic AI Trading',
          keyTopics: ['Financial Regulation', 'Artificial Intelligence', 'Banking Policy'],
          sentiment: 'neutral',
          importantPersons: ['Christine Lagarde', 'Jerome Powell', 'Andrew Bailey'],
          importantPlaces: ['Washington D.C.', 'Frankfurt', 'London'],
          keywords: ['central bank', 'ai regulation', 'fintech risk', 'trading algorithms'],
          generatedAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const item of seededItems) {
      this.newsItems.set(item.id, item);
    }
  }

  private getSupabaseSchemaSql(): string {
    return `-- Supabase DDL SQL Schema for News Intelligence System
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
`;
  }
}
