'use client';

import React, { useState } from 'react';
import { Deadline, ThemeConfig } from '@/types';
import { Sparkles, Copy, Check, X, Smartphone, Clock, RefreshCw, Zap, ArrowRight, ExternalLink } from 'lucide-react';

interface LiveWallpaperGuideProps {
  isOpen: boolean;
  onClose: () => void;
  deadline: Deadline;
  theme: ThemeConfig;
}

export const LiveWallpaperGuide: React.FC<LiveWallpaperGuideProps> = ({
  isOpen,
  onClose,
  deadline,
  theme,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-project.vercel.app';
  const userName = deadline.briefing?.userName || 'Alex';
  const weather = deadline.briefing?.weather;
  const dynamicUrl = `${origin}/api/wallpaper?title=${encodeURIComponent(
    deadline.title
  )}&targetDate=${encodeURIComponent(deadline.targetDate)}&theme=${encodeURIComponent(
    theme.id
  )}&userName=${encodeURIComponent(userName)}&temp=${encodeURIComponent(
    weather?.temperature || '72°'
  )}&condition=${encodeURIComponent(
    weather?.condition || 'partly cloudy'
  )}&location=${encodeURIComponent(
    weather?.location || 'Greenpoint, Brooklyn'
  )}&note=${encodeURIComponent(
    weather?.forecastNote || 'Light rain likely after 6PM, bring an umbrella'
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>Auto-Updating Dynamic Lock Screen</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  LIVE API
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                How to make your phone lock screen automatically refresh its countdown every day
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Image URL Box */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Your Personal Dynamic Wallpaper URL</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Native PNG Image
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Whenever this URL is requested, our server generates a fresh, updated countdown image for <strong className="text-white">{deadline.title}</strong>:
          </p>

          <div className="mt-2 p-3 rounded-xl bg-black border border-zinc-800/80 font-mono text-[11px] text-zinc-300 break-all select-all">
            {dynamicUrl}
          </div>

          <button
            onClick={handleCopy}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center space-x-2 border border-zinc-700"
          >
            {copiedUrl ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Dynamic Image URL Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Dynamic Image URL</span>
              </>
            )}
          </button>
        </div>

        {/* Setup Methods Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
            Choose Your Preferred Live Method:
          </h3>

          {/* Method 1: iPhone Automated Wallpaper (Apple Shortcuts) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-white">
                iPhone (iOS) 2-Minute Automation (Auto-Changes Wallpaper Daily)
              </h4>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Apple allows iPhones to change their wallpaper automatically using the built-in <strong>Shortcuts</strong> app:
            </p>

            <ol className="space-y-2 text-xs text-zinc-300 pl-4 list-decimal">
              <li>
                Open the <strong>Shortcuts</strong> app on your iPhone and tap the <strong>Automation</strong> tab at the bottom.
              </li>
              <li>
                Tap <strong>+ (New Automation)</strong> &gt; select <strong>Time of Day</strong> (e.g. <em>8:00 AM Daily</em>, or <em>When Waking Up</em>).
              </li>
              <li>
                Tap <strong>Next</strong> &gt; Add Action: Search for <strong>"Get Contents of URL"</strong> and paste your copied Dynamic URL.
              </li>
              <li>
                Add another Action: Search for <strong>"Set Wallpaper"</strong> &gt; set <strong>Lock Screen</strong> to the output of the URL (turn off <em>"Show Preview"</em>).
              </li>
            </ol>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              ✓ <strong>Result:</strong> Every morning at 8:00 AM, your iPhone downloads the new countdown image and automatically updates your lock screen!
            </div>
          </div>

          {/* Method 2: Standalone PWA Live HUD */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-white">
                PWA Desk Clock HUD (Live Ticking Second-by-Second)
              </h4>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              If you have a phone stand on your desk or bedside table, turn your phone into a live Always-On Display:
            </p>

            <ul className="space-y-1.5 text-xs text-zinc-300 pl-4 list-disc">
              <li>Open your deployed Vercel link in Safari (iOS) or Chrome (Android).</li>
              <li>Tap <strong>Share &gt; Add to Home Screen</strong>.</li>
              <li>Launch it from your home screen and tap <strong>"Launch Live HUD"</strong>.</li>
              <li>It runs full-screen with no browser address bars, ticking live with focus soundscapes!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
