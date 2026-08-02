import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Database,
  Clock,
  Layers,
  Rss,
  Globe,
  Code,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Plus,
  Trash2,
  SlidersHorizontal,
  Terminal,
  Activity,
  Server,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

interface SchedulerStatus {
  isRunning: boolean;
  intervalMinutes: number;
  lastRunTime?: string;
  nextRunTime?: string;
  totalRuns: number;
  totalArticlesCollected: number;
  totalDuplicatesDetected: number;
  usingSupabase: boolean;
  supabaseUrlConfigured: boolean;
}

interface PipelineRunLog {
  id: string;
  timestamp: string;
  durationMs: number;
  sourcesProcessed: number;
  rawCollected: number;
  newUniqueSaved: number;
  duplicatesDetected: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  logs: string[];
}

interface NewsSource {
  id: string;
  name: string;
  type: 'rss' | 'official_api' | 'web_scraper';
  url: string;
  category: string;
  enabled: boolean;
  selector?: string;
  description?: string;
  lastFetchedAt?: string;
}

interface DatabaseStatus {
  type: 'supabase' | 'in_memory';
  connected: boolean;
  message: string;
  url?: string;
  tableSchemaSql: string;
}

interface BackendServicePanelProps {
  onRefreshNewsFeed?: () => void;
}

