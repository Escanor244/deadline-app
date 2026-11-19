'use client';

import React, { useState, useEffect } from 'react';
import { Deadline, ThemeConfig, TimeRemaining, WidgetSettings } from '@/types';
import { playAmbientSound, stopAmbientSound } from '@/lib/audio';
import { X, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

interface FullscreenModeProps {
  deadline: Deadline;
  theme: ThemeConfig;
  widgets: WidgetSettings;
  timeRemaining: TimeRemaining;
  currentTimeStr: string;
  onClose: () => void;
}

export const FullscreenMode: React.FC<FullscreenModeProps> = ({
  deadline,
  theme,
  widgets,
  timeRemaining,
  currentTimeStr,
  onClose,
}) => {
  const [soundType, setSoundType] = useState<
    'off' | 'brown_noise' | 'pink_noise' | 'focus_drone' | 'clock_tick'
  >('off');
  const [volume, setVolume] = useState<number>(0.2);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAmbientSound();
    };
  }, [onClose]);

  const handleSoundChange = (
    type: 'off' | 'brown_noise' | 'pink_noise' | 'focus_drone' | 'clock_tick'
  ) => {
    setSoundType(type);
    if (type === 'off') {
      stopAmbientSound();
    } else {
      playAmbientSound(type, volume);
    }
  };

  const nextMilestone =
    deadline.milestones.find((m) => !m.completed) || deadline.milestones[0];

  const targetDateObj = new Date(deadline.targetDate);
  const dateFormatted = targetDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-black select-none">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            theme.id === 'aura'
              ? `radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.4) 0%, rgba(13, 7, 28, 0) 70%), ${theme.bgPrimary}`
              : theme.id === 'terminal'
              ? `linear-gradient(to bottom, #030806, #091811)`
              : `linear-gradient(to bottom, ${theme.bgPrimary}, ${theme.bgSecondary})`,
        }}
      />
      {theme.grain && (
        <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none z-0" />
      )}

      {/* Top HUD */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-widest uppercase">LIVE COUNTDOWN HUD</span>
          <span>·</span>
          <span>{dateFormatted.toUpperCase()}</span>
        </div>

        {/* Ambient Sound Controls */}
        <div className="flex items-center space-x-3 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-zinc-300">Focus Audio:</span>
          <select
            value={soundType}
            onChange={(e) => handleSoundChange(e.target.value as any)}
            className="bg-transparent text-xs text-white outline-none cursor-pointer"
          >
            <option value="off" className="bg-zinc-900">Mute</option>
            <option value="brown_noise" className="bg-zinc-900">Brown Noise (Deep)</option>
            <option value="pink_noise" className="bg-zinc-900">Pink Noise (Rain-like)</option>
            <option value="focus_drone" className="bg-zinc-900">Binaural Drone (108Hz)</option>
            <option value="clock_tick" className="bg-zinc-900">Clock Tick</option>
          </select>

          <button
            onClick={onClose}
            className="ml-2 p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            title="Exit Fullscreen (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Giant Countdown */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center my-auto">
        <p
          className="text-sm font-mono font-bold tracking-widest uppercase mb-2"
          style={{ color: theme.accentColor }}
        >
          // TARGET DEADLINE · {deadline.category}
        </p>
        <h1
          className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-8"
          style={{
            fontFamily:
              theme.fontFamily === 'mono'
                ? 'monospace'
                : 'Inter, system-ui, sans-serif',
          }}
        >
          {deadline.title}
        </h1>

        {/* Huge Countdown Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'DAYS REMAINING', val: timeRemaining.days },
            { label: 'HOURS', val: timeRemaining.hours },
            { label: 'MINUTES', val: timeRemaining.minutes },
            { label: 'SECONDS', val: timeRemaining.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-xl flex flex-col items-center shadow-2xl"
            >
              <span
                className="text-5xl sm:text-7xl font-mono font-bold tabular-nums"
                style={{ color: theme.textColor }}
              >
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-xs font-mono tracking-widest text-zinc-400 mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-900/80 rounded-full h-2.5 mt-8 overflow-hidden border border-zinc-800">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(5, timeRemaining.formattedPercentage)}%`,
              backgroundColor: theme.accentColor,
            }}
          />
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        {nextMilestone && (
          <div className="flex items-center space-x-2 bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-800">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
              style={{
                backgroundColor: `${theme.accentColor}25`,
                color: theme.accentColor,
              }}
            >
              {nextMilestone.pacingLabel}
            </span>
            <span className="text-zinc-200 font-semibold truncate max-w-sm">
              {nextMilestone.title}
            </span>
          </div>
        )}

        {deadline.mantra && (
          <p className="italic text-zinc-400 text-sm">
            "{deadline.mantra}"
          </p>
        )}

        <span className="text-[11px] font-mono text-zinc-600">
          Press [ESC] to exit HUD
        </span>
      </div>
    </div>
  );
};
