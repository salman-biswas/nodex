import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Command,
  Globe,
  SlidersHorizontal,
  Check,
  Languages
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { NotificationPanel } from './NotificationPanel';
import { NOTIFICATIONS } from '../data/mockNews';
import { NotificationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TopNavProps {
  onOpenSearch: () => void;
  onMobileMenuToggle: () => void;
  selectedCategoryName: string;
  sortBy: 'latest' | 'impact' | 'trending';
  onSortChange: (sort: 'latest' | 'impact' | 'trending') => void;
  onSelectNewsItem?: (id: string) => void;
  onOpenPerformance?: () => void;
}

export function TopNav({
  onOpenSearch,
  onMobileMenuToggle,
  selectedCategoryName,
  sortBy,
  onSortChange,
  onSelectNewsItem,
}: TopNavProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.newsId && onSelectNewsItem) {
      onSelectNewsItem(item.newsId);
      setShowNotifications(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 lg:px-8 transition-colors">
      {/* Left Area: Mobile Menu & Category Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="flex lg:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 dark:text-zinc-500">
            <Globe className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{t('appTitle')}</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
          </span>
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
            <span className="truncate">{selectedCategoryName}</span>
          </h1>
        </div>
      </div>

      {/* Center Search Input Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="group flex w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 px-3.5 py-2 text-xs text-zinc-500 dark:text-zinc-400 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
          <span className="flex-1 text-left font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">
            {t('searchPlaceholder')}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="flex h-5 items-center gap-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-1.5 text-[10px] font-mono text-zinc-400 shadow-2xs">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px] rounded-xl active:scale-95"
          onClick={onOpenSearch}
          title="Search"
        >
          <Search className="h-4.5 w-4.5" />
        </Button>

        {/* Language Switch Button (EN / বাংলা) */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Switch Language (English / বাংলা)"
        >
          <Languages className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="text-xs">{language === 'en' ? 'বাংলা' : 'English'}</span>
        </button>

        {/* Sort Dropdown Selector */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="hidden sm:flex min-h-[44px] px-3 rounded-xl text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {sortBy === 'latest' ? t('latestFirst') : sortBy === 'impact' ? t('highImpact') : t('trendingFirst')}
            </span>
          </Button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-1.5 shadow-xl z-50 animate-in fade-in duration-200">
              <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider">
                {t('sortBy')}
              </div>
              {[
                { id: 'latest', label: t('latestFirst') },
                { id: 'impact', label: t('highImpact') },
                { id: 'trending', label: t('trendingFirst') },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange(option.id as 'latest' | 'impact' | 'trending');
                    setShowSortDropdown(false);
                  }}
                  className="flex w-full min-h-[44px] items-center justify-between rounded-xl px-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <span className="font-medium">{option.label}</span>
                  {sortBy === option.id && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
            title={t('notifications')}
          >
            <Bell className="h-4.5 w-4.5 text-zinc-700 dark:text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
            )}
          </Button>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onClose={() => setShowNotifications(false)}
              onNotificationClick={handleNotificationClick}
            />
          )}
        </div>
      </div>
    </header>
  );
}
