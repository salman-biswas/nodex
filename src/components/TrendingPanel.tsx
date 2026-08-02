import React from 'react';
import {
  Flame,
  ShieldCheck,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { TrendingTopic } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { useLanguage } from '../context/LanguageContext';

interface TrendingPanelProps {
  topics: TrendingTopic[];
  onTopicClick: (topic: string) => void;
}

export function TrendingPanel({ topics, onTopicClick }: TrendingPanelProps) {
  const { language, t } = useLanguage();

  return (
    <aside className="space-y-3">
      {/* Trending Topics Card */}
      <Card className="border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 shadow-xs rounded-xl">
        <CardHeader className="pb-2 pt-4 px-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                <Flame className="h-4 w-4" />
              </div>
              <CardTitle className="text-xs font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {t('trendingTitle')}
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-md">
              Live
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-1">
          {topics.map((item, index) => {
            const displayTitle = language === 'bn' && item.banglaTitle ? item.banglaTitle : item.topic;

            return (
              <div
                key={item.id}
                onClick={() => onTopicClick(item.topic)}
                className="group flex items-start justify-between gap-2.5 rounded-lg p-2 text-xs transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-emerald-500 transition-colors w-4 pt-0.5 shrink-0">
                    0{index + 1}
                  </span>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {displayTitle}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>

                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {item.keyEntities.slice(0, 2).map((entity, i) => (
                        <span
                          key={i}
                          className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-600 dark:text-zinc-400 font-mono"
                        >
                          #{entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {item.volumeChange}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {item.articleCount} {t('reports')}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Verified Media Sources Widget */}
      <Card className="border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-3.5 space-y-2 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {t('verifiedSources')}
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          {[
            { name: 'The Business Standard', speed: 'Live Stream', status: t('statusOnline') },
            { name: 'The Daily Star', speed: '5m sync', status: t('statusOnline') },
            { name: 'Financial Express BD', speed: '12m sync', status: t('statusOnline') },
            { name: 'Prothom Alo English', speed: '15m sync', status: t('statusOnline') },
          ].map((src, i) => (
            <div key={i} className="flex items-center justify-between py-0.5 text-[11px]">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">{src.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-400">{src.speed}</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {src.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* BD Macro Index Pulse */}
      <Card className="border-zinc-800 bg-zinc-900 dark:bg-zinc-900 text-white p-3.5 space-y-2 rounded-xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-400" />
            BD Macro Pulse
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            8.8 / 10
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Solvency Index</span>
            <span className="text-emerald-400 font-bold">Stable</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
          </div>
        </div>
      </Card>
    </aside>
  );
}
