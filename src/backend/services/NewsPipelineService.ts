import { INewsCollector } from '../interfaces/INewsCollector';
import { IDeduplicator } from '../interfaces/IDeduplicator';
import { INewsRepository } from '../interfaces/INewsRepository';
import { NewsItem, PipelineRunLog, RawNewsItem } from '../types';
import { GeminiEnrichmentService } from './GeminiEnrichmentService';

export class NewsPipelineService {
  private collectors: INewsCollector[];
  private deduplicator: IDeduplicator;
  private repository: INewsRepository;
  private geminiService: GeminiEnrichmentService;

  constructor(
    collectors: INewsCollector[],
    deduplicator: IDeduplicator,
    repository: INewsRepository
  ) {
    this.collectors = collectors;
    this.deduplicator = deduplicator;
    this.repository = repository;
    this.geminiService = new GeminiEnrichmentService();
  }

  public async runPipeline(): Promise<PipelineRunLog> {
    const startTime = Date.now();
    const runId = `run_${startTime}_${Math.random().toString(36).substring(2, 7)}`;
    const logs: string[] = [];

    const logMsg = (msg: string) => {
      const formatted = `[${new Date().toISOString()}] ${msg}`;
      logs.push(formatted);
      console.log(`[NewsPipelineService] ${msg}`);
    };

    logMsg(`Starting News Collection, AI Enrichment & Deduplication Pipeline run (${runId})`);

    let rawCollectedCount = 0;
    let newUniqueCount = 0;
    let duplicatesCount = 0;
    let sourcesProcessedCount = 0;

    try {
      const sources = await this.repository.getSources();
      const activeSources = sources.filter(s => s.enabled);
      logMsg(`Found ${sources.length} total sources (${activeSources.length} enabled)`);

      const allRawItems: RawNewsItem[] = [];

      // Collect from active sources
      for (const source of activeSources) {
        const collector = this.collectors.find(c => c.supports(source));
        if (!collector) {
          logMsg(`No suitable collector found for source "${source.name}" (${source.type})`);
          continue;
        }

        logMsg(`Fetching from source "${source.name}" via ${collector.collectorType}...`);
        try {
          const items = await collector.collect(source);
          allRawItems.push(...items);
          sourcesProcessedCount++;
          logMsg(`  -> Collected ${items.length} raw articles from "${source.name}"`);

          // Update source lastFetchedAt timestamp
          await this.repository.saveSource({
            ...source,
            lastFetchedAt: new Date().toISOString()
          });
        } catch (err: any) {
          logMsg(`  ❌ Error processing source "${source.name}": ${err?.message || err}`);
        }
      }

      rawCollectedCount = allRawItems.length;
      logMsg(`Total raw articles collected across all sources: ${rawCollectedCount}`);

      // Get existing items from store for deduplication
      const existingItems = await this.repository.getAllNews({ includeDuplicates: true, limit: 1000 });
      logMsg(`Loaded ${existingItems.length} existing news items from store for deduplication check`);

      const itemsToProcess: NewsItem[] = [];
      const trackingItemsList: NewsItem[] = [...existingItems];

      // Deduplicate each collected item
      for (const rawItem of allRawItems) {
        const result = this.deduplicator.processItem(rawItem, trackingItemsList);

        if (result.isDuplicate) {
          duplicatesCount++;
          logMsg(`  ⚠️ Duplicate detected: "${rawItem.title.slice(0, 50)}..." -> ${result.reason}`);
        } else {
          newUniqueCount++;
        }

        itemsToProcess.push(result.uniqueItem);
        trackingItemsList.push(result.uniqueItem);
      }

      // Perform Gemini AI Enrichment for new unique articles (cost-optimized)
      const uniqueItemsToEnrich = itemsToProcess.filter(i => !i.isDuplicate && !i.aiEnrichment);
      if (uniqueItemsToEnrich.length > 0) {
        logMsg(`🤖 Running Gemini API enrichment for ${uniqueItemsToEnrich.length} new unique articles...`);
        const enrichedList = await this.geminiService.enrichArticlesBatch(uniqueItemsToEnrich);
        const enrichedMap = new Map(enrichedList.map(item => [item.id, item]));

        for (let i = 0; i < itemsToProcess.length; i++) {
          if (enrichedMap.has(itemsToProcess[i].id)) {
            itemsToProcess[i] = enrichedMap.get(itemsToProcess[i].id)!;
          }
        }
        logMsg(`  ✨ Gemini AI enrichment complete for all new articles.`);
      }

      // Save processed items to database
      if (itemsToProcess.length > 0) {
        logMsg(`Persisting ${itemsToProcess.length} total processed articles (${newUniqueCount} unique, ${duplicatesCount} duplicates) with AI metadata to store...`);
        const saveResult = await this.repository.saveNewsItems(itemsToProcess);
        if (saveResult.errors.length > 0) {
          logMsg(`  ⚠️ Save warnings: ${saveResult.errors.join(', ')}`);
        } else {
          logMsg(`  ✅ Successfully saved ${saveResult.savedCount} articles to database.`);
        }
      }

      const durationMs = Date.now() - startTime;
      logMsg(`Pipeline run completed successfully in ${durationMs}ms.`);

      const runLog: PipelineRunLog = {
        id: runId,
        timestamp: new Date().toISOString(),
        durationMs,
        sourcesProcessed: sourcesProcessedCount,
        rawCollected: rawCollectedCount,
        newUniqueSaved: newUniqueCount,
        duplicatesDetected: duplicatesCount,
        status: 'SUCCESS',
        logs
      };

      await this.repository.logPipelineRun(runLog);
      return runLog;
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      logMsg(`❌ Critical Pipeline Error: ${error?.message || error}`);

      const failedLog: PipelineRunLog = {
        id: runId,
        timestamp: new Date().toISOString(),
        durationMs,
        sourcesProcessed: sourcesProcessedCount,
        rawCollected: rawCollectedCount,
        newUniqueSaved: newUniqueCount,
        duplicatesDetected: duplicatesCount,
        status: 'FAILED',
        logs
      };

      await this.repository.logPipelineRun(failedLog);
      return failedLog;
    }
  }

  /**
   * Enriches all existing stored articles in the database that do not have AI metadata.
   */
  public async enrichExistingArticles(): Promise<{ enrichedCount: number; errors: string[] }> {
    const allArticles = await this.repository.getAllNews({ includeDuplicates: false, limit: 100 });
    const unEnriched = allArticles.filter(a => !a.aiEnrichment || !a.aiEnrichment.shortSummary);

    if (unEnriched.length === 0) {
      return { enrichedCount: 0, errors: [] };
    }

    const enriched = await this.geminiService.enrichArticlesBatch(unEnriched);
    const result = await this.repository.saveNewsItems(enriched);
    return { enrichedCount: result.savedCount, errors: result.errors };
  }

  /**
   * Enriches a single article by ID using Gemini API.
   */
  public async enrichArticleById(articleId: string): Promise<NewsItem | null> {
    const allArticles = await this.repository.getAllNews({ includeDuplicates: true, limit: 1000 });
    const target = allArticles.find(a => a.id === articleId);
    if (!target) return null;

    const enrichment = await this.geminiService.enrichArticle(target);
    const updated = { ...target, aiEnrichment: enrichment };
    await this.repository.saveNewsItems([updated]);
    return updated;
  }
}
