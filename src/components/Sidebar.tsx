import React from 'react';
import {
  Layers,
  TrendingUp,
  Cpu,
  Building2,
  Globe2,
  ShieldCheck,
  Ship,
  ChevronLeft,
  ChevronRight,
  Radio,
  Sparkles,
  Command,
  FileText,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/mockNews';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onlyBreaking: boolean;
  onToggleBreaking: (active: boolean) => void;
  onOpenSearch: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  activeTab?: 'dashboard' | 'feed' | 'analytics' | 'radar';
  onSelectTab?: (tab: 'dashboard' | 'feed' | 'analytics' | 'radar') => void;
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

const CAT_TRANSLATION_KEYS: Record<CategoryId, keyof typeof import('../i18n/translations').translations['en']> = {
  all: 'catAll',
  economy: 'catEconomy',
  technology: 'catTechnology',
  infrastructure: 'catInfrastructure',
  climate: 'catClimate',
  governance: 'catGovernance',
  trade: 'catTrade',
};

export function Sidebar({
  selectedCategory,
  onSelectCategory,
  collapsed,
  onToggleCollapse,
  onlyBreaking,
  onToggleBreaking,
  onOpenSearch,
  mobileOpen,
  onMobileClose,
  activeTab = 'feed',
  onSelectTab,
}: SidebarProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-zinc-200/80 bg-white/90 dark:bg-zinc-950/90 dark:border-zinc-800/80 backdrop-blur-xl transition-all duration-300 ease-out select-none',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Workspace Brand Header */}
        <div className="flex h-16 items-center justify-between px-3.5 border-b border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
          <div className={cn('flex items-center gap-2.5 overflow-hidden', collapsed && 'justify-center w-full')}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs shrink-0">
              <Radio className="h-4.5 w-4.5 animate-pulse text-white" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-zinc-950 animate-ping" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  {t('appTitle')}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono tracking-wide flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-500 inline" /> {t('subtitle')}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Command Bar Trigger */}
        <div className="p-2.5">
          <button
            onClick={onOpenSearch}
            className={cn(
              'group flex w-full items-center gap-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs hover:shadow-xs cursor-pointer',
              collapsed && 'justify-center px-0 py-2'
            )}
          >
            <Command className="h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            {!collapsed && (
              <span className="flex-1 text-left font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">
                {t('searchPlaceholder')}
              </span>
            )}
          </button>
        </div>

        {/* Workspace Views */}
        <div className="px-2.5 py-1">
          <div className="space-y-1">
            <button
              onClick={() => {
                if (onSelectTab) onSelectTab('dashboard');
                if (mobileOpen) onMobileClose();
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all cursor-pointer relative',
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100',
                collapsed && 'justify-center px-0'
              )}
            >
              <Sparkles className={cn('h-4 w-4 shrink-0', activeTab === 'dashboard' ? 'text-white' : 'text-emerald-400')} />
              {!collapsed && <span>{useLanguage().language === 'bn' ? 'এআই ড্যাশবোর্ড' : 'AI Insights'}</span>}
            </button>

            <button
              onClick={() => {
                if (onSelectTab) onSelectTab('feed');
                if (mobileOpen) onMobileClose();
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer relative',
                activeTab === 'feed' && !onlyBreaking
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100',
                collapsed && 'justify-center px-0'
              )}
            >
              <Layers className={cn('h-4 w-4 shrink-0', activeTab === 'feed' && !onlyBreaking ? 'text-emerald-400 dark:text-emerald-600' : 'text-zinc-400')} />
              {!collapsed && <span>{t('newsFeed')}</span>}
            </button>

            <button
              onClick={() => {
                if (onSelectTab) onSelectTab('analytics');
                if (mobileOpen) onMobileClose();
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100',
                collapsed && 'justify-center px-0'
              )}
            >
              <BarChart3 className={cn('h-4 w-4 shrink-0', activeTab === 'analytics' ? 'text-white' : 'text-emerald-500')} />
              {!collapsed && <span>{t('analytics')}</span>}
            </button>

            <button
              onClick={() => {
                if (onSelectTab) onSelectTab('feed');
                onToggleBreaking(!onlyBreaking);
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer',
                onlyBreaking && activeTab === 'feed'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100',
                collapsed && 'justify-center px-0'
              )}
            >
              <Zap className="h-4 w-4 text-rose-500 shrink-0" />
              {!collapsed && <span>{t('breakingOnly')}</span>}
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-none space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Sectors
            </div>
          )}
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const IconComponent = ICON_MAP[cat.iconName] || FileText;
              const isSelected = selectedCategory === cat.id && !onlyBreaking && activeTab === 'feed';
              const label = t(CAT_TRANSLATION_KEYS[cat.id]);

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (onSelectTab) onSelectTab('feed');
                    onSelectCategory(cat.id);
                    if (onlyBreaking) onToggleBreaking(false);
                    if (mobileOpen) onMobileClose();
                  }}
                  className={cn(
                    'group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all cursor-pointer',
                    isSelected
                      ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100',
                    collapsed && 'justify-center px-0'
                  )}
                  title={label}
                >
                  <IconComponent
                    className={cn(
                      'h-4 w-4 shrink-0 transition-transform group-hover:scale-105 duration-200',
                      isSelected
                        ? 'text-emerald-400 dark:text-emerald-600'
                        : 'text-zinc-400 dark:text-zinc-500'
                    )}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {!collapsed && (
                    <span
                      className={cn(
                        'ml-auto text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md',
                        isSelected
                          ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                          : 'text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900'
                      )}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / System Status */}
        <div className="p-3 border-t border-zinc-200/60 dark:border-zinc-800/60 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/30">
          {!collapsed ? (
            <div className="flex flex-col space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t('statusOnline')}
                </span>
                <span className="font-mono text-zinc-400 text-[10px]">
                  {t('dhakaTime')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="System Operational">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
