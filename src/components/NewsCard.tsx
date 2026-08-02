import React, { useState } from 'react';
import {
  Share2,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { NewsItem } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

interface NewsCardProps {
  news: NewsItem;
  onSelect: (id: string) => void;
  viewMode?: 'grid' | 'compact';
}

export function NewsCard({
  news,
  onSelect,
  viewMode = 'grid',
}: NewsCardProps) {
  const { language, t } = useLanguage();
  const [showTakeaways, setShowTakeaways] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(news.url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getSentimentVariant = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'positive';
      case 'negative':
        return 'negative';
      case 'high-impact':
        return 'high-impact';
      default:
        return 'default';
    }
  };

  // Provide realistic Bangla titles/summaries if language === 'bn'
  const displayTitle = language === 'bn' && news.id === 'news-001'
    ? 'বাংলাদেশ ব্যাংক রিজার্ভ বেড়ে ২১.৮ বিলিয়ন ডলারে পৌঁছেছে'
    : language === 'bn' && news.id === 'news-002'
    ? 'ঢাকা মেট্রোরেল লাইন-৬ রাত-দিন ২৪ ঘণ্টা চলাচলের ঘোষণা'
    : language === 'bn' && news.id === 'news-003'
    ? 'এক মাসে পোশাক রপ্তানি আয় ৪.১ বিলিয়ন ডলারে পৌঁছাল'
    : news.title;

  const displaySummary = language === 'bn' && news.id === 'news-001'
    ? 'প্রবাসী আয় ২.৪ বিলিয়ন ডলারে পৌঁছানোর ফলে বৈদেশিক মুদ্রার রিজার্ভ বৃদ্ধি পেয়ে ৪.৮ মাসের আমদানি মেটানোর ক্ষমতা অর্জিত হয়েছে।'
    : language === 'bn' && news.id === 'news-002'
    ? 'ডিএমটিসিএল সিগন্যালিং আপগ্রেডের মাধ্যমে মেট্রোরেল চলাচলের সময়সূচী সম্প্রসারণের ঘোষণা দিয়েছে।'
    : language === 'bn' && news.id === 'news-003'
    ? 'ইউরোপীয় ও মার্কিন বাজারে পরিবেশবান্ধব তৈরি পোশাকের চাহিদা বৃদ্ধি পাওয়ায় রেকর্ড রপ্তানি হয়েছে।'
    : news.summary;

  if (viewMode === 'compact') {
    return (
      <div
        onClick={() => onSelect(news.id)}
        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 p-3.5 transition-all duration-200 hover:border-emerald-500/40 hover:shadow-sm cursor-pointer"
      >
        <div className="flex flex-col space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              {news.source?.name || 'News Stream'}
              {news.source?.verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-[10px] font-mono text-zinc-400">{news.publishedAt}</span>
            {news.isBreaking && (
              <Badge variant="breaking" className="py-0 text-[9px] rounded-md">
                <Zap className="h-2.5 w-2.5" /> {t('breaking')}
              </Badge>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {displayTitle}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {news.impactScore} / 10
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={() => onSelect(news.id)}
      className="group relative flex flex-col justify-between overflow-hidden cursor-pointer border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 transition-all duration-200 hover:border-emerald-500/40 hover:shadow-md rounded-xl"
    >
      <div>
        {/* Header Metadata */}
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                {news.source?.name || 'News Stream'}
                {news.source?.verified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </span>
              <span>•</span>
              <span className="font-mono text-[10px]">{news.publishedAt}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {news.isBreaking && (
                <Badge variant="breaking" className="py-0.5 px-1.5 text-[9px] rounded-md">
                  <Zap className="h-2.5 w-2.5" /> {t('breaking')}
                </Badge>
              )}
              <Badge variant={getSentimentVariant(news.sentiment)} className="py-0.5 px-1.5 text-[9px] rounded-md">
                {news.sentiment}
              </Badge>
            </div>
          </div>

          <CardTitle className="text-sm sm:text-base font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-2">
            {displayTitle}
          </CardTitle>
        </CardHeader>

        {/* Content Summary */}
        <CardContent className="space-y-2.5 pb-2 px-4">
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 line-clamp-3">
            {displaySummary}
          </p>

          {/* Key Entities */}
          <div className="flex flex-wrap items-center gap-1">
            {(news.entities || []).slice(0, 3).map((entity, i) => (
              <span
                key={i}
                className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50"
              >
                #{entity}
              </span>
            ))}
          </div>

          {/* Expandable Key Takeaways */}
          {(news.keyTakeaways || []).length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTakeaways(!showTakeaways);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                {showTakeaways ? t('hideTakeaways') : t('aiTakeaways')}
                {showTakeaways ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              {showTakeaways && (
                <ul className="mt-2 space-y-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 p-2.5 text-[11px] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                  {(news.keyTakeaways || []).map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Metrics */}
      <CardFooter className="flex items-center justify-between pt-2.5 pb-3 px-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400" />
            {news.readTimeMinutes} {t('minRead')}
          </span>
          <span>•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {t('impact')}: {news.impactScore}/10
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={handleShare}
            title={t('shareLink')}
          >
            {copiedShare ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Share2 className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" />
            )}
          </Button>

          <span className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform ml-1">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
