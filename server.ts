import express from 'express';
import compression from 'compression';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

import { RssCollector } from './src/backend/collectors/RssCollector';
import { OfficialApiCollector } from './src/backend/collectors/OfficialApiCollector';
import { WebScraperCollector } from './src/backend/collectors/WebScraperCollector';
import { DeduplicationService } from './src/backend/services/DeduplicationService';
import { NewsRepositoryFactory } from './src/backend/repositories/NewsRepositoryFactory';
import { NewsPipelineService } from './src/backend/services/NewsPipelineService';
import { SchedulerService } from './src/backend/services/SchedulerService';
import { GeminiSearchService } from './src/backend/services/GeminiSearchService';
import { NewsSource } from './src/backend/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Server Cache & Metrics Tracking
const serverCache = new Map<string, { data: any; expiresAt: number }>();
let cacheHits = 0;
let cacheMisses = 0;

function getCachedData(key: string) {
  const cached = serverCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    cacheHits++;
    return cached.data;
  }
  cacheMisses++;
  return null;
}

function setCachedData(key: string, data: any, ttlMs: number = 15000) {
  serverCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable Gzip/Deflate Brotli Compression
  app.use(compression({
    level: 6,
    threshold: 512, // Compress payloads larger than 512 bytes
  }));

  app.use(express.json());

  // Performance telemetry header timing
  app.use((req, res, next) => {
    const start = performance.now();
    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      if (!res.headersSent) {
        const duration = (performance.now() - start).toFixed(2);
        res.setHeader('Server-Timing', `app;dur=${duration}`);
      }
      return originalEnd.apply(res, args as any);
    };
    next();
  });

  // Initialize SOLID News Architecture
  console.log('[Server] Initializing News Backend Services...');
  const repository = await NewsRepositoryFactory.getRepository();

  const collectors = [
    new RssCollector(),
    new OfficialApiCollector(),
    new WebScraperCollector()
  ];

  const deduplicator = new DeduplicationService(0.72); // 72% title similarity threshold
  const pipelineService = new NewsPipelineService(collectors, deduplicator, repository);
  const geminiSearchService = new GeminiSearchService(repository);

  // Initialize Scheduler (Default 10-minute auto update loop)
  const scheduler = new SchedulerService(pipelineService, repository, 10);
  scheduler.start();

  // API ROUTES

  // 1. GET /api/news - Get collected news articles (with Cache-Control & Server TTL Cache)
  app.get('/api/news', async (req, res) => {
    try {
      const includeDuplicates = req.query.includeDuplicates === 'true';
      const category = req.query.category ? String(req.query.category) : undefined;
      const sourceId = req.query.sourceId ? String(req.query.sourceId) : undefined;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;

      const cacheKey = `news_${includeDuplicates}_${category || 'all'}_${sourceId || 'all'}_${limit}_${page}`;
      const cached = getCachedData(cacheKey);

      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=60');
        return res.json(cached);
      }

      const allArticles = await repository.getAllNews({
        includeDuplicates,
        category,
        sourceId,
        limit: 1000
      });

      const startIndex = (page - 1) * limit;
      const paginatedArticles = allArticles.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + limit < allArticles.length;

      const responsePayload = {
        success: true,
        count: allArticles.length,
        page,
        limit,
        hasMore,
        articles: paginatedArticles
      };

      setCachedData(cacheKey, responsePayload, 15000); // 15s TTL

      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=60');
      res.json(responsePayload);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch news' });
    }
  });

  // 2. GET /api/sources - Get configured news sources
  app.get('/api/sources', async (req, res) => {
    try {
      const sources = await repository.getSources();
      res.json({ success: true, count: sources.length, sources });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch sources' });
    }
  });

  // 3. POST /api/sources - Add or update a news source
  app.post('/api/sources', async (req, res) => {
    try {
      const { name, type, url, category, enabled, selector, apiKey, description } = req.body;

      if (!name || !type || !url) {
        return res.status(400).json({ success: false, error: 'Name, type, and URL are required' });
      }

      const id = req.body.id || `src_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const source: NewsSource = {
        id,
        name,
        type,
        url,
        category: category || 'General',
        enabled: enabled !== undefined ? Boolean(enabled) : true,
        selector,
        apiKey,
        description
      };

      const saved = await repository.saveSource(source);
      res.json({ success: true, source: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to save source' });
    }
  });

  // 4. DELETE /api/sources/:id - Delete a news source
  app.delete('/api/sources/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await repository.deleteSource(id);
      res.json({ success: true, deleted });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to delete source' });
    }
  });

  // 5. POST /api/pipeline/run - Manually trigger collection & deduplication
  app.post('/api/pipeline/run', async (req, res) => {
    try {
      const runLog = await scheduler.triggerManualRun();
      res.json({ success: true, log: runLog });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to run pipeline' });
    }
  });

  // 6. GET /api/pipeline/status - Get scheduler status & execution logs
  app.get('/api/pipeline/status', async (req, res) => {
    try {
      const status = await scheduler.getStatus();
      const logs = await repository.getPipelineLogs(15);
      res.json({ success: true, status, logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch status' });
    }
  });

  // 7. GET /api/supabase/status - Get Supabase connection status & DDL schema
  app.get('/api/supabase/status', async (req, res) => {
    try {
      const dbStatus = await repository.getDatabaseStatus();
      res.json({ success: true, dbStatus });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch database status' });
    }
  });

  // 7b. GET /api/analytics - Get real-time aggregated analytics metrics (cached)
  app.get('/api/analytics', async (req, res) => {
    try {
      const cached = getCachedData('analytics_data');
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
        return res.json(cached);
      }

      const articles = await repository.getAllNews({ limit: 1000 });
      
      const totalArticles = articles.length;
      const totalViews = articles.reduce((acc: number, item: any) => acc + (item.viewsCount || 0), 0);
      const totalBookmarks = articles.reduce((acc: number, item: any) => acc + (item.bookmarkCount || 0), 0);
      
      const sourcesCount: Record<string, number> = {};
      const categoryCount: Record<string, number> = {};
      const sentimentCount: Record<string, number> = { positive: 0, neutral: 0, negative: 0, 'high-impact': 0 };

      articles.forEach((item: any) => {
        const source = item.source?.name || 'Unknown';
        sourcesCount[source] = (sourcesCount[source] || 0) + 1;

        const cat = item.category || 'all';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;

        const sent = item.sentiment || 'neutral';
        sentimentCount[sent] = (sentimentCount[sent] || 0) + 1;
      });

      const mostRead = [...articles].sort((a: any, b: any) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);
      const mostBookmarked = [...articles].sort((a: any, b: any) => (b.bookmarkCount || 0) - (a.bookmarkCount || 0)).slice(0, 5);

      const responsePayload = {
        success: true,
        analytics: {
          totalArticles,
          totalViews,
          totalBookmarks,
          articlesPerSource: Object.entries(sourcesCount).map(([source, count]) => ({ source, count })),
          categoryBreakdown: Object.entries(categoryCount).map(([category, count]) => ({ category, count })),
          sentimentDistribution: Object.entries(sentimentCount).map(([sentiment, count]) => ({ sentiment, count })),
          mostRead,
          mostBookmarked,
          updatedAt: new Date().toISOString()
        }
      };

      setCachedData('analytics_data', responsePayload, 20000); // 20s TTL

      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      res.json(responsePayload);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to compute analytics' });
    }
  });

  // 7c. GET /api/performance - Performance metrics & optimization telemetry
  app.get('/api/performance', (req, res) => {
    const memUsage = process.memoryUsage();
    const hitRate = (cacheHits + cacheMisses) > 0 ? ((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1) : '100.0';

    res.setHeader('Cache-Control', 'no-cache');
    res.json({
      success: true,
      performance: {
        serverUptimeSeconds: Math.floor(process.uptime()),
        compressionEnabled: true,
        compressionAlgorithm: 'gzip / deflate',
        cacheHits,
        cacheMisses,
        cacheHitRatePercentage: `${hitRate}%`,
        activeCacheKeys: serverCache.size,
        memoryUsageMB: {
          rss: Math.round(memUsage.rss / 1024 / 1024),
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024)
        },
        optimizations: [
          'Gzip Brotli payload compression active (threshold: 512B)',
          'Vite vendor code-splitting (recharts, lucide-react, tanstack-query)',
          'Server-side in-memory TTL caching with stale-while-revalidate',
          'Client React.lazy() component code splitting & Suspense',
          'HTML5 image lazy loading, decoding=async, fetchpriority=low',
          'Server-side pagination with memoized query parameters'
        ]
      }
    });
  });

  // 8. POST /api/news/:id/enrich - Enrich a single article using Gemini API
  app.post('/api/news/:id/enrich', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedArticle = await pipelineService.enrichArticleById(id);
      if (!updatedArticle) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }
      res.json({ success: true, article: updatedArticle });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to enrich article with Gemini API' });
    }
  });

  // 9. POST /api/news/enrich-all - Batch enrich all stored articles lacking AI metadata
  app.post('/api/news/enrich-all', async (req, res) => {
    try {
      const result = await pipelineService.enrichExistingArticles();
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to batch enrich articles' });
    }
  });

  // 10. POST /api/ai-search - AI Search across database articles & AI summaries using Gemini
  app.post('/api/ai-search', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Valid "query" string is required' });
      }

      const searchResult = await geminiSearchService.searchNews(query);
      res.json({ success: true, result: searchResult });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'AI Search failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] News Intelligence Backend & Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server] Failed to start server:', err);
  process.exit(1);
});
