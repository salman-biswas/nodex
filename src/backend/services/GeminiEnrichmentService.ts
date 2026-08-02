import { GoogleGenAI, Type } from '@google/genai';
import { AiEnrichment, NewsItem, RawNewsItem } from '../types';

export class GeminiEnrichmentService {
  private ai: GoogleGenAI;
  private modelName: string = 'gemini-3.6-flash';
  private static quotaExceededUntil: number = 0;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Enriches a single news article with full Gemini AI insights.
   * Includes rate limit circuit breaker and graceful local fallback metadata.
   */
  public async enrichArticle(item: NewsItem, maxRetries = 2): Promise<AiEnrichment> {
    if (item.aiEnrichment && item.aiEnrichment.shortSummary) {
      return item.aiEnrichment;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return this.generateFallbackEnrichment(item);
    }

    // Circuit breaker check: If quota was recently exceeded, use fallback immediately to avoid 429 spam
    if (Date.now() < GeminiEnrichmentService.quotaExceededUntil) {
      return this.generateFallbackEnrichment(item);
    }

    const articleText = (item.content || item.summary || item.title).slice(0, 1200);
    const prompt = `Analyze this news article and produce a structured intelligence report:

Title: ${item.title}
Category: ${item.category}
Source: ${item.sourceName}
Content: ${articleText}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite news analyst. Provide accurate, factual, and neutral news intelligence metadata.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                shortSummary: {
                  type: Type.STRING,
                  description: 'Concise 1-2 sentence executive summary.'
                },
                mediumSummary: {
                  type: Type.STRING,
                  description: '3-4 sentence structured medium summary with key context.'
                },
                bulletSummary: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-5 key takeaway bullet points.'
                },
                headlineRewrite: {
                  type: Type.STRING,
                  description: 'Punchy, highly readable rewritten headline.'
                },
                keyTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-5 main news topics or sectors.'
                },
                sentiment: {
                  type: Type.STRING,
                  description: 'Sentiment value: exactly positive, neutral, or negative.'
                },
                importantPersons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of key people, figures, or stakeholders mentioned.'
                },
                importantPlaces: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of cities, regions, or countries mentioned.'
                },
                keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '5-8 SEO & index keywords.'
                }
              },
              required: [
                'shortSummary',
                'mediumSummary',
                'bulletSummary',
                'headlineRewrite',
                'keyTopics',
                'sentiment',
                'importantPersons',
                'importantPlaces',
                'keywords'
              ]
            }
          }
        });

        const text = response.text?.trim() || '';
        if (!text) {
          throw new Error('Empty response from Gemini API');
        }

        const parsed = JSON.parse(text);
        const sentimentVal = ['positive', 'negative', 'neutral'].includes(parsed.sentiment?.toLowerCase())
          ? (parsed.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative')
          : 'neutral';

        const enrichment: AiEnrichment = {
          shortSummary: parsed.shortSummary || item.summary || item.title,
          mediumSummary: parsed.mediumSummary || item.content || item.summary || item.title,
          bulletSummary: Array.isArray(parsed.bulletSummary) && parsed.bulletSummary.length > 0
            ? parsed.bulletSummary
            : [item.summary || item.title],
          headlineRewrite: parsed.headlineRewrite || item.title,
          keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : [item.category],
          sentiment: sentimentVal,
          importantPersons: Array.isArray(parsed.importantPersons) ? parsed.importantPersons : [],
          importantPlaces: Array.isArray(parsed.importantPlaces) ? parsed.importantPlaces : ['Bangladesh'],
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [item.category, item.sourceName],
          generatedAt: new Date().toISOString()
        };

        return enrichment;
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isRateLimit = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota exceeded') || err?.status === 429;
        
        if (isRateLimit) {
          // Set 60-second circuit breaker cooldown for Gemini API
          GeminiEnrichmentService.quotaExceededUntil = Date.now() + 60_000;
          console.warn(`[GeminiEnrichmentService] Gemini API quota limit reached. Pausing API requests for 60s and returning structured local fallback for "${item.title.slice(0, 30)}...".`);
          return this.generateFallbackEnrichment(item);
        }

        if (attempt < maxRetries) {
          await this.delay(1000);
          continue;
        }

        console.warn(`[GeminiEnrichmentService] Gemini API process notice for "${item.title.slice(0, 30)}...": ${errMsg}`);
        return this.generateFallbackEnrichment(item);
      }
    }

    return this.generateFallbackEnrichment(item);
  }

  /**
   * Batch enriches news items with quota protection (caps API requests to 2 per run).
   */
  public async enrichArticlesBatch(items: NewsItem[]): Promise<NewsItem[]> {
    console.log(`[GeminiEnrichmentService] Processing batch of ${items.length} news articles for AI enrichment...`);
    const enrichedItems: NewsItem[] = [];

    // Process max 2 articles via API call if under quota, rest via instant fallback to save quota
    let apiCallsMade = 0;
    const maxApiCalls = 2;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let enrichment: AiEnrichment;

      if (apiCallsMade < maxApiCalls && Date.now() >= GeminiEnrichmentService.quotaExceededUntil) {
        enrichment = await this.enrichArticle(item);
        apiCallsMade++;
      } else {
        enrichment = this.generateFallbackEnrichment(item);
      }

      enrichedItems.push({
        ...item,
        aiEnrichment: enrichment
      });

      if (i < items.length - 1 && apiCallsMade < maxApiCalls) {
        await this.delay(1000);
      }
    }

    return enrichedItems;
  }

  private generateFallbackEnrichment(item: NewsItem): AiEnrichment {
    const text = item.summary || item.content || item.title;
    return {
      shortSummary: item.summary || item.title,
      mediumSummary: item.content || item.summary || `${item.title} - Official report published by ${item.sourceName}.`,
      bulletSummary: [
        `Key Update: ${item.title}`,
        `Source: Published by ${item.sourceName}`,
        `Category: ${item.category}`
      ],
      headlineRewrite: `[AI Perspective] ${item.title}`,
      keyTopics: [item.category, 'National Affairs', 'Updates'],
      sentiment: 'neutral',
      importantPersons: ['Official Spokesperson'],
      importantPlaces: ['Bangladesh', 'Dhaka'],
      keywords: [item.category.toLowerCase(), 'news', 'intelligence', item.sourceName.toLowerCase().replace(/\s+/g, '')],
      generatedAt: new Date().toISOString()
    };
  }
}
