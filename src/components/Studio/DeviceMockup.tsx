'use client';

import React, { useState } from 'react';
import { Deadline, DeviceType, ThemeConfig, TimeRemaining, WidgetSettings } from '@/types';
import { Flashlight, Camera, Lock, Maximize2, Smartphone, Eye, Sparkles } from 'lucide-react';

interface DeviceMockupProps {
  deviceType: DeviceType;
  deadline: Deadline;
  theme: ThemeConfig;
  widgets: WidgetSettings;
  setWidgets?: (widgets: WidgetSettings) => void;
  timeRemaining: TimeRemaining;
  currentTimeStr: string;
  onEnterFullscreen: () => void;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  deviceType,
  deadline,
  theme,
  widgets,
  setWidgets,
  timeRemaining,
  currentTimeStr,
  onEnterFullscreen,
}) => {
  const [showChassis, setShowChassis] = useState<boolean>(true);

  const briefing = deadline.briefing || {
    userName: 'Alex',
    greetingPrefix: 'Good morning',
    weather: {
      temperature: '72°',
      condition: 'partly cloudy',
      location: 'Greenpoint, Brooklyn',
      forecastNote: 'Light rain likely after 6PM, bring an umbrella',
    },
    events: [
      { id: 'ev-1', time: '9:30 AM', title: 'Team standup' },
      { id: 'ev-2', time: '1:00 PM', title: 'Lunch with Priya' },
      { id: 'ev-3', time: '4:00 PM', title: 'Dentist (20 min drive)' },
    ],
    tasks: [
      { id: 'tk-1', title: 'Send report', completed: false },
      { id: 'tk-2', title: 'Renew car registration', completed: false },
    ],
  };

  const targetDateObj = new Date(deadline.targetDate);
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Custom wallpaper background style
  const bgStyle: React.CSSProperties =
    theme.id === 'custom' && theme.customImageUri
      ? {
          backgroundImage: `url(${theme.customImageUri})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: theme.imageBlur ? `blur(${theme.imageBlur}px)` : undefined,
        }
      : theme.id === 'citron-mint'
      ? {
          background: 'linear-gradient(135deg, #cff674 0%, #9cf1a5 38%, #7bf0d5 72%, #6ee7b7 100%)',
        }
      : theme.id === 'sunset-peach'
      ? {
          background: 'linear-gradient(135deg, #fda4af 0%, #fcd34d 50%, #f43f5e 100%)',
        }
      : theme.id === 'nordic-paper'
      ? {
          background: 'linear-gradient(180deg, #f8f6f0 0%, #e9e4d8 100%)',
        }
      : theme.id === 'deep-indigo'
      ? {
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #171131 100%)',
        }
      : theme.id === 'aura'
      ? {
          background: `radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.4) 0%, rgba(13, 7, 28, 0) 70%), radial-gradient(circle at 20% 70%, rgba(245, 158, 11, 0.25) 0%, rgba(13, 7, 28, 0) 60%), ${theme.bgPrimary}`,
        }
      : {
          background: `linear-gradient(to bottom, ${theme.bgPrimary}, ${theme.bgSecondary})`,
        };

  // If desktop layout
  if (deviceType === 'desktop') {
    return (
      <div className="w-full flex flex-col items-center">
        {/* View Controls Toolbar */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-1 text-xs">
          <span className="font-mono text-zinc-400">
            DESKTOP // 16:9 MONITOR DISPLAY
          </span>
          <button
            onClick={onEnterFullscreen}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Fullscreen Mode</span>
          </button>
        </div>

        <div className="relative mx-auto w-full max-w-4xl aspect-[16/10] rounded-2xl p-4 bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col justify-between">
          {/* Screen Content */}
          <div
            className="relative w-full h-full rounded-xl overflow-hidden p-8 flex flex-col justify-center items-center select-none shadow-inner"
            style={bgStyle}
          >
            {theme.grain && (
              <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
            )}

            {/* Morning Briefing Card (Desktop Format) */}
            <div
              className="relative z-10 w-full max-w-2xl p-8 rounded-3xl shadow-2xl transition-all"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                backdropFilter: 'blur(24px)',
                color: theme.textColor,
              }}
            >
              <div className="text-xs font-medium text-slate-500 mb-1">
                {todayFormatted}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {briefing.greetingPrefix || 'Good morning'}, {briefing.userName || 'Alex'}
              </h2>

              <div className="mt-2 text-xs">
                <span className="font-semibold">
                  ☁  {briefing.weather.temperature}, {briefing.weather.condition} {briefing.weather.location}
                </span>
                <p className="text-slate-500 mt-0.5">{briefing.weather.forecastNote}</p>
              </div>

              <div className="my-4 border-b border-black/10 dark:border-white/10" />

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold mb-2">🗓  {briefing.events.length} events today</div>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    {briefing.events.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="truncate">
                        {ev.time} — {ev.title}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-bold mb-2">📋  {briefing.tasks.length} tasks due today</div>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    {briefing.tasks.slice(0, 3).map((tk) => (
                      <div key={tk.id} className="truncate">
                        {tk.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="my-4 border-b border-black/10 dark:border-white/10" />

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  🎯 TARGET: {deadline.title.toUpperCase()}
                </span>
                <span className="font-bold">
                  {timeRemaining.days}d {timeRemaining.hours}h left
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.max(5, timeRemaining.formattedPercentage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Monitor Base */}
          <div className="w-32 h-3 bg-zinc-800 mx-auto mt-2 rounded-b-md" />
        </div>
      </div>
    );
  }

  // Mobile Device Mockup (iPhone 16 Pro / Pixel 9)
  const isIphone = deviceType === 'iphone16';

  return (
    <div className="w-full flex flex-col items-center">
      {/* View Mode Controls Toolbar */}
      <div className="w-full max-w-[360px] flex items-center justify-between mb-2 text-xs">
        <button
          onClick={() => setShowChassis(!showChassis)}
          className="flex items-center space-x-1 text-zinc-400 hover:text-white transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{showChassis ? 'Hide Phone Frame' : 'Show Phone Frame'}</span>
        </button>

        <span className="font-mono text-[11px] text-zinc-500">
          {isIphone ? 'Apple iOS 18' : 'Android'}
        </span>
      </div>

      {/* Phone Body */}
      <div
        className={`relative transition-all duration-300 ${
          showChassis
            ? 'w-[330px] sm:w-[360px] h-[700px] rounded-[50px] p-[10px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl border-4 border-zinc-900/90'
            : 'w-[330px] sm:w-[360px] h-[700px] rounded-[32px] p-0 shadow-2xl border border-zinc-800'
        }`}
      >
        {/* Inner Screen */}
        <div
          className={`relative w-full h-full ${
            showChassis ? 'rounded-[40px]' : 'rounded-[32px]'
          } overflow-hidden flex flex-col justify-between select-none shadow-inner`}
          style={bgStyle}
        >
          {/* Custom Dim Overlay */}
          {theme.id === 'custom' && theme.imageDim && (
            <div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: theme.imageDim / 100 }}
            />
          )}

          {/* Film Grain Texture */}
          {theme.grain && (
            <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
          )}

          {/* Hardware Cutout: Dynamic Island or Punch Hole */}
          {showChassis && widgets.showDeviceDecorations && (
            <div className="relative z-30 pt-3 flex justify-center">
              {isIphone ? (
                <div className="w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 shadow-md border border-zinc-800/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                  </div>
                  <Lock className="w-2.5 h-2.5 text-zinc-500" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 bg-black rounded-full border border-zinc-800 shadow" />
              )}
            </div>
          )}

          {/* Top Lock Screen Header / Safe-Zone */}
          <div className="relative z-20 pt-4 px-6 text-center">
            {widgets.displayMode === 'standalone_hud' || widgets.showClock ? (
              <>
                <p
                  className="text-xs font-semibold tracking-wider drop-shadow"
                  style={{ color: theme.isLightCard ? 'rgba(15, 23, 42, 0.7)' : theme.subtextColor }}
                >
                  {todayFormatted}
                </p>

                <h1
                  className="text-6xl sm:text-7xl font-bold tracking-tight mt-1 tabular-nums drop-shadow-md"
                  style={{
                    color: theme.isLightCard ? '#0f172a' : theme.textColor,
                  }}
                >
                  {currentTimeStr}
                </h1>
              </>
            ) : (
              <div className="py-4 px-3 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/20 text-center">
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">
                  Native Phone Clock Area
                </span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">
                  (Safe zone for iPhone / Android Lock Screen)
                </span>
              </div>
            )}
          </div>

          {/* Center: The Morning Briefing Porcelain Glass Card */}
          <div className="relative z-20 px-3.5 my-auto">
            <div
              className="rounded-[32px] p-5 shadow-2xl transition-all"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                backdropFilter: 'blur(24px)',
                color: theme.textColor,
              }}
            >
              {/* Date */}
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {todayFormatted}
              </div>

              {/* Greeting */}
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                {briefing.greetingPrefix || 'Good morning'}, {briefing.userName || 'Alex'}
              </h2>

              {/* Weather row */}
              {widgets.showWeather !== false && (
                <div className="mt-2 text-xs">
                  <div className="font-semibold flex items-center space-x-1">
                    <span>☁</span>
                    <span>
                      {briefing.weather.temperature}, {briefing.weather.condition} {briefing.weather.location}
                    </span>
                  </div>
                  {briefing.weather.forecastNote && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {briefing.weather.forecastNote}
                    </p>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="my-3 border-b border-black/10 dark:border-white/10" />

              {/* Dual Column Life Grid */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {/* Events Column */}
                <div>
                  <div className="font-bold flex items-center space-x-1 mb-1.5">
                    <span>🗓</span>
                    <span>{briefing.events.length} events today</span>
                  </div>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[10px]">
                    {briefing.events.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="truncate">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{ev.time}</span> — {ev.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks Column */}
                <div>
                  <div className="font-bold flex items-center space-x-1 mb-1.5">
                    <span>📋</span>
                    <span>{briefing.tasks.length} tasks due today</span>
                  </div>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[10px]">
                    {briefing.tasks.slice(0, 3).map((tk) => (
                      <div key={tk.id} className="truncate flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span className={tk.completed ? 'line-through text-slate-400' : ''}>
                          {tk.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 border-b border-black/10 dark:border-white/10" />

              {/* Target Deadline Footer */}
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className="font-bold tracking-tight uppercase"
                    style={{ color: theme.accentColor }}
                  >
                    🎯 TARGET: {deadline.title}
                  </span>
                  <span className="font-bold tabular-nums">
                    {timeRemaining.days}d {timeRemaining.hours}h left
                  </span>
                </div>

                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(4, timeRemaining.formattedPercentage)}%`,
                      backgroundColor: theme.accentColor,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: Lock Screen Actions */}
          <div className="relative z-20 pb-6 px-8 flex flex-col items-center">
            {widgets.showMantra && deadline.mantra && (
              <p
                className="text-xs text-center italic mb-3 max-w-[260px] line-clamp-1 drop-shadow"
                style={{ color: theme.isLightCard ? 'rgba(15, 23, 42, 0.7)' : theme.subtextColor }}
              >
                "{deadline.mantra}"
              </p>
            )}

            {/* iOS Action Buttons */}
            {showChassis && widgets.showDeviceDecorations && (
              <div className="w-full flex items-center justify-between px-2">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 shadow">
                  <Flashlight className="w-4 h-4" />
                </div>
                <div className="w-24 h-1 bg-white/40 rounded-full" />
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 shadow">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
