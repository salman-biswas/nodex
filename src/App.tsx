import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Layers, BarChart3, RefreshCw, Radio, Sparkles, MapPin, SlidersHorizontal, Zap } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { BreakingNewsBanner } from './components/BreakingNewsBanner';
import { NewsCategoryTabs } from './components/NewsCategoryTabs';
import { TrendingPanel } from './components/TrendingPanel';
import { NewsGrid } from './components/NewsGrid';
import { Footer } from './components/Footer';
import { ExecutiveTicker } from './components/ExecutiveTicker';
import { DivisionMapRadar } from './components/DivisionMapRadar';
import { QuickDashboards } from './components/QuickDashboards';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AiInsightsDashboard } from './components/AiInsightsDashboard';
import { CATEGORIES, TRENDING_TOPICS, AI_EXECUTIVE_BRIEF } from './data/mockNews';
import { CategoryId, Sentiment } from './types';
import { useNewsFeed } from './hooks/useNewsFeed';
import { Badge } from './components/ui/Badge';
import { useLanguage } from './context/LanguageContext';

// Lazy Loaded Heavy Components for Code Splitting
const AnalyticsDashboard = lazy(() =>
  import('./components/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard }))
);
const SearchModal = lazy(() =>
  import('./components/SearchModal').then((m) => ({ default: m.SearchModal }))
);
const NewsDetailModal = lazy(() =>
  import('./components/NewsDetailModal').then((m) => ({ default: m.NewsDetailModal }))
);

function SuspenseFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xs">
      <RefreshCw className="h-5 w-5 text-emerald-500 animate-spin" />
      <span className="text-xs font-mono text-zinc-400 font-medium">
        Syncing Command Center Intelligence...
      </span>
    </div>
  );
}

