import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { AiExecutiveBrief } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

interface AiSummaryCardProps {
  brief: AiExecutiveBrief;
}

export function AiSummaryCard({ brief }: AiSummaryCardProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const headline = language === 'bn' 
    ? 'বাংলাদেশ ব্যাংক রেমিট্যান্স প্রবাহে সঞ্চিত রিজার্ভ ২১.৮ বিলিয়ন ডলারে উন্নীত'
    : brief.headline;

  const handleCopy = () => {
    const text = `${headline}\n\nKey Takeaways:\n${brief.bulletPoints
      .map((b) => `- ${b.title}: ${b.detail}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-white dark:bg-zinc-900/90 shadow-sm transition-all">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {t('aiBriefTitle')}
                </CardTitle>
                <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  Gemini 3.6
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {t('aiBriefSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAudio}
              className={`h-7 px-2.5 text-xs gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-800 ${
                isPlayingAudio ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : ''
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Audio</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs rounded-lg border-zinc-200 dark:border-zinc-800"
              title="Copy Summary"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-zinc-500" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 p-0 rounded-lg"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Main Headline */}
      <div className="px-5 py-3 bg-zinc-50/80 dark:bg-zinc-800/50 border-y border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
            "{headline}"
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase">
              {t('impactScore')}: <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{brief.macroImpactScore}/10</strong>
            </span>
            <Badge variant="positive" className="text-xs px-2.5 py-0.5 font-semibold rounded-lg gap-1">
              <TrendingUp className="h-3 w-3" />
              {brief.overallSentiment}
            </Badge>
          </div>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="pt-3 pb-4 px-5 space-y-3">
          {/* Key Bullet Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {brief.bulletPoints.map((point, index) => {
              const pointTitle = language === 'bn' 
                ? index === 0 ? 'রেমিট্যান্স প্রবৃদ্ধি (+২২%)' : index === 1 ? 'মেট্রোরেল ২৪/৭ সার্ভিস' : index === 2 ? 'পোশাক রপ্তানি রেকর্ড' : 'সবুজ কারখানা প্রসার'
                : point.title;
              const pointDetail = language === 'bn'
                ? index === 0 ? 'ডিজিটাল চ্যানেল ও ব্যাংকিং সুবিধার কারণে প্রবাসী আয় বৃদ্ধি পেয়ে $২.৪ বিলিয়ন হয়েছে।' : index === 1 ? 'ডিএমটিসিএল সিগন্যালিং আপগ্রেড করে মেট্রোরেলের যাত্রী ক্ষমতা বৃদ্ধি করেছে।' : index === 2 ? 'ইইউ ও মার্কিন বাজারে বাংলাদেশ তৈরি পোশাকের স্থিতিশীল চাহিদা ধরে রেখেছে।' : '২২০টিরও বেশি লিড সার্টিফাইড গ্রিন কারখানা রপ্তানি চালিকাশক্তি।'
                : point.detail;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-3 text-xs space-y-1 transition-all hover:border-emerald-500/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {pointTitle}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono rounded-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
                      {point.tag}
                    </Badge>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px]">
                    {pointDetail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Entities Tracked */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold mr-1">
                Entities:
              </span>
              {brief.keyEntitiesMentioned.map((entity, i) => (
                <span
                  key={i}
                  className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {entity}
                </span>
              ))}
            </div>

            <button className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer group">
              {t('readFullReport')} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
