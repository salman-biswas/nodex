import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  Zap,
  CornerDownLeft,
  Loader2,
  Bot,
  ListChecks,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { NewsItem, CategoryId } from '../types';
import { Badge } from './ui/Badge';
import { CATEGORIES } from '../data/mockNews';

interface AiSearchResult {
  query: string;
  directAnswer: string;
  keyHighlights: string[];
  detectedTopic: string;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  matchingArticles: NewsItem[];
  suggestedFollowUps: string[];
  generatedAt: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  newsItems: NewsItem[];
  onSelectNews: (id: string) => void;
  onSelectCategory: (category: CategoryId) => void;
}

const SAMPLE_AI_QUERIES = [
  'What happened in Bangladesh today?',
  'Show all political news.',
  'Show technology news.',
  'Summarize today\'s economy.',
  'What are the latest infrastructure projects?'
];

export function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  newsItems,
  onSelectNews,
  onSelectCategory,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'filter'>('ai');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const executeAiSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    onSearchChange(queryText);
    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      if (!res.ok) {
        throw new Error('AI Search API error');
      }

      const data = await res.json();
      if (data.success && data.result) {
        setAiResult(data.result);
      } else {
        throw new Error(data.error || 'Failed to synthesize search response');
      }
    } catch (err: any) {
      console.warn('AI search error, falling back:', err);
      setAiError(err?.message || 'AI Search unavailable');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (activeTab === 'ai') {
        executeAiSearch(searchQuery);
      }
    }
  };

  if (!isOpen) return null;

  // Client-side quick filter
  const filteredNews = newsItems.filter(
    (item) =>
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.entities || []).some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.source?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center pt-0 sm:pt-16 p-0 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl rounded-t-2xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header Tabs Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 px-3 sm:px-4 py-2 bg-zinc-50/80 dark:bg-zinc-950/80">
          <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg transition-all cursor-pointer active:scale-95 ${
                activeTab === 'ai'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Gemini AI Search</span>
            </button>
            <button
              onClick={() => setActiveTab('filter')}
              className={`flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg transition-all cursor-pointer active:scale-95 ${
                activeTab === 'filter'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Search className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>Keyword Filter ({filteredNews.length})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Form Bar */}
        <form onSubmit={handleFormSubmit} className="flex items-center px-3 sm:px-4 py-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-900/90 gap-2">
          <div className="shrink-0 flex items-center justify-center">
            {activeTab === 'ai' ? (
              <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
            ) : (
              <Search className="h-5 w-5 text-zinc-400" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeTab === 'ai'
                ? 'Ask Gemini AI: "What happened in Bangladesh today?"...'
                : 'Filter news by keyword...'
            }
            className="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none min-h-[44px]"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setAiResult(null);
              }}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-2 min-h-[44px] shrink-0 cursor-pointer"
            >
              Clear
            </button>
          )}

          {activeTab === 'ai' && (
            <button
              type="submit"
              disabled={isAiLoading || !searchQuery.trim()}
              className="flex items-center gap-1.5 px-3.5 min-h-[44px] text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 transition-all shrink-0 cursor-pointer active:scale-95"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          )}
        </form>

        {/* Modal Scrollable Workspace */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Preset Prompts Section (When no active result or empty query) */}
          {activeTab === 'ai' && !aiResult && !isAiLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5 text-emerald-500" />
                  Suggested AI Intelligence Queries
                </span>
                <span>Powered by Gemini 3.6 Flash</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_AI_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => executeAiSearch(q)}
                    className="flex items-center justify-between rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/40 p-3 text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-all group cursor-pointer"
                  >
                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      "{q}"
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Browse by Category
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                      }}
                      className="flex items-center justify-between rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
                    >
                      <span>{cat.label}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Search Loading State */}
          {isAiLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-bounce">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 justify-center">
                  Analyzing Live News Database & AI Summaries
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
                  Gemini 3.6 Flash is scanning structured news metadata, entity graphs, and executive summaries for "{searchQuery}"...
                </p>
              </div>
            </div>
          )}

          {/* AI Search Structured Result View */}
          {activeTab === 'ai' && aiResult && !isAiLoading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Result Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 font-mono text-[10px] rounded-lg">
                    <Sparkles className="h-3 w-3" /> Topic: {aiResult.detectedTopic}
                  </Badge>
                  <span className="text-zinc-400">•</span>
                  <span className="capitalize font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                    Sentiment: <strong className="text-emerald-600 dark:text-emerald-400">{aiResult.overallSentiment}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Synthesized from {aiResult.matchingArticles.length} DB reports
                </span>
              </div>

              {/* Direct Synthesis Answer */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-emerald-500" />
                  Executive Intelligence Synthesis
                </h3>
                <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {aiResult.directAnswer}
                </p>

                {/* Key Bullet Highlights */}
                {aiResult.keyHighlights && aiResult.keyHighlights.length > 0 && (
                  <div className="pt-2 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <ListChecks className="h-3.5 w-3.5 text-emerald-500" />
                      Key Bullet Highlights
                    </div>
                    <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300 pl-2">
                      {aiResult.keyHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Questions */}
              {aiResult.suggestedFollowUps && aiResult.suggestedFollowUps.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <HelpCircle className="h-3 w-3 text-emerald-500" />
                    Suggested Follow-ups
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.suggestedFollowUps.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => executeAiSearch(q)}
                        className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/80 dark:bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      >
                        ? {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Referenced Database Articles Grid */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                  <span>Referenced Source Articles ({aiResult.matchingArticles.length})</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Click card to read full report</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {aiResult.matchingArticles.map((news) => (
                    <div
                      key={news.id}
                      onClick={() => {
                        onSelectNews(news.id);
                        onClose();
                      }}
                      className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 p-3.5 text-xs hover:border-emerald-500/60 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                            {news.source.name}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {news.readTimeMinutes} min read
                          </span>
                        </div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors line-clamp-2">
                          {news.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {news.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-mono">
                        <span className="uppercase">{news.category}</span>
                        <span className="flex items-center gap-1 text-emerald-500 font-semibold group-hover:underline">
                          Read <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Standard Keyword Filter View */}
          {activeTab === 'filter' && (
            <div className="space-y-2">
              {!searchQuery ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  Type a keyword in the input above to instantly filter titles and topics.
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  No intelligence reports matching "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                    {filteredNews.length} Reports Found
                  </div>
                  {filteredNews.map((news) => (
                    <div
                      key={news.id}
                      onClick={() => {
                        onSelectNews(news.id);
                        onClose();
                      }}
                      className="group flex items-center justify-between gap-3 rounded-2xl p-3 text-xs transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {news.source.name}
                          </span>
                          <span className="text-zinc-400">•</span>
                          <span className="font-mono text-[10px] text-zinc-400">{news.publishedAt}</span>
                          {news.isBreaking && (
                            <Badge variant="breaking" className="py-0 text-[9px] rounded-md">
                              <Zap className="h-2 w-2" /> BREAKING
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors line-clamp-1">
                          {news.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                          {news.impactScore}/10
                        </span>
                        <CornerDownLeft className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Keyboard Guide */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-950/80 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-2">
            <span>
              <kbd className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5">
                ESC
              </kbd>{' '}
              Close
            </span>
          </span>
          <span className="flex items-center gap-1 text-emerald-500 font-semibold">
            <Sparkles className="h-3 w-3" /> Gemini 3.6 Flash Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
