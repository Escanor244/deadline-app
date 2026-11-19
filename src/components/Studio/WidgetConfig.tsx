'use client';

import React from 'react';
import { DeviceType, WidgetSettings } from '@/types';
import { Smartphone, Monitor, Download, Eye, Layers } from 'lucide-react';

interface WidgetConfigProps {
  deviceType: DeviceType;
  setDeviceType: (device: DeviceType) => void;
  widgets: WidgetSettings;
  setWidgets: (widgets: WidgetSettings) => void;
  onExportWallpaper: () => void;
  isExporting: boolean;
}

export const WidgetConfig: React.FC<WidgetConfigProps> = ({
  deviceType,
  setDeviceType,
  widgets,
  setWidgets,
  onExportWallpaper,
  isExporting,
}) => {
  const toggleWidget = (key: keyof WidgetSettings) => {
    setWidgets({
      ...widgets,
      [key]: !widgets[key],
    });
  };

  return (
    <div className="space-y-6">
      {/* Device Target Selector */}
      <div>
        <label className="block text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase mb-2">
          Target Device Canvas
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setDeviceType('iphone16')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              deviceType === 'iphone16'
                ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-4 h-4 mb-1 text-emerald-400" />
            <span>iPhone 16</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5">19.5:9</span>
          </button>

          <button
            onClick={() => setDeviceType('pixel9')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              deviceType === 'pixel9'
                ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-4 h-4 mb-1 text-amber-400" />
            <span>Pixel 9</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5">20:9</span>
          </button>

          <button
            onClick={() => setDeviceType('desktop')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              deviceType === 'desktop'
                ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Monitor className="w-4 h-4 mb-1 text-cyan-400" />
            <span>Desktop</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5">16:9</span>
          </button>
        </div>
      </div>

      {/* Widget Toggles */}
      <div>
        <label className="block text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase mb-3 flex items-center justify-between">
          <span>Lock Screen Modules</span>
          <span className="text-[10px] text-zinc-500 font-normal">Toggle layout elements</span>
        </label>

        {/* Mode Selector: Phone Wallpaper vs Standby HUD */}
        <div className="mb-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300">Target Output Mode</span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase">
              {widgets.displayMode === 'wallpaper' ? 'Phone Wallpaper' : 'Standby HUD'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setWidgets({
                  ...widgets,
                  displayMode: 'wallpaper',
                  showClock: false,
                })
              }
              className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left transition flex flex-col ${
                widgets.displayMode === 'wallpaper'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="font-bold">Phone Wallpaper</span>
              <span className="text-[10px] text-zinc-500 mt-0.5">Leaves clock area clear</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setWidgets({
                  ...widgets,
                  displayMode: 'standalone_hud',
                  showClock: true,
                })
              }
              className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left transition flex flex-col ${
                widgets.displayMode === 'standalone_hud'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="font-bold">Standby HUD</span>
              <span className="text-[10px] text-zinc-500 mt-0.5">Includes full clock widget</span>
            </button>
          </div>
        </div>

        {/* Countdown Format & Vertical Position Selectors */}
        <div className="mb-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300">Countdown Layout</span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase">
                {widgets.countdownFormat}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'dhms', label: 'Full (DHMS)' },
                { id: 'compact', label: 'Compact' },
                { id: 'days_only', label: 'Days Only' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() =>
                    setWidgets({
                      ...widgets,
                      countdownFormat: fmt.id as any,
                    })
                  }
                  className={`py-1 px-2 rounded-lg text-[11px] font-mono transition ${
                    widgets.countdownFormat === fmt.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300">Vertical Alignment</span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {widgets.verticalPosition}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'center', label: 'Centered' },
                { id: 'lower_third', label: 'Lower Third' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() =>
                    setWidgets({
                      ...widgets,
                      verticalPosition: pos.id as any,
                    })
                  }
                  className={`py-1 px-2 rounded-lg text-[11px] font-mono transition ${
                    widgets.verticalPosition === pos.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { key: 'showClock', label: 'Primary Clock & Date', desc: 'Displays time in device font' },
            { key: 'showCountdown', label: 'Hero Countdown Grid', desc: 'Days : Hours : Mins : Secs' },
            { key: 'showMilestone', label: 'Next Milestone Ticker', desc: 'Highlights active sprint task' },
            { key: 'showProgressRing', label: 'Timeline Progress Bar', desc: '% time elapsed indicator' },
            { key: 'showMantra', label: 'Motivational Mantra', desc: 'Focused commitment anchor' },
            { key: 'showDeviceDecorations', label: 'Hardware Bezel / Island', desc: 'Dynamic Island & shortcuts' },
          ].map((item) => {
            const isEnabled = widgets[item.key as keyof WidgetSettings];
            return (
              <div
                key={item.key}
                onClick={() => toggleWidget(item.key as keyof WidgetSettings)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  isEnabled
                    ? 'border-zinc-700 bg-zinc-900/80 text-zinc-200'
                    : 'border-zinc-800/60 bg-zinc-950/40 text-zinc-500'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold">{item.label}</p>
                  <p className="text-[10px] text-zinc-500">{item.desc}</p>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    isEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Action Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-zinc-900 border border-emerald-500/30">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <Download className="w-4 h-4" />
          <span className="text-xs font-mono font-bold uppercase">Retina Export</span>
        </div>
        <p className="text-xs text-zinc-300">
          Render lock screen at native OLED resolution with zero blur.
        </p>

        <button
          onClick={onExportWallpaper}
          disabled={isExporting}
          className="w-full mt-3.5 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs tracking-wide transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating Wallpaper...' : 'Download Lock Screen Wallpaper'}</span>
        </button>
      </div>
    </div>
  );
};
