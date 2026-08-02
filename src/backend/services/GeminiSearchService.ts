import { GoogleGenAI, Type } from '@google/genai';
import { INewsRepository } from '../interfaces/INewsRepository';
import { NewsItem } from '../types';

export interface AiSearchResult {
  query: string;
  directAnswer: string;
  keyHighlights: string[];
  detectedTopic: string;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  matchingArticles: NewsItem[];
  suggestedFollowUps: string[];
  generatedAt: string;
}

export class GeminiSearchService {
  private ai: GoogleGenAI;
  private repository: INewsRepository;
  private modelName: string = 'gemini-3.6-flash';
  private static quotaExceededUntil: number = 0;

  constructor(repository: INewsRepository) {
    this.repository = repository;
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
   * Performs an AI-powered search across both stored articles and AI summaries.
   */
  public async searchNews(query: string, maxRetries = 3): Promise<AiSearchResult> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      throw new Error('Search query cannot be empty');
    }

    // 1. Retrieve articles from database
    const allNews = await this.repository.getAllNews({ includeDuplicates: false, limit: 1000 });

    // 2. Filter & rank articles relative to user query
    const lowerQ = cleanQuery.toLowerCase();
    const isTopicQuery = lowerQ.includes('politic') || lowerQ.includes('tech') || lowerQ.includes('econom') || lowerQ.includes('bangladesh');

