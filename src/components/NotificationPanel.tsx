import React from 'react';
import { Bell, CheckCheck, Zap, Sparkles, TrendingUp, ShieldAlert, X } from 'lucide-react';
import { NotificationItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClose: () => void;
  onNotificationClick: (item: NotificationItem) => void;
}

export function NotificationPanel({
  notifications,
  onMarkAllRead,
  onClose,
  onNotificationClick,
}: NotificationPanelProps) {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Intelligence Alerts
          </h3>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
            {notifications.filter((n) => !n.read).length} new
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="h-7 text-[11px] gap-1 px-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Read All
          </Button>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No notification alerts at this time.
          </div>
        ) : (
          notifications.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => onNotificationClick(item)}
                className={`group flex items-start gap-3 rounded-xl p-3 text-xs transition-all cursor-pointer border ${
                  !item.read
                    ? 'border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-500/40'
                    : 'border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.type === 'breaking' && (
                    <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'ai_insight' && (
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'market_alert' && (
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'system' && (
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
