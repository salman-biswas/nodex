import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShieldAlert,
  Wind,
  Flame,
  Activity,
  Coins
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function ExecutiveTicker() {
  const { language } = useLanguage();

  const metrics = [
    {
      label: language === 'bn' ? 'ডিএসইএক্স সূচক' : 'DSEX Index',
      value: '5,842.10',
      change: '+0.85%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: language === 'bn' ? 'ডলার রেট (USD/BDT)' : 'USD / BDT',
      value: '৳119.85',
      change: 'Stable',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: language === 'bn' ? 'বৈদেশিক রিজার্ভ' : 'Forex Reserves',
      value: '$21.80 B',
      change: '+$2.4B',
      isPositive: true,
      icon: Activity,
    },
    {
      label: language === 'bn' ? 'ঢাকা বায়ুর মান (AQI)' : 'Dhaka AQI',
      value: '138 Moderate',
      change: '-12 pts',
      isPositive: true,
      icon: Wind,
    },
    {
      label: language === 'bn' ? 'স্বর্ণের দাম (২২ ক্যারেট)' : 'Gold (22K / bhori)',
      value: '৳1,18,400',
      change: '+0.4%',
      isPositive: true,
      icon: Coins,
    },
    {
      label: language === 'bn' ? 'কল মানি রেট' : 'Call Money Rate',
      value: '9.25%',
      change: 'Controlled',
      isPositive: true,
      icon: Flame,
    },
  ];

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800/80 px-4 py-1.5 overflow-x-auto scrollbar-none select-none">
      <div className="flex items-center gap-6 min-w-max text-[11px] font-mono">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="flex items-center gap-2 shrink-0 border-r border-zinc-800/80 pr-6 last:border-r-0">
              <span className="text-zinc-400">{m.label}:</span>
              <span className="font-bold text-zinc-100">{m.value}</span>
              <span
                className={`flex items-center gap-0.5 px-1 rounded text-[10px] font-semibold ${
                  m.isPositive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                <Icon className="h-3 w-3" />
                {m.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