    const scored = allNews.map((article) => {
      let score = 0;
      const titleLower = (article.title || '').toLowerCase();
      const contentLower = (article.content || article.summary || '').toLowerCase();
      const categoryLower = (article.category || '').toLowerCase();
      const ai = article.aiEnrichment;

      // Match in primary text
      if (titleLower.includes(lowerQ)) score += 10;
      if (contentLower.includes(lowerQ)) score += 5;
      if (categoryLower.includes(lowerQ)) score += 8;

      // Match in AI summaries & entities
      if (ai) {
        if ((ai.shortSummary || '').toLowerCase().includes(lowerQ)) score += 6;
        if ((ai.mediumSummary || '').toLowerCase().includes(lowerQ)) score += 4;
        if ((ai.keyTopics || []).some((t) => t.toLowerCase().includes(lowerQ))) score += 7;
        if ((ai.importantPersons || []).some((p) => p.toLowerCase().includes(lowerQ))) score += 8;
        if ((ai.importantPlaces || []).some((pl) => pl.toLowerCase().includes(lowerQ))) score += 8;
        if ((ai.keywords || []).some((k) => k.toLowerCase().includes(lowerQ))) score += 5;
      }

      // Keyword broad tokens match
      const queryTokens = lowerQ.split(/\s+/).filter((t) => t.length > 3);
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 3;
        if (contentLower.includes(token)) score += 1;
        if (categoryLower.includes(token)) score += 2;
        if (ai?.keyTopics?.some((kt) => kt.toLowerCase().includes(token))) score += 2;
      }

      return { article, score };
    });

    // Sort by relevance score, fallback to recency
    scored.sort((a, b) => b.score - a.score || new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime());

    // Select top matching articles (if query score > 0 take those, else take top recent 8 for broader summaries)
    let matchingScored = scored.filter((s) => s.score > 0).slice(0, 8);
    if (matchingScored.length === 0) {
      matchingScored = scored.slice(0, 8);
    }

    const matchingArticles = matchingScored.map((s) => s.article);

    // If circuit breaker active or no API key, return instant structured synthesis
    if (Date.now() < GeminiSearchService.quotaExceededUntil || !process.env.GEMINI_API_KEY) {
      return this.generateFallbackResult(cleanQuery, matchingArticles);
    }

    // 3. Prepare AI context
    const context = matchingArticles.map((a, idx) => ({
      id: a.id,
      index: idx + 1,
      title: a.title,
      category: a.category,
      source: a.sourceName,
      publishedAt: a.publishedAt,
      shortSummary: a.aiEnrichment?.shortSummary || a.summary || a.title,
      mediumSummary: a.aiEnrichment?.mediumSummary || a.content || a.summary,
      bulletTakeaways: a.aiEnrichment?.bulletSummary || [],
      sentiment: a.aiEnrichment?.sentiment || 'neutral',
      keyTopics: a.aiEnrichment?.keyTopics || [],
      persons: a.aiEnrichment?.importantPersons || [],
      places: a.aiEnrichment?.importantPlaces || []
    }));

    const prompt = `User Query: "${cleanQuery}"

Database News Context (${context.length} relevant live articles & AI summaries):
${JSON.stringify(context, null, 2)}

Synthesize a comprehensive, neutral, and precise intelligence answer to the user's question using the provided database news context and AI summaries.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[GeminiSearchService] GEMINI_API_KEY missing. Returning structured fallback.');
      return this.generateFallbackResult(cleanQuery, matchingArticles);
    }

    // 4. Query Gemini API with structured output schema & retry for rate limits
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite news researcher. Synthesize factual news insights based strictly on provided database context. Return clear, direct answers.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                directAnswer: {
                  type: Type.STRING,
                  description: 'A clear, high-level paragraph synthesizing the exact answer to the user query.'
                },
                keyHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-5 key takeaway bullet points directly addressing the query.'
                },
                detectedTopic: {
                  type: Type.STRING,
                  description: 'Topic classification, e.g. Bangladesh Affairs, Politics, Economy, Technology.'
                },
                overallSentiment: {
                  type: Type.STRING,
                  description: 'Overall sentiment: exactly positive, neutral, or negative.'
                },
                relevantArticleIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Array of article IDs from the context that directly support this answer.'
                },
                suggestedFollowUps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 logical follow-up questions for the user.'
                }
              },
              required: [
                'directAnswer',
                'keyHighlights',
                'detectedTopic',
                'overallSentiment',
                'relevantArticleIds',
                'suggestedFollowUps'
              ]
            }
          }
        });

        const text = response.text?.trim() || '';
        if (!text) {
          throw new Error('Empty response from Gemini Search API');
        }

        const parsed = JSON.parse(text);
        const sentimentVal = ['positive', 'negative', 'neutral'].includes(parsed.overallSentiment?.toLowerCase())
          ? (parsed.overallSentiment.toLowerCase() as 'positive' | 'neutral' | 'negative')
          : 'neutral';

        // Filter returned article IDs or fallback to matching articles
        const returnedIds = new Set(parsed.relevantArticleIds || []);
        let finalArticles = matchingArticles.filter((a) => returnedIds.has(a.id));
        if (finalArticles.length === 0) {
          finalArticles = matchingArticles;
        }

        return {
          query: cleanQuery,
          directAnswer: parsed.directAnswer || `Overview of news matching "${cleanQuery}".`,
          keyHighlights: Array.isArray(parsed.keyHighlights) && parsed.keyHighlights.length > 0
            ? parsed.keyHighlights
            : matchingArticles.slice(0, 3).map((a) => a.title),
          detectedTopic: parsed.detectedTopic || 'Intelligence Brief',
          overallSentiment: sentimentVal,
          matchingArticles: finalArticles,
          suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) && parsed.suggestedFollowUps.length > 0
            ? parsed.suggestedFollowUps
            : ['What are the key policy implications?', 'Show related international coverage.'],
          generatedAt: new Date().toISOString()
        };
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isRateLimit = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota exceeded') || err?.status === 429;
        
        if (isRateLimit) {
          GeminiSearchService.quotaExceededUntil = Date.now() + 60_000;
          console.warn(`[GeminiSearchService] Gemini Search API rate limit hit. Using local structured search synthesis for query "${cleanQuery}".`);
          return this.generateFallbackResult(cleanQuery, matchingArticles);
        }

        if (attempt < maxRetries) {
          await this.delay(1000);
          continue;
        }

        console.warn(`[GeminiSearchService] Search notice for query "${cleanQuery}": ${errMsg}`);
        return this.generateFallbackResult(cleanQuery, matchingArticles);
      }
    }

    return this.generateFallbackResult(cleanQuery, matchingArticles);
  }

  private generateFallbackResult(query: string, articles: NewsItem[]): AiSearchResult {
    const count = articles.length;
    const topTitles = articles.slice(0, 4).map((a) => `• ${a.title} (${a.sourceName})`);

    return {
      query,
      directAnswer: `Found ${count} verified news reports in database matching "${query}". Top coverage highlights primary updates across ${articles.map((a) => a.category).filter((v, i, self) => self.indexOf(v) === i).join(', ')}.`,
      keyHighlights: topTitles.length > 0 ? topTitles : [`Live news database search completed for "${query}".`],
      detectedTopic: query.toLowerCase().includes('bangladesh') ? 'Bangladesh News' : 'General Intelligence',
      overallSentiment: 'neutral',
      matchingArticles: articles,
      suggestedFollowUps: [
        `What is the long-term economic impact of ${query}?`,
        `Show official government statements on ${query}.`
      ],
      generatedAt: new Date().toISOString()
    };
  }
}
