import crypto from 'node:crypto';
import { IDeduplicator } from '../interfaces/IDeduplicator';
import { DeduplicationResult, NewsItem, RawNewsItem } from '../types';

export class DeduplicationService implements IDeduplicator {
  private readonly similarityThreshold: number;

  constructor(similarityThreshold: number = 0.72) {
    this.similarityThreshold = similarityThreshold;
  }

  public processItem(
    rawItem: RawNewsItem,
    existingItems: NewsItem[]
  ): DeduplicationResult {
    const canonicalUrl = this.normalizeUrl(rawItem.link);
    const titleFingerprint = this.createTitleFingerprint(rawItem.title);
    const contentHash = this.createHash(`${titleFingerprint}:${rawItem.summary || ''}`);

    const newId = `news_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Strategy 1: Exact Canonical URL match
    const urlMatch = existingItems.find(item => item.canonicalUrl === canonicalUrl);
    if (urlMatch) {
      const duplicateItem: NewsItem = {
        ...rawItem,
        id: newId,
        canonicalUrl,
        contentHash,
        titleFingerprint,
        isDuplicate: true,
        duplicateOfId: urlMatch.id,
        similarityScore: 1.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        uniqueItem: duplicateItem,
        isDuplicate: true,
        duplicateOfId: urlMatch.id,
        similarityScore: 1.0,
        reason: `Exact URL match with "${urlMatch.title}" (${urlMatch.sourceName})`
      };
    }

    // Strategy 2: Exact Content / Title Hash match
    const hashMatch = existingItems.find(item => item.contentHash === contentHash || item.titleFingerprint === titleFingerprint);
    if (hashMatch) {
      const duplicateItem: NewsItem = {
        ...rawItem,
        id: newId,
        canonicalUrl,
        contentHash,
        titleFingerprint,
        isDuplicate: true,
        duplicateOfId: hashMatch.id,
        similarityScore: 1.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        uniqueItem: duplicateItem,
        isDuplicate: true,
        duplicateOfId: hashMatch.id,
        similarityScore: 1.0,
        reason: `Exact title/content hash match with "${hashMatch.title}" (${hashMatch.sourceName})`
      };
    }

    // Strategy 3: Semantic / Token Jaccard Fuzzy Title Similarity
    let highestScore = 0;
    let matchedItem: NewsItem | null = null;

    for (const existing of existingItems) {
      const score = this.calculateSimilarity(rawItem.title, existing.title);
      if (score > highestScore) {
        highestScore = score;
        matchedItem = existing;
      }
    }

    if (highestScore >= this.similarityThreshold && matchedItem) {
      const duplicateItem: NewsItem = {
        ...rawItem,
        id: newId,
        canonicalUrl,
        contentHash,
        titleFingerprint,
        isDuplicate: true,
        duplicateOfId: matchedItem.id,
        similarityScore: Number(highestScore.toFixed(2)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        uniqueItem: duplicateItem,
        isDuplicate: true,
        duplicateOfId: matchedItem.id,
        similarityScore: Number(highestScore.toFixed(2)),
        reason: `High semantic title similarity (${(highestScore * 100).toFixed(0)}%) with "${matchedItem.title}" (${matchedItem.sourceName})`
      };
    }

    // Item is Unique!
    const uniqueItem: NewsItem = {
      ...rawItem,
      id: newId,
      canonicalUrl,
      contentHash,
      titleFingerprint,
      isDuplicate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      uniqueItem,
      isDuplicate: false
    };
  }

  public createTitleFingerprint(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF]/g, '') // Keep English & Bengali alphanumeric characters
      .replace(/\s+/g, ' ')
      .trim();
  }

  public calculateSimilarity(titleA: string, titleB: string): number {
    const tokensA = this.tokenize(titleA);
    const tokensB = this.tokenize(titleB);

    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    // Jaccard similarity between token sets
    let intersectionSize = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) {
        intersectionSize++;
      }
    }

    const unionSize = new Set([...tokensA, ...tokensB]).size;
    return unionSize === 0 ? 0 : intersectionSize / unionSize;
  }

  private tokenize(text: string): Set<string> {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'এই', 'এবং', 'বা', 'কিন্তু', 'থেকে', 'দ্বারা', 'জন্য', 'এর', 'কে', 'তে'
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    return new Set(words);
  }

  private normalizeUrl(urlStr: string): string {
    try {
      const parsed = new URL(urlStr);
      // Strip tracking params like utm_source, ref, fbclid
      parsed.searchParams.delete('utm_source');
      parsed.searchParams.delete('utm_medium');
      parsed.searchParams.delete('utm_campaign');
      parsed.searchParams.delete('fbclid');
      parsed.searchParams.delete('ref');

      // Strip trailing slash
      let clean = parsed.toString();
      if (clean.endsWith('/')) {
        clean = clean.slice(0, -1);
      }
      return clean;
    } catch {
      return urlStr.toLowerCase().trim();
    }
  }

  private createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
