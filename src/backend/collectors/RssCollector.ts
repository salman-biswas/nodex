import Parser from 'rss-parser';
import { INewsCollector } from '../interfaces/INewsCollector';
import { NewsSource, RawNewsItem, SourceType } from '../types';

export class RssCollector implements INewsCollector {
  readonly collectorType: SourceType = 'rss';
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'NewsIntelligenceBot/1.0 (+https://ais.example.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      },
      customFields: {
        item: ['media:content', 'enclosure', 'content:encoded', 'dc:creator']
      }
    });
  }

  supports(source: NewsSource): boolean {
    return source.type === 'rss' && source.enabled;
  }

  async collect(source: NewsSource): Promise<RawNewsItem[]> {
    if (!this.supports(source)) {
      return [];
    }

    try {
      const feed = await this.parser.parseURL(source.url);
      const items: RawNewsItem[] = [];

      for (const item of feed.items || []) {
        if (!item.title || !item.link) continue;

        // Extract image URL if available from enclosures or media
        let imageUrl: string | undefined = undefined;
        if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
          imageUrl = item.enclosure.url;
        } else if ((item as any)['media:content']?.$?.url) {
          imageUrl = (item as any)['media:content'].$.url;
        }

        const rawItem: RawNewsItem = {
          title: item.title.trim(),
          link: item.link.trim(),
          summary: item.snippet || item.contentSnippet || (item.content ? item.content.slice(0, 200) : undefined),
          content: (item as any)['content:encoded'] || item.content || item.snippet || item.title,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          sourceId: source.id,
          sourceName: source.name,
          sourceType: 'rss',
          category: source.category || 'General',
          author: item.creator || (item as any)['dc:creator'] || source.name,
          imageUrl
        };

        items.push(rawItem);
      }

      return items;
    } catch (error: any) {
      const msg = error?.message || String(error);
      console.warn(`[RssCollector] Could not parse RSS feed from ${source.name} (${source.url}): ${msg}`);
      return [];
    }
  }
}
