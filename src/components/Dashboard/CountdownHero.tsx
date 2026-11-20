'use client';

import React from 'react';
import { Deadline, TimeRemaining } from '@/types';
import { Maximize2, Download, Calendar, FolderPlus, Clock, Target, CheckCircle } from 'lucide-react';

interface CountdownHeroProps {
  deadline: Deadline;
  timeRemaining: TimeRemaining;
  onEnterFullscreen: () => void;
  onGoToStudio: () => void;
  onGoToCalendar: () => void;
  onCreateNewDeadline: () => void;
  allDeadlines: Deadline[];
  onSelectDeadline: (id: string) => void;
}

export const CountdownHero: React.FC<CountdownHeroProps> = ({
  deadline,
  timeRemaining,
  onEnterFullscreen,
  onGoToStudio,
  onGoToCalendar,
  onCreateNewDeadline,
  allDeadlines,
  onSelectDeadline,
}) => {
  const completedCount = deadline.milestones.filter((m) => m.completed).length;
  const totalMilestones = deadline.milestones.length;
  const milestoneProgress =
    totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  const targetDateObj = new Date(deadline.targetDate);
  const formattedDate = targetDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950/80 border border-zinc-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Background Subtle Gradient Aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {deadline.briefing
                ? `${deadline.briefing.greetingPrefix || 'Good morning'}, ${deadline.briefing.userName || 'Alex'}`
                : deadline.category}
            </span>
            {deadline.briefing && (
              <span className="text-xs text-zinc-400 font-medium">
                ☁ {deadline.briefing.weather.temperature}, {deadline.briefing.weather.condition} • {deadline.briefing.events.length} events, {deadline.briefing.tasks.length} tasks today
              </span>
            )}
            <span className="text-xs text-zinc-500 font-mono">
              Due: {formattedDate}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {deadline.title}
            </h1>
          </div>

          {deadline.mantra && (
            <p className="text-xs text-zinc-400 italic">
              "{deadline.mantra}"
            </p>
          )}
        </div>

        {/* Quick Actions & Deadline Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {allDeadlines.length > 1 && (
            <select
              value={deadline.id}
              onChange={(e) => onSelectDeadline(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white outline-none cursor-pointer hover:border-zinc-600 transition"
            >
              {allDeadlines.map((dl) => (
                <option key={dl.id} value={dl.id} className="bg-zinc-900">
                  {dl.title.length > 22 ? dl.title.slice(0, 20) + '...' : dl.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onCreateNewDeadline}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition"
            title="Create a new goal"
          >
            <FolderPlus className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">New Goal</span>
          </button>

          <button
            onClick={onEnterFullscreen}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition shadow-lg"
            title="Launch Fullscreen Lock Screen Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Launch Live HUD</span>
          </button>
        </div>
      </div>

      {/* Main Countdown Telemetry Grid */}
      <div className="relative z-10 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'DAYS REMAINING', val: timeRemaining.days },
            { label: 'HOURS', val: timeRemaining.hours },
            { label: 'MINUTES', val: timeRemaining.minutes },
            { label: 'SECONDS', val: timeRemaining.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center justify-center backdrop-blur-sm"
            >
              <span className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-sm">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-zinc-500 uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress & Pacing Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-zinc-400">TIMELINE PACING</span>
              <span className="text-emerald-400 font-bold">
                {timeRemaining.formattedPercentage}% Elapsed
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(4, timeRemaining.formattedPercentage)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-zinc-400">MILESTONE EXECUTION</span>
              <span className="text-cyan-400 font-bold">
                {completedCount} of {totalMilestones} Completed ({milestoneProgress}%)
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(4, milestoneProgress)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
