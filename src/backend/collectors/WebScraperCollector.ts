import * as cheerio from 'cheerio';
import { INewsCollector } from '../interfaces/INewsCollector';
import { NewsSource, RawNewsItem, SourceType } from '../types';

export class WebScraperCollector implements INewsCollector {
  readonly collectorType: SourceType = 'web_scraper';

  supports(source: NewsSource): boolean {
    return source.type === 'web_scraper' && source.enabled;
  }

  async collect(source: NewsSource): Promise<RawNewsItem[]> {
    if (!this.supports(source)) {
      return [];
    }

    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NewsCollectorBot/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.warn(`[WebScraperCollector] HTTP ${response.status} scraping ${source.name}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const items: RawNewsItem[] = [];

      // Selector fallback priority
      const containerSelector = source.selector || 'article, .news-card, .post, .entry, .news-item, li.news';
      const containers = $(containerSelector);

      if (containers.length > 0) {
        containers.each((_, element) => {
          const $el = $(element);
          const $linkEl = $el.find('a[href]').first().length > 0 ? $el.find('a[href]').first() : $el.is('a') ? $el : null;
          
          if (!$linkEl) return;

          const rawHref = $linkEl.attr('href');
          if (!rawHref) return;

          // Convert relative URL to absolute
          let fullUrl = rawHref;
          try {
            fullUrl = new URL(rawHref, source.url).toString();
          } catch {
            fullUrl = rawHref;
          }

          const title = $el.find('h1, h2, h3, h4, .title, strong').first().text().trim() || $linkEl.text().trim();
          const summary = $el.find('p, .summary, .excerpt, .description').first().text().trim();
          const imgUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');

          let absoluteImgUrl: string | undefined = undefined;
          if (imgUrl) {
            try {
              absoluteImgUrl = new URL(imgUrl, source.url).toString();
            } catch {
              absoluteImgUrl = imgUrl;
            }
          }

          if (title && title.length > 5 && fullUrl.startsWith('http')) {
            items.push({
              title,
              link: fullUrl,
              summary: summary || title,
              content: summary || title,
              publishedAt: new Date().toISOString(),
              sourceId: source.id,
              sourceName: source.name,
              sourceType: 'web_scraper',
              category: source.category || 'Scraped News',
              author: source.name,
              imageUrl: absoluteImgUrl
            });
          }
        });
      } else {
        // Fallback: extract all prominent headline links on the page
        $('a[href]').each((_, element) => {
          const $a = $(element);
          const title = $a.text().trim();
          const href = $a.attr('href');

          if (title.length > 20 && href && href.startsWith('http')) {
            items.push({
              title,
              link: href,
              summary: title,
              content: title,
              publishedAt: new Date().toISOString(),
              sourceId: source.id,
              sourceName: source.name,
              sourceType: 'web_scraper',
              category: source.category || 'Web',
              author: source.name
            });
          }
        });
      }

      // Deduplicate locally within the same scraper run
      const uniqueLinks = new Set<string>();
      return items.filter(item => {
        if (uniqueLinks.has(item.link)) return false;
        uniqueLinks.add(item.link);
        return true;
      });
    } catch (error) {
      console.error(`[WebScraperCollector] Error scraping ${source.name} (${source.url}):`, error);
      return [];
    }
  }
}
