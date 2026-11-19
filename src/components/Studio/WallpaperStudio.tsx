'use client';

import React, { useState } from 'react';
import { Deadline, DeviceType, ThemeConfig, TimeRemaining, WidgetSettings } from '@/types';
import { ThemeSelector } from './ThemeSelector';
import { WidgetConfig } from './WidgetConfig';
import { DeviceMockup } from './DeviceMockup';
import { LiveWallpaperGuide } from './LiveWallpaperGuide';
import { Download, Maximize2, Smartphone, Monitor, Eye, Layers, Sparkles, RefreshCw } from 'lucide-react';

interface WallpaperStudioProps {
  deadline: Deadline;
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  deviceType: DeviceType;
  setDeviceType: (device: DeviceType) => void;
  widgets: WidgetSettings;
  setWidgets: (widgets: WidgetSettings) => void;
  timeRemaining: TimeRemaining;
  currentTimeStr: string;
  onExportWallpaper: () => void;
  isExporting: boolean;
  onEnterFullscreen: () => void;
}

export const WallpaperStudio: React.FC<WallpaperStudioProps> = ({
  deadline,
  theme,
  setTheme,
  deviceType,
  setDeviceType,
  widgets,
  setWidgets,
  timeRemaining,
  currentTimeStr,
  onExportWallpaper,
  isExporting,
  onEnterFullscreen,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'design' | 'canvas'>('design');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const RESOLUTION_LABELS: Record<DeviceType, string> = {
    iphone16: '1179 × 2556 px (iPhone 16 Pro · 19.5:9)',
    pixel9: '1080 × 2400 px (Google Pixel 9 · 20:9)',
    desktop: '2560 × 1440 px (Desktop HUD · 16:9)',
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Quick Action Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Lock Screen Wallpaper & HUD Studio
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Customize typography, safe zones, and aesthetic colorways. Export at native OLED resolution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
            title="Learn how to make the wallpaper auto-update on iPhone/Android"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Auto-Update Guide</span>
          </button>

          <button
            onClick={onEnterFullscreen}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition"
            title="Launch Fullscreen Lock Screen Mode"
          >
            <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Launch Live HUD</span>
          </button>

          <button
            onClick={onExportWallpaper}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs tracking-wide transition shadow-lg disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Rasterizing...' : 'Download Wallpaper (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Style & Theme Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <ThemeSelector currentTheme={theme} setTheme={setTheme} />
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <WidgetConfig
              deviceType={deviceType}
              setDeviceType={setDeviceType}
              widgets={widgets}
              setWidgets={setWidgets}
              onExportWallpaper={onExportWallpaper}
              isExporting={isExporting}
            />
          </div>
        </div>

        {/* Right Column: Clean Interactive Canvas & Export Card (6 cols) */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>TARGET CANVAS // {RESOLUTION_LABELS[deviceType]}</span>
            <span className="text-emerald-400">RETINA 3X OUTPUT</span>
          </div>

          <div className="flex justify-center p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
            <DeviceMockup
              deviceType={deviceType}
              deadline={deadline}
              theme={theme}
              widgets={widgets}
              setWidgets={setWidgets}
              timeRemaining={timeRemaining}
              currentTimeStr={currentTimeStr}
              onEnterFullscreen={onEnterFullscreen}
            />
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-200">How to apply on your phone:</p>
            <p>1. Click <strong>Download Wallpaper</strong> to save the native retina image to your device.</p>
            <p>2. Open your device's <strong>Settings &gt; Wallpaper</strong> and select the downloaded image.</p>
            <p>3. With <em>Phone Wallpaper Mode</em> active, the top section is left clear so your phone's real clock is unobstructed.</p>
          </div>
        </div>
      </div>

      {/* Auto-Updating Wallpaper Modal Guide */}
      <LiveWallpaperGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        deadline={deadline}
        theme={theme}
      />
    </div>
  );
};
