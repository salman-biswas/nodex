import React, { useState } from 'react';
import {
  X,
  Share2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Check
} from 'lucide-react';
import { NewsItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface NewsDetailModalProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsDetailModal({
  news,
  isOpen,
  onClose,
}: NewsDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !news) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(news.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        {/* Mobile Swipe Handle */}
        <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
              {news.source?.name || 'News Stream'}
              {news.source?.verified && (
                <span title="Verified Publisher">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                </span>
              )}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 shrink-0">•</span>
            <span className="font-mono text-[11px] text-zinc-500 shrink-0">{news.publishedAt}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="min-h-[44px] min-w-[44px] rounded-xl active:scale-95"
              title="Copy share link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Share2 className="h-4 w-4 text-zinc-500" />
              )}
            </Button>

            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Headline & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {news.isBreaking && (
                <Badge variant="breaking" className="text-xs rounded-lg">
                  <Zap className="h-3 w-3" /> BREAKING INTEL
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs capitalize rounded-lg">
                Category: {news.category}
              </Badge>
              {news.aiEnrichment?.sentiment && (
                <Badge
                  variant={
                    news.aiEnrichment.sentiment === 'positive'
                      ? 'positive'
                      : news.aiEnrichment.sentiment === 'negative'
                      ? 'negative'
                      : 'secondary'
                  }
                  className="text-xs uppercase font-mono font-bold rounded-lg"
                >
                  Sentiment: {news.aiEnrichment.sentiment}
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
                {news.title}
              </h2>

              {/* AI Headline Rewrite */}
              {news.aiEnrichment?.headlineRewrite && (
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span><strong>AI Rewritten Headline:</strong> "{news.aiEnrichment.headlineRewrite}"</span>
                </p>
              )}
            </div>
          </div>

          {/* AI Comprehensive Intelligence Section */}
          {news.aiEnrichment && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  Gemini 3.6 Flash AI Analysis Report
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {news.aiEnrichment.generatedAt}
                </span>
              </div>

              {/* Summaries: Short, Medium, Bullet */}
              <div className="space-y-3">
                {/* Short Summary */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    1. Short Executive Summary
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    {news.aiEnrichment.shortSummary}
                  </p>
                </div>

                {/* Medium Summary */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    2. Medium Detailed Summary
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    {news.aiEnrichment.mediumSummary}
                  </p>
                </div>

                {/* Bullet Summary */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    3. Key Bullet Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    {news.aiEnrichment.bulletSummary.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Metadata Grid: Key Topics, Persons, Places, Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-emerald-500/20">
                {/* Key Topics */}
                <div>
                  <h5 className="text-[10px] font-mono uppercase font-semibold text-zinc-500 mb-1">Key Topics</h5>
                  <div className="flex flex-wrap gap-1">
                    {news.aiEnrichment.keyTopics.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-500/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Important Persons */}
                <div>
                  <h5 className="text-[10px] font-mono uppercase font-semibold text-zinc-500 mb-1">Important Persons</h5>
                  <div className="flex flex-wrap gap-1">
                    {news.aiEnrichment.importantPersons.length > 0 ? (
                      news.aiEnrichment.importantPersons.map((person, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] rounded-lg bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 font-medium border border-indigo-500/20">
                          👤 {person}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-zinc-400">None identified</span>
                    )}
                  </div>
                </div>

                {/* Important Places */}
                <div>
                  <h5 className="text-[10px] font-mono uppercase font-semibold text-zinc-500 mb-1">Important Places</h5>
                  <div className="flex flex-wrap gap-1">
                    {news.aiEnrichment.importantPlaces.length > 0 ? (
                      news.aiEnrichment.importantPlaces.map((place, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium border border-amber-500/20">
                          📍 {place}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-zinc-400">None identified</span>
                    )}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h5 className="text-[10px] font-mono uppercase font-semibold text-zinc-500 mb-1">Keywords</h5>
                  <div className="flex flex-wrap gap-1">
                    {news.aiEnrichment.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report Body */}
          <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-4 whitespace-pre-line font-sans">
            {news.fullContent || news.summary}
          </div>

          {/* Entity Tags */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Entities & Organizations Referenced
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(news.entities || []).map((entity, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                >
                  #{entity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Link */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-950/80 shrink-0">
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Source Domain: {news.source.domain}
          </span>

          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Read Original Source <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
