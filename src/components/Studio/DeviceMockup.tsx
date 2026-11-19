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

  const targetDateObj = new Date(deadline.targetDate);
  const dateFormatted = targetDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const nextMilestone =
    deadline.milestones.find((m) => !m.completed) || deadline.milestones[0];

  // Custom wallpaper background style
  const bgStyle: React.CSSProperties =
    theme.id === 'custom' && theme.customImageUri
      ? {
          backgroundImage: `url(${theme.customImageUri})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: theme.imageBlur ? `blur(${theme.imageBlur}px)` : undefined,
        }
      : theme.id === 'aura'
      ? {
          background: `radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.4) 0%, rgba(13, 7, 28, 0) 70%), radial-gradient(circle at 20% 70%, rgba(245, 158, 11, 0.25) 0%, rgba(13, 7, 28, 0) 60%), ${theme.bgPrimary}`,
        }
      : theme.id === 'terminal'
      ? {
          background: `linear-gradient(to bottom, ${theme.bgPrimary}, ${theme.bgSecondary})`,
        }
      : theme.id === 'bauhaus'
      ? {
          background: `radial-gradient(circle at 85% 20%, rgba(239, 68, 68, 0.2) 0%, transparent 50%), ${theme.bgPrimary}`,
        }
      : {
          background: `linear-gradient(to bottom, ${theme.bgPrimary}, ${theme.bgSecondary})`,
        };

  const handleCycleFormat = () => {
    if (!setWidgets) return;
    const formats: Array<'dhms' | 'compact' | 'days_only'> = ['dhms', 'compact', 'days_only'];
    const nextIdx = (formats.indexOf(widgets.countdownFormat) + 1) % formats.length;
    setWidgets({
      ...widgets,
      countdownFormat: formats[nextIdx],
    });
  };

  // If desktop layout
  if (deviceType === 'desktop') {
    return (
      <div className="w-full flex flex-col items-center">
        {/* View Controls Toolbar */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-1 text-xs">
          <span className="font-mono text-zinc-400">
            DESKTOP // 16:9 MONITOR HUD
          </span>
          <button
            onClick={onEnterFullscreen}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Fullscreen Lock Screen</span>
          </button>
        </div>

        <div className="relative mx-auto w-full max-w-4xl aspect-[16/10] rounded-2xl p-4 bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col justify-between">
          {/* Screen Content */}
          <div
            className="relative w-full h-full rounded-xl overflow-hidden p-8 flex flex-col justify-between select-none"
            style={bgStyle}
          >
            {theme.grain && (
              <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
            )}

            {/* Top Bar */}
            <div className="relative z-10 flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>KAIROS // MONITOR DISPLAY</span>
              <div className="flex items-center space-x-4">
                <span>{dateFormatted.toUpperCase()}</span>
                <span className="text-white font-bold">{currentTimeStr}</span>
              </div>
            </div>

            {/* Center Hub */}
            <div className="relative z-10 max-w-2xl mx-auto w-full p-8 rounded-2xl glass-panel text-center">
              <span
                className="text-xs font-mono font-bold tracking-widest uppercase"
                style={{ color: theme.accentColor }}
              >
                // TARGET DEADLINE · {deadline.category}
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight"
                style={{ color: theme.textColor }}
              >
                {deadline.title}
              </h2>

              {/* Countdown Grid */}
              <div
                onClick={handleCycleFormat}
                className="grid grid-cols-4 gap-4 mt-6 cursor-pointer"
                title="Click to change countdown format"
              >
                {[
                  { label: 'DAYS', val: timeRemaining.days },
                  { label: 'HOURS', val: timeRemaining.hours },
                  { label: 'MINUTES', val: timeRemaining.minutes },
                  { label: 'SECONDS', val: timeRemaining.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center hover:bg-black/60 transition"
                  >
                    <span
                      className="text-3xl sm:text-4xl font-mono font-bold tabular-nums"
                      style={{ color: theme.textColor }}
                    >
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              {widgets.showProgressRing && (
                <div className="w-full bg-zinc-800/80 rounded-full h-2 mt-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(5, timeRemaining.formattedPercentage)}%`,
                      backgroundColor: theme.accentColor,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 flex justify-between items-center text-xs">
              {widgets.showMilestone && nextMilestone && (
                <div className="flex items-center space-x-2">
                  <span
                    className="px-2 py-0.5 rounded font-mono text-[10px] font-bold"
                    style={{
                      backgroundColor: `${theme.accentColor}25`,
                      color: theme.accentColor,
                    }}
                  >
                    {nextMilestone.pacingLabel}
                  </span>
                  <span className="text-zinc-300 font-medium">
                    {nextMilestone.title}
                  </span>
                </div>
              )}

              {widgets.showMantra && deadline.mantra && (
                <span className="text-zinc-400 italic">
                  "{deadline.mantra}"
                </span>
              )}
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
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition text-[11px]"
        >
          <Smartphone className="w-3 h-3 text-zinc-400" />
          <span>{showChassis ? 'View Frameless Canvas' : 'Show Phone Bezel'}</span>
        </button>

        <button
          onClick={onEnterFullscreen}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition text-[11px] font-medium"
          title="Turn your current screen into a live lock screen"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Live Fullscreen</span>
        </button>
      </div>

      {/* Screen Frame Container */}
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
            <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
          )}

          {/* Hardware Cutout: Dynamic Island or Punch Hole (Only if chassis is active) */}
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
                  className="text-xs font-semibold tracking-wider uppercase drop-shadow"
                  style={{ color: theme.subtextColor }}
                >
                  {dateFormatted}
                </p>

                <h1
                  className="text-6xl sm:text-7xl font-bold tracking-tight mt-1 tabular-nums drop-shadow-md"
                  style={{
                    color: theme.textColor,
                    fontFamily:
                      theme.fontFamily === 'mono'
                        ? 'monospace'
                        : 'Inter, system-ui, sans-serif',
                  }}
                >
                  {currentTimeStr}
                </h1>
              </>
            ) : (
              <div className="py-5 px-3 rounded-2xl border border-dashed border-white/10 bg-black/20 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  Native Phone Clock Area
                </span>
                <span className="text-[9px] text-zinc-600 block mt-0.5">
                  (Safe zone for iOS / Android Lock Screen)
                </span>
              </div>
            )}
          </div>

          {/* Center Main Countdown Widget Card */}
          <div
            className={`relative z-20 px-4 transition-all ${
              widgets.verticalPosition === 'lower_third'
                ? 'mt-auto mb-6'
                : 'my-auto'
            }`}
          >
            <div
              className="rounded-3xl p-5 shadow-xl transition-all"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                borderWidth: '1px',
                borderStyle: 'solid',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Category & Project Title */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${theme.accentColor}25`,
                    color: theme.accentColor,
                  }}
                >
                  {deadline.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  T-{timeRemaining.days}D LEFT
                </span>
              </div>

              <h3
                className="text-base font-bold mt-2 truncate"
                style={{ color: theme.textColor }}
              >
                {deadline.title}
              </h3>

              {/* Countdown Numbers (Click to Cycle Format) */}
              {widgets.showCountdown && (
                <div
                  onClick={handleCycleFormat}
                  className="mt-4 cursor-pointer"
                  title="Click to cycle countdown format"
                >
                  {timeRemaining.isExpired ? (
                    <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-center">
                      <span className="text-sm font-mono font-bold text-amber-300">
                        ⚡ TARGET REACHED // FINISHED
                      </span>
                    </div>
                  ) : widgets.countdownFormat === 'days_only' ? (
                    <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center hover:bg-black/40 transition">
                      <span
                        className="text-4xl sm:text-5xl font-mono font-bold tabular-nums"
                        style={{ color: theme.textColor }}
                      >
                        {timeRemaining.days}
                      </span>
                      <span
                        className="text-xs font-mono tracking-widest uppercase mt-1"
                        style={{ color: theme.subtextColor }}
                      >
                        DAYS REMAINING
                      </span>
                    </div>
                  ) : widgets.countdownFormat === 'compact' ? (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-around font-mono text-sm font-bold hover:bg-black/40 transition">
                      <span style={{ color: theme.textColor }}>
                        {String(timeRemaining.days).padStart(2, '0')}d
                      </span>
                      <span className="text-zinc-600">:</span>
                      <span style={{ color: theme.textColor }}>
                        {String(timeRemaining.hours).padStart(2, '0')}h
                      </span>
                      <span className="text-zinc-600">:</span>
                      <span style={{ color: theme.textColor }}>
                        {String(timeRemaining.minutes).padStart(2, '0')}m
                      </span>
                      <span className="text-zinc-600">:</span>
                      <span style={{ color: theme.accentColor }}>
                        {String(timeRemaining.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'DAYS', val: timeRemaining.days },
                        { label: 'HRS', val: timeRemaining.hours },
                        { label: 'MIN', val: timeRemaining.minutes },
                        { label: 'SEC', val: timeRemaining.seconds },
                      ].map((unit, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center hover:bg-black/40 transition"
                        >
                          <span
                            className="text-xl sm:text-2xl font-mono font-bold tabular-nums"
                            style={{ color: theme.textColor }}
                          >
                            {String(unit.val).padStart(2, '0')}
                          </span>
                          <span
                            className="text-[9px] font-mono font-medium tracking-wider"
                            style={{ color: theme.subtextColor }}
                          >
                            {unit.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Visual Deadline Progress Bar */}
              {widgets.showProgressRing && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>PROGRESS PACE</span>
                    <span className="font-bold" style={{ color: theme.accentColor }}>
                      {timeRemaining.formattedPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(4, timeRemaining.formattedPercentage)}%`,
                        backgroundColor: theme.accentColor,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Active Milestone Card */}
            {widgets.showMilestone && nextMilestone && (
              <div
                className="mt-3 rounded-2xl p-3.5 shadow-lg flex items-center space-x-3 transition-all"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div
                  className="w-2 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="text-[9px] font-mono font-bold tracking-tight uppercase"
                      style={{ color: theme.accentColor }}
                    >
                      {nextMilestone.pacingLabel}
                    </span>
                    <span className="text-[9px] text-zinc-400">· NEXT SPRINT</span>
                  </div>
                  <p
                    className="text-xs font-semibold truncate mt-0.5"
                    style={{ color: theme.textColor }}
                  >
                    {nextMilestone.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Area: Mantra */}
          <div className="relative z-20 pb-7 px-8 flex flex-col items-center">
            {widgets.showMantra && deadline.mantra && (
              <p
                className="text-xs text-center italic mb-4 max-w-[260px] line-clamp-2"
                style={{ color: theme.subtextColor }}
              >
                "{deadline.mantra}"
              </p>
            )}

            {/* iOS Action Buttons (Only when chassis is shown) */}
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