export const BackendServicePanel: React.FC<BackendServicePanelProps> = ({ onRefreshNewsFeed }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scheduler' | 'sources' | 'supabase' | 'architecture'>('scheduler');
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [logs, setLogs] = useState<PipelineRunLog[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [triggering, setTriggering] = useState<boolean>(false);
  const [enriching, setEnriching] = useState<boolean>(false);
  const [enrichStatusMsg, setEnrichStatusMsg] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [timeToNextRun, setTimeToNextRun] = useState<string>('--:--');

  // New source form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    type: 'rss' as 'rss' | 'official_api' | 'web_scraper',
    url: '',
    category: 'General',
    selector: '',
    description: ''
  });

  const fetchServiceData = async () => {
    setLoading(true);
    try {
      const [statusRes, sourcesRes, dbRes] = await Promise.all([
        fetch('/api/pipeline/status'),
        fetch('/api/sources'),
        fetch('/api/supabase/status')
      ]);

      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatus(data.status);
        setLogs(data.logs || []);
      }

      if (sourcesRes.ok) {
        const data = await sourcesRes.json();
        setSources(data.sources || []);
      }

      if (dbRes.ok) {
        const data = await dbRes.json();
        setDbStatus(data.dbStatus);
      }
    } catch (err) {
      console.error('Error fetching backend service status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
    const interval = setInterval(fetchServiceData, 15000); // Poll status every 15s
    return () => clearInterval(interval);
  }, []);

  // Timer countdown calculation
  useEffect(() => {
    if (!status?.nextRunTime) return;

    const timerInterval = setInterval(() => {
      const next = new Date(status.nextRunTime!).getTime();
      const now = new Date().getTime();
      const diff = next - now;

      if (diff <= 0) {
        setTimeToNextRun('Running...');
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeToNextRun(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [status?.nextRunTime]);

  const handleTriggerRun = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/pipeline/run', { method: 'POST' });
      if (res.ok) {
        await fetchServiceData();
        if (onRefreshNewsFeed) onRefreshNewsFeed();
      }
    } catch (err) {
      console.error('Trigger run failed:', err);
    } finally {
      setTriggering(false);
    }
  };

  const handleEnrichAll = async () => {
    setEnriching(true);
    setEnrichStatusMsg('Gemini API analyzing articles...');
    try {
      const res = await fetch('/api/news/enrich-all', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEnrichStatusMsg(`Enriched ${data.enrichedCount || 0} articles with Gemini!`);
        await fetchServiceData();
        if (onRefreshNewsFeed) onRefreshNewsFeed();
      } else {
        setEnrichStatusMsg('Enrichment completed.');
      }
    } catch (err) {
      console.error('Gemini enrichment failed:', err);
      setEnrichStatusMsg('Enrichment failed.');
    } finally {
      setEnriching(false);
      setTimeout(() => setEnrichStatusMsg(''), 4000);
    }
  };

  const handleToggleSource = async (source: NewsSource) => {
    try {
      await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...source, enabled: !source.enabled })
      });
      fetchServiceData();
    } catch (err) {
      console.error('Failed to toggle source:', err);
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await fetch(`/api/sources/${id}`, { method: 'DELETE' });
      fetchServiceData();
    } catch (err) {
      console.error('Failed to delete source:', err);
    }
  };

  const handleAddSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;

    try {
      await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource)
      });
      setShowAddForm(false);
      setNewSource({ name: '', type: 'rss', url: '', category: 'General', selector: '', description: '' });
      fetchServiceData();
    } catch (err) {
      console.error('Failed to add source:', err);
    }
  };

  const handleCopySql = () => {
    if (dbStatus?.tableSchemaSql) {
      navigator.clipboard.writeText(dbStatus.tableSchemaSql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Panel Header */}
      <div className="px-5 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
            <Server className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {t('pipelineTitle')}
              </h2>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md">
                {t('schedulerActive')}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              {t('pipelineSubtitle')}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {enrichStatusMsg && (
            <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {enrichStatusMsg}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnrichAll}
            disabled={enriching}
            className="h-7 text-xs font-semibold rounded-lg gap-1 border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20"
            title="Trigger Gemini API enrichment"
          >
            <Sparkles className={`h-3.5 w-3.5 ${enriching ? 'animate-spin' : ''}`} />
            {enriching ? 'Analyzing...' : t('enrichGemini')}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleTriggerRun}
            disabled={triggering}
            className="h-7 text-xs font-semibold rounded-lg gap-1 shadow-2xs"
          >
            <Play className={`h-3.5 w-3.5 ${triggering ? 'animate-spin' : ''}`} />
            {triggering ? 'Collecting...' : t('runNow')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2 text-xs rounded-lg flex items-center gap-1 font-semibold text-zinc-600 dark:text-zinc-300"
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Settings & Logs</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Tabs & Details */}
      {isExpanded && (
        <>
          <div className="flex border-t border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/40 dark:bg-zinc-950/40 px-4 gap-1 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('scheduler')}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'scheduler'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              10-Min Scheduler ({timeToNextRun})
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sources'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Sources ({(sources || []).length})
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'supabase'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              Supabase ({dbStatus?.type === 'supabase' ? 'Connected' : 'Fallback Local'})
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              SOLID Architecture
            </button>
          </div>
        </>
      )}

      {/* Tab Content Areas */}
      {isExpanded && (
        <div className="p-5">
        {/* TAB 1: 10-MINUTE SCHEDULER & PIPELINE LOGS */}
        {activeTab === 'scheduler' && (
          <div className="space-y-5">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  Scheduler State
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Auto-Updating (10m)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Next Run Countdown</span>
                <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {timeToNextRun}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Total Processed</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {status?.totalArticlesCollected || 0}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Duplicates Filtered</span>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {status?.totalDuplicatesDetected || 0}
                </p>
              </div>
            </div>

            {/* Pipeline Execution Audit Logs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                  Pipeline Real-Time Terminal Logs
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">Showing last {(logs || []).length} runs</span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 max-h-64 overflow-y-auto space-y-3 shadow-inner">
                {(logs || []).length === 0 ? (
                  <p className="text-zinc-500 italic">No logs recorded yet. Click "Run Pipeline Now" to initiate run.</p>
                ) : (
                  (logs || []).map((log) => (
                    <div key={log.id} className="space-y-1 border-b border-zinc-800/80 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Run ID: {log.id} ({log.status})
                        </span>
                        <span className="text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()} ({log.durationMs}ms)</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 pl-3 space-y-0.5 border-l border-zinc-800/60">
                        <p>Raw Collected: <span className="text-zinc-200">{log.rawCollected}</span> | New Saved: <span className="text-emerald-400 font-bold">{log.newUniqueSaved}</span> | Duplicates: <span className="text-amber-400">{log.duplicatesDetected}</span></p>
                        {(log.logs || []).slice(-4).map((line, idx) => (
                          <p key={idx} className="truncate text-zinc-500">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEWS SOURCES MANAGEMENT */}
        {activeTab === 'sources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Configured Collection Sources
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Collectors fetch news from RSS feeds, Official REST APIs, and Web Scrapers.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
                className="h-8 text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Source
              </Button>
            </div>

            {/* Add Source Form */}
            {showAddForm && (
              <form onSubmit={handleAddSourceSubmit} className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3 text-xs">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Add New News Source</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Source Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daily Star Tech RSS"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Collector Type *</label>
                    <select
                      value={newSource.type}
                      onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="rss">RSS / Atom Feed</option>
                      <option value="official_api">Official REST API</option>
                      <option value="web_scraper">Permitted Web Scraper</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Target URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/feed"
                      value={newSource.url}
                      onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                    />
                  </div>

                  {newSource.type === 'web_scraper' && (
                    <div className="md:col-span-2">
                      <label className="block text-zinc-600 dark:text-zinc-400 mb-1">HTML Container Selector (Cheerio)</label>
                      <input
                        type="text"
                        placeholder="article, .news-card, .post"
                        value={newSource.selector}
                        onChange={(e) => setNewSource({ ...newSource, selector: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="rounded-xl"
                  >
                    Save Source
                  </Button>
                </div>
              </form>
            )}

            {/* Sources List */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden text-xs shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100/60 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200/80 dark:border-zinc-800/80">
                    <th className="p-3 font-semibold">Source</th>
                    <th className="p-3 font-semibold">Type</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                  {sources.map((src) => (
                    <tr key={src.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{src.name}</div>
                        <div className="text-[11px] font-mono text-zinc-400 truncate max-w-xs">{src.url}</div>
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                          {src.type === 'rss' && <Rss className="h-3 w-3 text-orange-500" />}
                          {src.type === 'official_api' && <Code className="h-3 w-3 text-blue-500" />}
                          {src.type === 'web_scraper' && <Globe className="h-3 w-3 text-emerald-500" />}
                          {src.type.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{src.category}</td>

                      <td className="p-3">
                        <button
                          onClick={() => handleToggleSource(src)}
                          className={`px-2.5 py-0.5 rounded-xl font-semibold cursor-pointer transition-all ${
                            src.enabled
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {src.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteSource(src.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-500/10"
                          title="Delete Source"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUPABASE CONFIGURATION & DDL SCHEMA */}
        {activeTab === 'supabase' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-emerald-500" />
                  Supabase Project Connection Status
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-xl ${
                  dbStatus?.type === 'supabase'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {dbStatus?.type === 'supabase' ? 'Connected to Supabase' : 'Local Fallback Storage Active'}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                {dbStatus?.message}
              </p>

              {!status?.supabaseUrlConfigured && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    How to connect your external Supabase database:
                  </p>
                  <ol className="list-decimal pl-5 space-y-0.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <li>Create a new database project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-semibold text-emerald-600">supabase.com</a></li>
                    <li>Add <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">SUPABASE_URL</code> and <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">SUPABASE_SERVICE_ROLE_KEY</code> in the platform Secrets panel.</li>
                    <li>Execute the SQL schema below in your Supabase SQL Editor.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Copyable DDL SQL Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-emerald-500" />
                  Supabase PostgreSQL Tables & Index DDL
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySql}
                  className="h-7 text-xs rounded-xl gap-1.5"
                >
                  {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSql ? 'Copied SQL!' : 'Copy Schema SQL'}
                </Button>
              </div>

              <pre className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 text-emerald-400 font-mono text-[11px] max-h-56 overflow-y-auto shadow-inner">
                {dbStatus?.tableSchemaSql}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: SOLID ARCHITECTURE BLUEPRINT */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              SOLID Architectural Principles Implementation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  S - Single Responsibility Principle
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Each collector class (<code className="font-mono text-emerald-500">RssCollector</code>, <code className="font-mono text-emerald-500">OfficialApiCollector</code>, <code className="font-mono text-emerald-500">WebScraperCollector</code>) handles ONLY its source format. <code className="font-mono text-emerald-500">DeduplicationService</code> handles ONLY similarity logic.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  O - Open/Closed Principle
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  New source collector types or custom API connectors can be added by implementing <code className="font-mono text-emerald-500">INewsCollector</code> without modifying existing pipeline code.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  L - Liskov Substitution Principle
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  All collectors implement <code className="font-mono text-emerald-500">INewsCollector</code> uniformly and can be swapped or combined interchangeably in the pipeline array.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  D - Dependency Inversion Principle
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  The high-level orchestrator <code className="font-mono text-emerald-500">NewsPipelineService</code> depends on abstract interfaces (<code className="font-mono text-emerald-500">INewsRepository</code>), enabling instant seamless switching between Supabase and local stores.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
