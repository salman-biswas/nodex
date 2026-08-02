import React from 'react';
import { Layers, Radio, TrendingUp, Sparkles, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'news' | 'analytics' | 'radar';
  onChangeTab: (tab: 'dashboard' | 'news' | 'analytics' | 'radar') => void;
  onOpenAiSearch: () => void;
}

export function MobileBottomNav({
  activeTab,
  onChangeTab,
  onOpenAiSearch,
}: MobileBottomNavProps) {
  const { language } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 px-2 pt-1.5 pb-safe shadow-2xl select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'dashboard'
              ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="AI Insights Dashboard Tab"
        >
          <Sparkles className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-mono mt-0.5 font-medium leading-tight">
            {language === 'bn' ? 'ইনসাইটস' : 'Insights'}
          </span>
        </button>

        <button
          onClick={() => onChangeTab('news')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'news'
              ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Feed Tab"
        >
          <Layers className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-mono mt-0.5 font-medium leading-tight">
            {language === 'bn' ? 'সংবাদ' : 'Feed'}
          </span>
        </button>

        {/* Center Ask AI Thumb-Friendly Button with Neon Glow */}
        <button
          onClick={onOpenAiSearch}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[52px] -mt-4 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-zinc-950 font-extrabold shadow-xl glow-emerald active:scale-90 transition-transform cursor-pointer border-2 border-zinc-950"
          aria-label="Ask AI Search"
        >
          <Sparkles className="h-5 w-5 text-zinc-950 fill-zinc-950" />
          <span className="text-[9px] font-extrabold tracking-tight text-zinc-950 uppercase leading-none mt-0.5">
            AI ASK
          </span>
        </button>

        <button
          onClick={() => onChangeTab('radar')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'radar'
              ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Radar Tab"
        >
          <Radio className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-mono mt-0.5 font-medium leading-tight">
            {language === 'bn' ? 'রাডার' : 'Radar'}
          </span>
        </button>

        <button
          onClick={() => onChangeTab('analytics')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'analytics'
              ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Markets Tab"
        >
          <TrendingUp className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-mono mt-0.5 font-medium leading-tight">
            {language === 'bn' ? 'বাজার' : 'Markets'}
          </span>
        </button>
      </div>
    </nav>
  );
}

