import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Clock,
  Wind,
  DollarSign,
  FileText,
  Briefcase,
  Layers,
  ChevronRight,
  Globe,
  Radio,
  BarChart2,
  Users,
  MapPin,
  Tag,
  Award,
  Zap,
  Activity,
  CheckCircle2,
  Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { NewsItem, TrendingTopic } from '../types';
import { MOCK_NEWS } from '../data/mockNews';

interface AiInsightsDashboardProps {
  newsItems: NewsItem[];
  onSelectNews: (id: string) => void;
  onSelectCategory?: (category: string) => void;
}

export function AiInsightsDashboard({
  newsItems,
  onSelectNews,
  onSelectCategory
}: AiInsightsDashboardProps) {
  const { language } = useLanguage();
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  const itemsList = newsItems && newsItems.length > 0 ? newsItems : MOCK_NEWS;

  // Top 10 Ranked Important News by Impact Score
  const top10News = [...itemsList]
    .sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))
    .slice(0, 10);

  // Category Highlights Filtering
  const politicalHighlight = itemsList.find((n) => n.category === 'governance') || itemsList[0] || MOCK_NEWS[0];
  const economicHighlight = itemsList.find((n) => n.category === 'economy') || itemsList[1] || MOCK_NEWS[1];
  const techHighlight = itemsList.find((n) => n.category === 'technology') || itemsList[2] || MOCK_NEWS[2];
  const tradeHighlight = itemsList.find((n) => n.category === 'trade') || itemsList[3] || MOCK_NEWS[3];
  const climateHighlight = itemsList.find((n) => n.category === 'climate') || itemsList[4] || MOCK_NEWS[4];

  // Timeline Mock Data for Today
  const todayTimeline = [
    {
      time: '08:30 AM',
      category: 'Economy',
      title: language === 'bn' ? 'বাংলাদেশ ব্যাংকের বৈদেশিক মুদ্রা রিজার্ভ ২১.৮ বিলিয়ন ডলারে পৌঁছাল' : 'Bangladesh Bank Forex Reserves Surge to $21.8B',
      impact: 'High',
    },
    {
      time: '10:15 AM',
      category: 'Transit',
      title: language === 'bn' ? 'ঢাকায় মেট্রোরেল লাইন-৬ নিরবচ্ছিন্নভাবে চালু' : 'Dhaka Metro Rail Line-6 Headways Optimized to 4.5 Mins',
      impact: 'Medium',
    },
    {
      time: '01:00 PM',
      category: 'Policy',
      title: language === 'bn' ? 'এনবিআর-এর ই-চালান পেমেন্ট বাধ্যতামূলক নির্দেশিকা গেজেট প্রকাশ' : 'NBR Mandatory e-Challan Integration Directive Published',
      impact: 'High',
    },
    {
      time: '03:45 PM',
      category: 'Tech & AI',
      title: language === 'bn' ? 'বাংলাদেশ জাতীয় এআই পলিসি ২০২৬ আনুষ্ঠানিক উদ্বোধন' : 'National AI Policy 2026 Unveiled for Tech Ecosystem',
      impact: 'Strategic',
    },
    {
      time: '06:20 PM',
      category: 'Trade',
      title: language === 'bn' ? 'আরএমজি রপ্তানি প্রবৃদ্ধি ৪.১ বিলিয়ন ডলারে পৌঁছানোর ঘোষণা' : 'RMG Export Revenue Touches $4.1B for Q2 Cycle',
      impact: 'High',
    },
    {
      time: '08:15 PM',
      category: 'Sports',
      title: language === 'bn' ? 'বাংলাদেশ জাতীয় ক্রিকেট দল আন্তর্জাতিক সিরিজের উদ্বোধনী প্রস্তুতি সম্পন্ন করল' : 'BD National Cricket Squad Completes Final Net Practice',
      impact: 'General',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. AI DAILY BRIEF & HERO SYNTHESIS */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/40 p-4 sm:p-6 shadow-2xl glow-emerald">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest">
                Executive Synthesis
              </Badge>
              <span className="text-[11px] font-mono text-zinc-400">Live</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-zinc-100 tracking-tight">
              {language === 'bn'
                ? 'বাংলাদেশের দৈনন্দিন সামগ্রিক পর্যবেক্ষণ ও সারসংক্ষেপ'
                : 'Bangladesh Daily Macro Synthesis & Key Insights'}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <div className="text-left">
                <div className="text-[9px] font-mono text-zinc-500 uppercase">Macro Outlook</div>
                <div className="text-xs font-mono font-bold text-cyan-400">Stable Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Bullet Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {language === 'bn' ? 'অর্থনীতি ও মুদ্রাবাজার' : 'Forex & Banking Growth'}
              </span>
              <span className="text-[10px] font-mono text-emerald-500">+1.2%</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {language === 'bn'
                ? 'বৈদেশিক মুদ্রার রিজার্ভ ২১.৮ বিলিয়ন ডলারে পৌঁছায় আমদানি দায় পরিশোধ ঝুঁকি হ্রাস পেয়েছে।'
                : 'Forex reserves reached $21.8B while USD exchange rate stabilized around ৳119.85, boosting bank liquidity.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                {language === 'bn' ? 'পোশাক ও টেক্সটাইল রপ্তানি' : 'RMG Export Momentum'}
              </span>
              <span className="text-[10px] font-mono text-cyan-500">$4.1B Q2</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {language === 'bn'
                ? 'ইউরোপীয় ইউনিয়নে বাংলাদেশ সবুজ পোশাক শিল্প ও পরিবেশবান্ধব উৎপাদনের নতুন মাইলফলক অর্জন করেছে।'
                : 'Bangladesh RMG shipments to EU & US hubs surged, supported by eco-green factory certifications.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                {language === 'bn' ? 'জাতীয় এআই ও ডিজিটাল পলিসি' : 'National AI Policy 2026'}
              </span>
              <span className="text-[10px] font-mono text-amber-500">Active</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {language === 'bn'
                ? 'আইসিটি বিভাগ কর্তৃক নতুন এআই নীতিমালা ও ডিজিটাল ব্যাংকিং ফ্রেমওয়ার্ক অনুমোদিত হয়েছে।'
                : 'Government approved National AI Policy 2026 framework to foster AI R&D and local tech startups.'}
            </p>
          </div>
        </div>
      </div>

      {/* TOP 10 RANKED IMPORTANT NEWS BY IMPACT SCORE */}
      <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-xl rounded-2xl overflow-hidden terminal-card">
        <CardHeader className="p-4 border-b border-zinc-800/80 bg-zinc-950/60 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold tracking-tight text-zinc-100">
                {language === 'bn' ? 'আজকের শীর্ষ ১০ গুরুত্বপূর্ণ সংবাদ' : 'Top 10 Important News (Ranked by Impact)'}
              </CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400">
            Top 10
          </Badge>
        </CardHeader>

        <CardContent className="p-2 sm:p-4 divide-y divide-zinc-800/60">
          {top10News.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectNews(item.id)}
              className="group p-3 hover:bg-zinc-800/40 transition-all cursor-pointer rounded-xl flex items-start gap-3 active:scale-[0.99]"
            >
              {/* Rank Badge */}
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold border ${
                idx === 0
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : idx === 1
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  : idx === 2
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}>
                #{idx + 1}
              </div>

              {/* News Body */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <span className="text-emerald-400 font-semibold">{item.source?.name || 'News Stream'}</span>
                  <span>•</span>
                  <span>{item.publishedAt}</span>
                  <Badge variant="outline" className="px-1.5 py-0 text-[9px] border-zinc-700 text-zinc-300 uppercase">
                    {item.category}
                  </Badge>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                {/* Instant AI Key Takeaway */}
                {item.keyTakeaways?.[0] && (
                  <p className="text-[11px] text-zinc-400 line-clamp-1 bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-800/60 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.keyTakeaways[0]}</span>
                  </p>
                )}
              </div>

              {/* Impact Pill */}
              <div className="flex flex-col items-end shrink-0 pl-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Impact</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{item.impactScore}/10</span>
                <ArrowUpRight className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400 transition-colors mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. TIMELINE OF TODAY'S MAJOR EVENTS */}
      <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-xl rounded-2xl overflow-hidden terminal-card">
        <CardHeader className="p-4 border-b border-zinc-800/80 bg-zinc-950/60 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold tracking-tight text-zinc-100">
                {language === 'bn' ? 'আজকের প্রধান ঘটনাবলীর সময়রেখা' : "Timeline of Today's Major Events"}
              </CardTitle>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {language === 'bn' ? 'ঘন্টাভিত্তিক রিয়েল-টাইম সংবাদ প্রবাহ' : 'Hourly chronological intelligence feed across Bangladesh'}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="relative border-l-2 border-emerald-500/30 ml-3 space-y-4">
            {todayTimeline.map((item, i) => (
              <div key={i} className="relative pl-6 group">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-zinc-950 border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors" />

                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-emerald-400">{item.time}</span>
                    <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-300">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. AI SENTIMENT ANALYSIS & MOST DISCUSSED ENTITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Sentiment Distribution Analysis */}
        <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-xl rounded-2xl overflow-hidden terminal-card">
          <CardHeader className="p-4 border-b border-zinc-800/80 bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-zinc-100">
                {language === 'bn' ? 'এআই সেন্টিমেন্ট ও সংবাদ ধরণ বিশ্লেষণ' : 'AI Sentiment Analysis'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">Positive Growth & Reserves (38%)</span>
                  <span className="text-zinc-400">14 Reports</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[38%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">Neutral & Governance Policies (38%)</span>
                  <span className="text-zinc-400">14 Reports</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-[38%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">Critical / Urgent Monitoring (24%)</span>
                  <span className="text-zinc-400">9 Reports</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[24%]" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
              {language === 'bn'
                ? 'সংবাদ বিশ্লেষণ অনুসারে আজকের সংবাদের ৩৮% ইতিবাচক প্রবৃদ্ধি সম্পর্কিত, ৩৮% নীতি ও তদারকি নির্দেশিকা এবং ২৪% জরুরি তদারকি নির্দেশ করে।'
                : 'Sentiment Engine classified 38% positive economic momentum, 38% neutral regulatory gazettes, and 24% inflation sensitivity.'}
            </p>
          </CardContent>
        </Card>

        {/* Most Discussed Entities (People, Organizations, Locations) */}
        <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-xl rounded-2xl overflow-hidden terminal-card">
          <CardHeader className="p-4 border-b border-zinc-800/80 bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-zinc-100">
                {language === 'bn' ? 'সর্বাধিক আলোচিত সত্তাসমূহ (Entities)' : 'Most Discussed Entities'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {/* People */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <Users className="h-3 w-3 text-emerald-400" /> Most Discussed People
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Dr. Ahsan H. Mansur', 'Dr. Muhammad Yunus', 'Ahsan Khan Chowdhury', 'Nazmul Hassan'].map((p, i) => (
                  <Badge key={i} variant="outline" className="border-zinc-700 bg-zinc-950 text-zinc-200">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Organizations */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <Building2 className="h-3 w-3 text-cyan-400" /> Key Organizations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Bangladesh Bank', 'NBR', 'DMTCL (Metro)', 'BGMEA', 'BPSC', 'EPB'].map((org, i) => (
                  <Badge key={i} variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                    {org}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <MapPin className="h-3 w-3 text-amber-400" /> Key Locations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Dhaka', 'Chattogram Port', 'Sylhet', 'Cox\'s Bazar', 'Payra Port'].map((loc, i) => (
                  <Badge key={i} variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300">
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <Tag className="h-3 w-3 text-emerald-400" /> Popular Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['#ForexReserves', '#Metro247', '#RMGExport', '#AIPolicy2026', '#46thBCS'].map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
