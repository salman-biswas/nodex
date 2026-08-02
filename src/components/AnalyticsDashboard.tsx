import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart2,
  TrendingUp,
  Clock,
  Globe,
  Radio,
  RefreshCw,
  Zap,
  Activity,
  Layers,
  Award,
  Eye,
  Bookmark,
  Sparkles,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Hash,
  ExternalLink,
  Flame,
  CheckCircle2,
  Filter,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { NewsItem, CategoryId } from '../types';
import { CATEGORIES } from '../data/mockNews';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface AnalyticsDashboardProps {
  newsItems: NewsItem[];
  onSelectNews: (id: string) => void;
  isLoading?: boolean;
  onRefreshData?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  economy: '#10b981', // emerald
  technology: '#3b82f6', // blue
  infrastructure: '#8b5cf6', // purple
  climate: '#14b8a6', // teal
  governance: '#f59e0b', // amber
  trade: '#ec4899', // pink
  all: '#64748b'
};

const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#3b82f6',
  negative: '#f43f5e',
  'high-impact': '#8b5cf6'
};

export function AnalyticsDashboard({
  newsItems,
  onSelectNews,
  isLoading = false,
  onRefreshData
}: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date());
  const [livePulseTick, setLivePulseTick] = useState(0);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  // Real-time ticking simulation effect
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setLastUpdatedTime(new Date());
      setLivePulseTick((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  // 1. TODAY'S ARTICLES STATS
  const todaysArticles = useMemo(() => {
    return newsItems.slice(0, 30); // Take current batch
  }, [newsItems, livePulseTick]);

  const totalViews = useMemo(() => {
    return newsItems.reduce((acc, item) => acc + (item.viewsCount || 0), 0) + livePulseTick * 12;
  }, [newsItems, livePulseTick]);

  const totalBookmarks = useMemo(() => {
    return newsItems.reduce((acc, item) => acc + (item.bookmarkCount || 0), 0) + Math.floor(livePulseTick * 1.5);
  }, [newsItems, livePulseTick]);

  const avgImpactScore = useMemo(() => {
    if (newsItems.length === 0) return '0.0';
    const sum = newsItems.reduce((acc, item) => acc + item.impactScore, 0);
    return (sum / newsItems.length).toFixed(1);
  }, [newsItems]);

  // HOURLY TIMELINE DISTRIBUTION (Today's 24H)
  const hourlyData = useMemo(() => {
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    return hours.map((hour, idx) => {
      const baseArticles = 3 + Math.floor(Math.sin(idx + livePulseTick) * 3) + (idx % 3);
      const views = baseArticles * 420 + (livePulseTick % 5) * 45;
      return {
        time: hour,
        articles: Math.max(1, baseArticles),
        views: views,
        impact: +(7.5 + (idx % 3) * 0.5).toFixed(1)
      };
    });
  }, [livePulseTick]);

  // 2. ARTICLES PER SOURCE
  const articlesPerSource = useMemo(() => {
    const sourceMap: Record<string, { count: number; totalImpact: number; domain: string }> = {};

    newsItems.forEach((item) => {
      const sourceName = item.source?.name || 'Unknown Source';
      if (!sourceMap[sourceName]) {
        sourceMap[sourceName] = { count: 0, totalImpact: 0, domain: item.source?.domain || '' };
      }
      sourceMap[sourceName].count += 1;
      sourceMap[sourceName].totalImpact += item.impactScore;
    });

    return Object.entries(sourceMap)
      .map(([name, data]) => ({
        source: name,
        domain: data.domain,
        articles: data.count,
        avgImpact: +(data.totalImpact / data.count).toFixed(1)
      }))
      .sort((a, b) => b.articles - a.articles);
  }, [newsItems]);

  // 3. TRENDING CATEGORIES
  const trendingCategoriesData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') categoryCounts[cat.id] = 0;
    });

    newsItems.forEach((item) => {
      if (categoryCounts[item.category] !== undefined) {
        categoryCounts[item.category] += 1;
      }
    });

    return CATEGORIES.filter((c) => c.id !== 'all').map((cat) => ({
      id: cat.id,
      name: cat.label,
      count: categoryCounts[cat.id] || 0,
      color: CATEGORY_COLORS[cat.id] || '#10b981'
    }));
  }, [newsItems]);

  // 4. MOST READ ARTICLES
  const mostReadArticles = useMemo(() => {
    return [...newsItems]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 6);
  }, [newsItems]);

  // 5. MOST BOOKMARKED ARTICLES
  const mostBookmarkedArticles = useMemo(() => {
    return [...newsItems]
      .sort((a, b) => (b.bookmarkCount || 0) - (a.bookmarkCount || 0))
      .slice(0, 6);
  }, [newsItems]);

  // 6. SENTIMENT GRAPH DATA
  const sentimentDistribution = useMemo(() => {
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
      'high-impact': 0
    };

    newsItems.forEach((item) => {
      const s = item.sentiment as keyof typeof sentimentCounts;
      if (sentimentCounts[s] !== undefined) {
        sentimentCounts[s] += 1;
      } else {
        sentimentCounts.neutral += 1;
      }
    });

    const total = newsItems.length || 1;

    return [
      { name: 'Positive Outlook', value: sentimentCounts.positive, percentage: Math.round((sentimentCounts.positive / total) * 100), color: SENTIMENT_COLORS.positive },
      { name: 'Neutral Stability', value: sentimentCounts.neutral, percentage: Math.round((sentimentCounts.neutral / total) * 100), color: SENTIMENT_COLORS.neutral },
      { name: 'High Impact / Risk', value: sentimentCounts.negative, percentage: Math.round((sentimentCounts.negative / total) * 100), color: SENTIMENT_COLORS.negative }
    ];
  }, [newsItems]);

  // 7. TOP KEYWORDS FREQUENCY
  const topKeywords = useMemo(() => {
    const kwMap: Record<string, number> = {};

    newsItems.forEach((item) => {
      const list = [
        ...(item.keyTakeaways || []),
        ...(item.entities || []),
        ...(item.aiEnrichment?.keywords || [])
      ];

      list.forEach((kw) => {
        const clean = kw.trim();
        if (clean.length > 2 && clean.length < 30) {
          kwMap[clean] = (kwMap[clean] || 0) + 1;
        }
      });
    });

    return Object.entries(kwMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 14);
  }, [newsItems]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* HEADER CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Live Intelligence Analytics
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 text-[10px] font-mono gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              REAL-TIME
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time article throughput, source volume, sentiment analysis & engagement metrics across Bangladesh news intelligence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 p-0.5 text-xs font-semibold">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {t === '24h' ? '24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {/* Live Auto-Refresh Toggle */}
          <button
            onClick={() => setIsLiveUpdating(!isLiveUpdating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isLiveUpdating
                ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle automatic real-time stream polling"
          >
            <Radio className={`h-3.5 w-3.5 ${isLiveUpdating ? 'text-emerald-500 animate-pulse' : 'text-zinc-400'}`} />
            <span>{isLiveUpdating ? 'Live Sync Active' : 'Live Sync Paused'}</span>
          </button>

          {/* Refresh Data Button */}
          {onRefreshData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshData}
              disabled={isLoading}
              className="gap-1.5 h-8 text-xs cursor-pointer border-zinc-200 dark:border-zinc-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          )}
        </div>
      </div>

      {/* TOP METRIC CARDS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Today's Articles */}
        <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Today's Articles</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {newsItems.length}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              +18.4% <TrendingUp className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Articles collected & enriched today
          </p>
        </div>

        {/* Metric 2: Total Reader Views */}
        <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Total Reader Engagement</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              Live Stream
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Real-time reader view count across feed
          </p>
        </div>

        {/* Metric 3: Total Saved & Bookmarked */}
        <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Most Bookmarked Velocity</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {totalBookmarks.toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              +12.1%
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Cumulative bookmarks saved by users
          </p>
        </div>

        {/* Metric 4: Average Impact Score */}
        <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Avg Macro Impact Score</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {avgImpactScore} <span className="text-sm font-normal text-zinc-400">/ 10</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              High Impact
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Calculated via AI severity vectoring
          </p>
        </div>

      </div>

      {/* SECTION 1: TODAY'S ARTICLES HOURLY TIMELINE & SENTIMENT GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Articles Timeline Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                Today's Article Volume Timeline
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hourly publication distribution and reader view traffic throughout the day
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-zinc-200 dark:border-zinc-800">
              Updated {lastUpdatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px'
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="articles" name="Articles Published" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArticles)" />
                <Area yAxisId="right" type="monotone" dataKey="views" name="Reader Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Graph (1 Col) */}
        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-500" />
              Sentiment Graph Analysis
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Proportion of positive, neutral & high-risk stories
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            {sentimentDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">{item.value}</span>
                  <span className="text-zinc-400 text-[11px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 2: ARTICLES PER SOURCE & TRENDING CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Articles Per Source Chart */}
        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Articles Per Source
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Distribution of reports ingested across verified news media outlets
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={articlesPerSource.slice(0, 7)} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" strokeOpacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="source" type="category" width={130} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="articles" name="Article Count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Categories Breakdown */}
        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-500" />
              Trending Categories
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Volume & sector concentration across Bangladesh intelligence topics
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendingCategoriesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} angle={-25} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Articles" radius={[6, 6, 0, 0]}>
                  {trendingCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SECTION 3: MOST READ & MOST BOOKMARKED LEADERBOARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Read Articles Leaderboard */}
        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" />
                Most Read Articles
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Top news stories ranked by total reader views
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Top 6
            </Badge>
          </div>

          <div className="space-y-2.5">
            {mostReadArticles.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => onSelectNews(article.id)}
                className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono font-bold text-xs">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <span>{article.source.name}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Impact {article.impactScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <Eye className="h-3.5 w-3.5 text-blue-500" />
                  <span>{(article.viewsCount || 0).toLocaleString()}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Bookmarked Articles Leaderboard */}
        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-amber-500" />
                Most Bookmarked
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Top news stories saved by high-value executive readers
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Top 6
            </Badge>
          </div>

          <div className="space-y-2.5">
            {mostBookmarkedArticles.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => onSelectNews(article.id)}
                className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-amber-500/50 hover:bg-white dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <span className="uppercase text-amber-600 dark:text-amber-400 font-bold">{article.category}</span>
                      <span>•</span>
                      <span>{article.source.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{(article.bookmarkCount || 0).toLocaleString()}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 4: TOP KEYWORDS FREQUENCY */}
      <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Hash className="h-4 w-4 text-emerald-500" />
              Top Keywords & Entities Frequency
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              AI entity extraction and recurring intelligence key phrases
            </p>
          </div>
          {selectedKeyword && (
            <button
              onClick={() => setSelectedKeyword(null)}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Keywords Cloud Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {topKeywords.map((kw) => {
            const isSelected = selectedKeyword === kw.word;
            return (
              <button
                key={kw.word}
                onClick={() => setSelectedKeyword(isSelected ? null : kw.word)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50'
                }`}
              >
                <span>#{kw.word}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {kw.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
