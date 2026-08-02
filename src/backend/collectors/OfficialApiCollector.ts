import { INewsCollector } from '../interfaces/INewsCollector';
import { NewsSource, RawNewsItem, SourceType } from '../types';

export class OfficialApiCollector implements INewsCollector {
  readonly collectorType: SourceType = 'official_api';

  supports(source: NewsSource): boolean {
    return source.type === 'official_api' && source.enabled;
  }

  async collect(source: NewsSource): Promise<RawNewsItem[]> {
    if (!this.supports(source)) {
      return [];
    }

    try {
      const headers: Record<string, string> = {
        'User-Agent': 'NewsCollectorBot/1.0',
        'Accept': 'application/json'
      };

      if (source.apiKey) {
        headers['Authorization'] = `Bearer ${source.apiKey}`;
        headers['X-Api-Key'] = source.apiKey;
      }

      const response = await fetch(source.url, {
        headers,
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.warn(`[OfficialApiCollector] HTTP ${response.status} fetching from ${source.name}`);
        return [];
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.warn(`[OfficialApiCollector] Invalid JSON payload received from ${source.name} (${source.url}) - Content-Type: ${contentType}`);
        return [];
      }

      const items: RawNewsItem[] = [];

      // Normalize common official API payload layouts (e.g., hits[], articles[], data[], items[], response.results[])
      const rawArticles: any[] = data.hits || data.articles || data.data || data.items || data.results || (data.response?.results) || (Array.isArray(data) ? data : []);

      for (const article of rawArticles) {
        const title = article.title || article.webTitle || article.headline || article.story_title;
        let link = article.url || article.webUrl || article.link || article.story_url;
        
        if (!link && article.objectID) {
          link = `https://news.ycombinator.com/item?id=${article.objectID}`;
        }

        if (!title || !link) continue;

        items.push({
          title: String(title).trim(),
          link: String(link).trim(),
          summary: article.description || article.summary || article.trailText || article.snippet || article.story_text,
          content: article.content || article.body || article.description || article.story_text || title,
          publishedAt: article.created_at || article.publishedAt || article.pubDate || article.webPublicationDate || new Date().toISOString(),
          sourceId: source.id,
          sourceName: source.name,
          sourceType: 'official_api',
          category: article.category || source.category || 'Official',
          author: article.author || article.byline || source.name,
          imageUrl: article.urlToImage || article.image || article.thumbnail
        });
      }

      return items;
    } catch (error) {
      console.error(`[OfficialApiCollector] Error fetching from ${source.name} (${source.url}):`, error);
      return [];
    }
  }
}
