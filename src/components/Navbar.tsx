'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, ListChecks, Calendar, Maximize2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'planner' | 'calendar';
  setActiveTab: (tab: 'studio' | 'planner' | 'calendar') => void;
  onEnterFullscreen: () => void;
  onOpenCloudModal: () => void;
  isCloudConnected: boolean;
  deadlineTitle: string;
  daysRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onEnterFullscreen,
  onOpenCloudModal,
  isCloudConnected,
  deadlineTitle,
  daysRemaining,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            ⌘
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold tracking-tight text-white text-sm sm:text-base">
                KAIROS
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Countdown Lock Screen & Reverse-Planning Studio
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (3 Clean Tabs) */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'planner'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reminders & Sync</span>
          </button>
        </nav>

        {/* Right HUD info & Fullscreen Trigger */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenCloudModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
              isCloudConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Database & Storage Settings"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCloudConnected ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <span className="hidden sm:inline">
              {isCloudConnected ? 'MongoDB' : 'Storage / DB'}
            </span>
          </button>

          <button
            onClick={onEnterFullscreen}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition"
            title="Open Live Fullscreen Lock Screen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Live Lock Screen</span>
          </button>
        </div>
      </div>
    </header>
  );
};