export default function App() {
  const { language, t } = useLanguage();

  // Navigation View State ('dashboard' | 'feed' | 'analytics' | 'radar')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feed' | 'analytics' | 'radar'>('dashboard');

  // Forced Dark Mode Baseline
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Filter and Layout states
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | Sentiment>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'impact' | 'trending'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [onlyBreaking, setOnlyBreaking] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);

  // TanStack Query Feed Hook
  const {
    articles,
    allFetchedItems,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useNewsFeed({
    category: selectedCategory,
    sentiment: selectedSentiment,
    sortBy,
    searchQuery,
    onlyBreaking,
  });

  // Ensure 'dark' class on <html> element
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSelectNews = (id: string | null) => {
    setSelectedNewsId(id);
  };

  // Global Keyboard Shortcuts (⌘K, ⌘B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const breakingNewsItems = useMemo(
    () => allFetchedItems.filter((item) => item.isBreaking),
    [allFetchedItems]
  );

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  const activeDetailNews = allFetchedItems.find((n) => n.id === selectedNewsId) || null;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setOnlyBreaking(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans pb-28 md:pb-8 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Live Macro Market & Weather Ticker */}
      <ExecutiveTicker />

      {/* Sidebar Navigation */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onlyBreaking={onlyBreaking}
        onToggleBreaking={(active) => setOnlyBreaking(active)}
        onOpenSearch={() => setIsSearchOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area Container */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        {/* Top Navigation */}
        <TopNav
          onOpenSearch={() => setIsSearchOpen(true)}
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          selectedCategoryName={
            activeTab === 'dashboard'
              ? 'AI Insights Dashboard'
              : activeTab === 'analytics'
              ? 'Macro Economy & Markets'
              : activeTab === 'radar'
              ? 'Bangladesh Regional Radar'
              : onlyBreaking
              ? 'Breaking Alerts'
              : selectedCategoryObj.label
          }
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSelectNewsItem={(id) => handleSelectNews(id)}
          onOpenPerformance={() => setIsPerformanceOpen(true)}
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-5">
          
          {/* Main Top Command View Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-emerald'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>{language === 'bn' ? 'এআই ড্যাশবোর্ড' : 'AI Insights Dashboard'}</span>
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeTab === 'feed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-emerald'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'সংবাদ ফিড' : 'Live Feed'}</span>
                <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-mono bg-zinc-800 text-zinc-300">
                  {allFetchedItems.length}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab('radar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeTab === 'radar'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-emerald'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>{language === 'bn' ? 'বিভাগীয় রাডার' : 'Regional Radar'}</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-emerald'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                <span>{language === 'bn' ? 'এনালাইটিক্স' : 'Analytics'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono hover:border-emerald-500/40 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ask AI (⌘K)</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: PRIMARY LANDING - AI INSIGHTS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <AiInsightsDashboard
              newsItems={allFetchedItems}
              onSelectNews={(id) => handleSelectNews(id)}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat as any);
                setActiveTab('feed');
              }}
            />
          )}

          {/* VIEW 2: REGIONAL RADAR PAGE */}
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <DivisionMapRadar
                onSelectDivision={(divName) => {
                  setSearchQuery(divName);
                  setActiveTab('feed');
                }}
              />
              <QuickDashboards />
            </div>
          )}

          {/* VIEW 3: ANALYTICS PAGE */}
          {activeTab === 'analytics' && (
            <Suspense fallback={<SuspenseFallback />}>
              <AnalyticsDashboard
                newsItems={allFetchedItems}
                onSelectNews={(id) => handleSelectNews(id)}
                isLoading={isLoading}
                onRefreshData={refetch}
              />
            </Suspense>
          )}

          {/* VIEW 4: PRIMARY LIVE NEWS FEED */}
          {activeTab === 'feed' && (
            <>
              {/* Breaking News Banner */}
              <BreakingNewsBanner
                breakingNews={breakingNewsItems}
                onSelectNews={(id) => handleSelectNews(id)}
              />

              {/* Main Workspace Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Main News Stream Column (2/3 width on desktop) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Category & Sentiment Filter Bar */}
                  <NewsCategoryTabs
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    selectedSentiment={selectedSentiment}
                    onSelectSentiment={setSelectedSentiment}
                    viewMode={viewMode}
                    onToggleViewMode={setViewMode}
                  />

                  {/* News Items Grid / List with Infinite Scroll */}
                  <NewsGrid
                    items={articles}
                    onSelectNews={(id) => handleSelectNews(id)}
                    viewMode={viewMode}
                    onResetFilters={handleResetFilters}
                    isLoading={isLoading}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    onFetchNextPage={fetchNextPage}
                  />
                </div>

                {/* Side Trending Intelligence Panel (1/3 width on desktop) */}
                <div className="lg:col-span-1 space-y-4">
                  <TrendingPanel
                    topics={TRENDING_TOPICS}
                    onTopicClick={(topic) => {
                      setSearchQuery(topic);
                      setIsSearchOpen(true);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Touch Navigation Bar */}
      <MobileBottomNav
        activeTab={
          activeTab === 'dashboard'
            ? 'dashboard'
            : activeTab === 'radar'
            ? 'radar'
            : activeTab === 'analytics'
            ? 'analytics'
            : 'news'
        }
        onChangeTab={(tab) => {
          if (tab === 'dashboard') setActiveTab('dashboard');
          else if (tab === 'news') setActiveTab('feed');
          else if (tab === 'radar') setActiveTab('radar');
          else if (tab === 'analytics') setActiveTab('analytics');
        }}
        onOpenAiSearch={() => setIsSearchOpen(true)}
      />

      {/* Command Palette Search Modal */}
      <Suspense fallback={null}>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          newsItems={allFetchedItems}
          onSelectNews={(id) => handleSelectNews(id)}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </Suspense>

      {/* News Detail Full Report Modal */}
      <Suspense fallback={null}>
        <NewsDetailModal
          news={activeDetailNews}
          isOpen={!!selectedNewsId}
          onClose={() => setSelectedNewsId(null)}
        />
      </Suspense>
    </div>
  );
}
