import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Wind,
  FileText,
  Train,
  Briefcase,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export function QuickDashboards() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'markets' | 'weather' | 'circulars' | 'traffic' | 'jobs'>('markets');

  return (
    <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-md rounded-xl overflow-hidden terminal-card">
      {/* Header Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/80 px-2 pt-2 gap-1 overflow-x-auto text-xs font-mono scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab('markets')}
          className={`flex items-center gap-1.5 px-3 min-h-[44px] border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs font-semibold active:scale-95 ${
            activeTab === 'markets'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="h-4 w-4 shrink-0" />
          {language === 'bn' ? 'শেয়ার বাজার ও মুদ্রা' : 'Stock & FX Market'}
        </button>

        <button
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-1.5 px-3 min-h-[44px] border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs font-semibold active:scale-95 ${
            activeTab === 'weather'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wind className="h-4 w-4 shrink-0" />
          {language === 'bn' ? 'বায়ু ও আবহাওয়া' : 'Weather & AQI'}
        </button>

        <button
          onClick={() => setActiveTab('circulars')}
          className={`flex items-center gap-1.5 px-3 min-h-[44px] border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs font-semibold active:scale-95 ${
            activeTab === 'circulars'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          {language === 'bn' ? 'সরকারি গ্যাজেট' : 'Govt Circulars'}
        </button>

        <button
          onClick={() => setActiveTab('traffic')}
          className={`flex items-center gap-1.5 px-3 min-h-[44px] border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs font-semibold active:scale-95 ${
            activeTab === 'traffic'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Train className="h-4 w-4 shrink-0" />
          {language === 'bn' ? 'ট্রাফিক ও মেট্রোরেল' : 'Transit & Traffic'}
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-1.5 px-3 min-h-[44px] border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs font-semibold active:scale-95 ${
            activeTab === 'jobs'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Briefcase className="h-4 w-4 shrink-0" />
          {language === 'bn' ? 'চাকরি ও শিল্প' : 'Jobs & Hiring'}
        </button>
      </div>

      <CardContent className="p-4">
        {/* TAB 1: MARKETS */}
        {activeTab === 'markets' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">DSEX Index</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-zinc-100">5,842.10</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">+0.82%</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[65%]" />
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">DSE30 Bluechip</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-zinc-100">2,088.45</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">+1.15%</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">USD / BDT Rate</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-zinc-100">৳119.85</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Stable</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">Crawl Bank Mid-Rate</span>
              </div>

              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Daily Turnover</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-zinc-100">৳748.2 Cr</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">+14%</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">Bank & Pharma leads</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  {language === 'bn' ? 'মার্কেট ট্রেন্ড টেকওয়ে' : 'Market Trend AI Digest'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Updated 5m ago</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {language === 'bn'
                  ? 'বৈদেশিক মুদ্রার রিজার্ভ ২১.৮ বিলিয়ন ডলারে পৌঁছানোর ফলে ব্যাংক ও আর্থিক খাতে বিনিয়োগকারীদের আস্থা বৃদ্ধি পেয়েছে। ডিএসইএক্স সূচকে টেক্সটাইল ও টেলিকম শেয়ারের চাহিদা বেড়েছে।'
                  : 'Institutional buying in banking and telecommunication counters lifted DSEX above 5,840. The stability in USD exchange rate is mitigating import liability risks.'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: WEATHER */}
        {activeTab === 'weather' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400">Dhaka Air Quality</span>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">AQI 138 • Moderate</div>
                  <span className="text-[10px] text-zinc-500">PM2.5 primary pollutant</span>
                </div>
                <Wind className="h-6 w-6 text-amber-400" />
              </div>

              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400">Bay of Bengal Radar</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">Signal 1 • Normal</div>
                  <span className="text-[10px] text-zinc-500">No storm warning current</span>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400">River Basin Water Levels</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">Flowing Below Danger</div>
                  <span className="text-[10px] text-zinc-500">Meghna & Jamuna clear</span>
                </div>
                <Building2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CIRCULARS */}
        {activeTab === 'circulars' && (
          <div className="space-y-2 text-xs">
            {[
              {
                title: language === 'bn' ? 'বাংলাদেশ ব্যাংক: ডিজিটাল ব্যাংক ফ্রেমওয়ার্ক সংক্রান্ত নতুন প্রজ্ঞাপন' : 'Bangladesh Bank: Updated Digital Banking Regulatory Gazette',
                dept: 'Central Bank Circular No. 14',
                time: '2 hours ago',
              },
              {
                title: language === 'bn' ? 'জাতীয় রাজস্ব বোর্ড (NBR): ই-চালান পেমেন্ট বাধ্যতামূলক নির্দেশিকা' : 'NBR: Mandatory e-Challan Integration Directive for Export EPZs',
                dept: 'National Board of Revenue',
                time: '5 hours ago',
              },
              {
                title: language === 'bn' ? 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ: এআই পলিসি ২০২৬ গেজেট প্রকাশ' : 'ICT Division: Bangladesh National AI Policy 2026 Gazette',
                dept: 'Ministry of Telecom & ICT',
                time: '1 day ago',
              },
            ].map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between hover:border-emerald-500/40 transition-all cursor-pointer">
                <div>
                  <div className="font-semibold text-zinc-200">{c.title}</div>
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2 mt-0.5">
                    <span>{c.dept}</span>
                    <span>•</span>
                    <span>{c.time}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: TRAFFIC */}
        {activeTab === 'traffic' && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Train className="h-3.5 w-3.5" /> Metro Line-6
                  </span>
                  <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-300">
                    24/7 Operational
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {language === 'bn'
                    ? 'উত্তরা উত্তর হতে মতিঝিল পর্যন্ত ট্রেন প্রতি ৪.৫ মিনিট পর পর চলাচল করছে।'
                    : 'Uttara North to Motijheel trains running smoothly at 4.5m headways.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Train className="h-3.5 w-3.5" /> Elevated Expressway
                  </span>
                  <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-300">
                    Clear Traffic
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {language === 'bn'
                    ? 'বিমানবন্দর থেকে ফার্মগেট অংশ ২০ মিনিটে যাতায়াত সম্ভব।'
                    : 'Airport to Farmgate ramp clear with average transit time under 18 mins.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-200">
                  {language === 'bn' ? '৪৬তম বিসিএস প্রিলিমিনারি ফল ও মৌখিক পরীক্ষার সময়সূচী' : '46th BCS Preliminary Result & Viva Voce Schedule'}
                </span>
                <p className="text-[10px] font-mono text-zinc-400">BPSC Official Notice • 3,140 Posts</p>
              </div>
              <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-300">
                Govt Job
              </Badge>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-200">
                  {language === 'bn' ? 'সফ্টওয়্যার ইঞ্জিনিয়ারিং ও এআই ডেভেলপমেন্ট নিয়োগ (১৫০+ পদ)' : 'Senior Full-Stack & AI Engineer Openings in Dhaka Tech Hubs'}
                </span>
                <p className="text-[10px] font-mono text-zinc-400">Pathao, bKash, ShopUp & Brain Station 23</p>
              </div>
              <Badge variant="outline" className="text-[9px] border-cyan-500/40 text-cyan-300">
                Tech Demand
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
