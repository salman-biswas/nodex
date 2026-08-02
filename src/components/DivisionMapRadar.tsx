import React, { useState } from 'react';
import { MapPin, ShieldAlert, Radio, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export interface DivisionData {
  id: string;
  nameEn: string;
  nameBn: string;
  activeReports: number;
  status: 'normal' | 'alert' | 'critical';
  topTopicEn: string;
  topTopicBn: string;
  aqi?: number;
}

const DIVISIONS: DivisionData[] = [
  {
    id: 'dhaka',
    nameEn: 'Dhaka Division',
    nameBn: 'ঢাকা বিভাগ',
    activeReports: 18,
    status: 'normal',
    topTopicEn: 'Metro Line-6 24/7 & Central Bank Reserve Surge',
    topTopicBn: 'মেট্রোরেল ২৪/৭ ও সেন্ট্রাল ব্যাংক রিজার্ভ বৃদ্ধি',
    aqi: 138,
  },
  {
    id: 'chattogram',
    nameEn: 'Chattogram Division',
    nameBn: 'চট্টগ্রাম বিভাগ',
    activeReports: 12,
    status: 'normal',
    topTopicEn: 'Port Logistics Terminal Automated & Bay Terminal Draft',
    topTopicBn: 'বন্দর লজিস্টিকস ডিজিটালাইজেশন ও বে টার্মিনাল',
    aqi: 94,
  },
  {
    id: 'sylhet',
    nameEn: 'Sylhet Division',
    nameBn: 'সিলেট বিভাগ',
    activeReports: 7,
    status: 'normal',
    topTopicEn: 'Tech Parks Foreign Investment & Tea Export Surge',
    topTopicBn: 'হাইটেক পার্কে বৈদেশিক বিনিয়োগ ও চা রপ্তানি',
    aqi: 68,
  },
  {
    id: 'khulna',
    nameEn: 'Khulna Division',
    nameBn: 'খুলনা বিভাগ',
    activeReports: 5,
    status: 'alert',
    topTopicEn: 'Sundarbans Coastal Defense & Rampal Grid Stability',
    topTopicBn: 'সুন্দরবন উপকূলীয় প্রতিরক্ষা ও রামপাল গ্রিড',
    aqi: 112,
  },
  {
    id: 'rajshahi',
    nameEn: 'Rajshahi Division',
    nameBn: 'রাজশাহী বিভাগ',
    activeReports: 4,
    status: 'normal',
    topTopicEn: 'Solar Irrigation Grids & Mango Supply Cold Chains',
    topTopicBn: 'সৌর সেচ গ্রিড ও আম রপ্তানি কোল্ড চেইন',
    aqi: 105,
  },
  {
    id: 'rangpur',
    nameEn: 'Rangpur Division',
    nameBn: 'রংপুর বিভাগ',
    activeReports: 3,
    status: 'normal',
    topTopicEn: 'Teesta Barrage Smart Water Management Sensors',
    topTopicBn: 'তিস্তা ব্যারেজ স্মার্ট পানি ব্যবস্থাপনা সেন্সর',
    aqi: 88,
  },
  {
    id: 'barisal',
    nameEn: 'Barisal Division',
    nameBn: 'বরিশাল বিভাগ',
    activeReports: 4,
    status: 'normal',
    topTopicEn: 'Payra Deep Sea Port Channel Dredging Progress',
    topTopicBn: 'পায়রা গভীর সমুদ্র বন্দর চ্যানেল ড্রেজিং',
    aqi: 72,
  },
  {
    id: 'mymensingh',
    nameEn: 'Mymensingh Division',
    nameBn: 'ময়মনসিংহ বিভাগ',
    activeReports: 2,
    status: 'normal',
    topTopicEn: 'Agricultural AgriTech Biotech Innovation Center',
    topTopicBn: 'কৃষি বিশ্ববিদ্যালয় এগ্রিটেক ইনোভেশন',
    aqi: 98,
  },
];

interface DivisionMapRadarProps {
  onSelectDivision?: (divName: string) => void;
}

export function DivisionMapRadar({ onSelectDivision }: DivisionMapRadarProps) {
  const { language } = useLanguage();
  const [selectedDivId, setSelectedDivId] = useState<string>('dhaka');

  const selectedDiv = DIVISIONS.find((d) => d.id === selectedDivId) || DIVISIONS[0];

  return (
    <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-md rounded-xl overflow-hidden terminal-card">
      <CardHeader className="pb-2 pt-3.5 px-4 border-b border-zinc-800/80 bg-zinc-950/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Radio className="h-4 w-4 animate-pulse text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-xs font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              {language === 'bn' ? 'বাংলাদেশ বিভাগীয় ইনটেলিজেন্স রাডার' : 'Bangladesh Regional Radar'}
              <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                8 Divisions Live
              </Badge>
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* Division Selector Grid / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
          {DIVISIONS.map((div) => {
            const isSelected = div.id === selectedDivId;
            const isAlert = div.status === 'alert';

            return (
              <button
                key={div.id}
                onClick={() => {
                  setSelectedDivId(div.id);
                  if (onSelectDivision) onSelectDivision(div.nameEn);
                }}
                className={`flex items-center justify-between p-2.5 min-h-[44px] rounded-xl border text-left transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold shadow-xs'
                    : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span className="truncate text-[11px] font-medium">
                    {language === 'bn' ? div.nameBn : div.nameEn.replace(' Division', '')}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 font-semibold ${
                    isAlert
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {div.activeReports}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Division Deep Dive Box */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-400" />
                {language === 'bn' ? selectedDiv.nameBn : selectedDiv.nameEn}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono rounded ${
                  selectedDiv.status === 'alert'
                    ? 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                    : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                }`}
              >
                {selectedDiv.status === 'alert' ? 'Subtle Alert' : 'Situation Optimal'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
              {selectedDiv.aqi && (
                <span>
                  AQI: <strong className="text-zinc-200">{selectedDiv.aqi}</strong>
                </span>
              )}
              <span>
                Live Feed: <strong className="text-emerald-400">{selectedDiv.activeReports} reports</strong>
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2 pt-1">
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                {language === 'bn' ? 'শীর্ষ আলোচিত সংবাদ' : 'Primary Regional Signal'}
              </div>
              <p className="text-xs font-semibold text-zinc-100 mt-0.5">
                "{language === 'bn' ? selectedDiv.topTopicBn : selectedDiv.topTopicEn}"
              </p>
            </div>

            <button
              onClick={() => onSelectDivision && onSelectDivision(selectedDiv.nameEn)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25 transition-all shrink-0 cursor-pointer"
            >
              <span>{language === 'bn' ? 'সংবাদ দেখুন' : 'Filter Division'}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
