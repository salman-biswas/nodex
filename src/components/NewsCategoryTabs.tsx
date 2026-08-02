import React from 'react';
import {
  Layers,
  TrendingUp,
  Cpu,
  Building2,
  Globe2,
  ShieldCheck,
  Ship,
  LayoutGrid,
  List,
  Filter
} from 'lucide-react';
import { CategoryId, Sentiment } from '../types';
import { CATEGORIES } from '../data/mockNews';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface NewsCategoryTabsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  selectedSentiment: 'all' | Sentiment;
  onSelectSentiment: (sentiment: 'all' | Sentiment) => void;
  viewMode: 'grid' | 'compact';
  onToggleViewMode: (mode: 'grid' | 'compact') => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  TrendingUp,
  Cpu,
  Building2,
  Globe2,
  ShieldCheck,
  Ship,
};

const CAT_KEYS: Record<CategoryId, keyof typeof import('../i18n/translations').translations['en']> = {
  all: 'catAll',
  economy: 'catEconomy',
  technology: 'catTechnology',
  infrastructure: 'catInfrastructure',
  climate: 'catClimate',
  governance: 'catGovernance',
  trade: 'catTrade',
};

export function NewsCategoryTabs({
  selectedCategory,
  onSelectCategory,
  selectedSentiment,
  onSelectSentiment,
  viewMode,
  onToggleViewMode,
}: NewsCategoryTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-2.5 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
      {/* Category Pills Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Layers;
            const active = selectedCategory === cat.id;
            const label = t(CAT_KEYS[cat.id]);

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 min-h-[44px] text-xs font-semibold transition-all shrink-0 cursor-pointer select-none active:scale-95',
                  active
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800/80'
                )}
              >
                <Icon
                  className={cn(
                    'h-3.5 w-3.5',
                    active ? 'text-emerald-400 dark:text-emerald-600' : 'text-zinc-400 dark:text-zinc-500'
                  )}
                />
                <span>{label}</span>
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium',
                    active
                      ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle Switch */}
        <div className="hidden sm:flex items-center rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/80 dark:bg-zinc-900/80 p-1 shrink-0">
          <button
            onClick={() => onToggleViewMode('grid')}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-all cursor-pointer',
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            )}
            title="Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onToggleViewMode('compact')}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-all cursor-pointer',
              viewMode === 'compact'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            )}
            title="Compact View"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Filters: Sentiment */}
      <div className="flex items-center justify-between gap-3 text-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3 text-emerald-500" /> {t('filterSentiment')}:
          </span>
          {[
            { id: 'all', label: t('allSentiments') },
            { id: 'positive', label: t('positive') },
            { id: 'high-impact', label: t('highImpact') },
            { id: 'negative', label: t('critical') },
            { id: 'neutral', label: t('neutral') },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSentiment(s.id as 'all' | Sentiment)}
              className={cn(
                'flex items-center rounded-xl px-3 py-1.5 min-h-[44px] text-xs font-medium transition-all cursor-pointer select-none active:scale-95',
                selectedSentiment === s.id
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
