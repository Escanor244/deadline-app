import { NextRequest, NextResponse } from 'next/server';
import { calculateTimeRemaining } from '@/lib/smartPlanner';

export const dynamic = 'force-dynamic';

/**
 * Dynamic Lock Screen Wallpaper API
 * Can be fetched by iOS Shortcuts or widgets to automatically refresh wallpaper daily.
 * URL: /api/wallpaper?title=Launch&targetDate=2026-12-01T00:00:00Z&theme=obsidian
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'High Priority Milestone';
  const targetDate = searchParams.get('targetDate') || new Date(Date.now() + 7 * 86400000).toISOString();
  const mantra = searchParams.get('mantra') || 'Focus on the finish line.';
  const theme = searchParams.get('theme') || 'obsidian';

  const timeRemaining = calculateTimeRemaining(targetDate);

  const width = 1179;
  const height = 2556;

  // Colors based on theme
  let bg1 = '#09090b';
  let bg2 = '#141417';
  let accent = '#10b981';
  let text = '#ffffff';
  let subtext = '#a1a1aa';

  if (theme === 'terminal') {
    bg1 = '#030806';
    bg2 = '#091811';
    accent = '#22c55e';
    text = '#86efac';
    subtext = '#4ade80';
  } else if (theme === 'aura') {
    bg1 = '#0d071c';
    bg2 = '#241242';
    accent = '#f59e0b';
  } else if (theme === 'bauhaus') {
    bg1 = '#0e0e11';
    bg2 = '#1c1c24';
    accent = '#ef4444';
  }

  // Generate clean SVG wallpaper
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <!-- Safe Zone Hairline Guide (top section left clear for phone clock) -->
  <line x1="${width * 0.2}" y1="${height * 0.28}" x2="${width * 0.8}" y2="${height * 0.28}" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="8 8" />

  <!-- Center Card -->
  <rect x="${width * 0.08}" y="${height * 0.36}" width="${width * 0.84}" height="${height * 0.25}" rx="32" fill="rgba(24, 24, 27, 0.75)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="2" />

  <!-- Category & Title -->
  <text x="${width * 0.08 + 36}" y="${height * 0.36 + 48}" font-family="monospace" font-size="32" font-weight="bold" fill="${accent}">// TARGET COUNTDOWN</text>
  <text x="${width * 0.08 + 36}" y="${height * 0.36 + 100}" font-family="sans-serif" font-size="52" font-weight="bold" fill="${text}">${title}</text>

  <!-- Countdown Units -->
  <!-- Days -->
  <text x="${width * 0.22}" y="${height * 0.36 + 215}" font-family="monospace" font-size="96" font-weight="bold" text-anchor="middle" fill="${text}">${String(timeRemaining.days).padStart(2, '0')}</text>
  <text x="${width * 0.22}" y="${height * 0.36 + 255}" font-family="monospace" font-size="24" font-weight="600" text-anchor="middle" fill="${subtext}">DAYS</text>

  <!-- Hours -->
  <text x="${width * 0.41}" y="${height * 0.36 + 215}" font-family="monospace" font-size="96" font-weight="bold" text-anchor="middle" fill="${text}">${String(timeRemaining.hours).padStart(2, '0')}</text>
  <text x="${width * 0.41}" y="${height * 0.36 + 255}" font-family="monospace" font-size="24" font-weight="600" text-anchor="middle" fill="${subtext}">HOURS</text>

  <!-- Minutes -->
  <text x="${width * 0.60}" y="${height * 0.36 + 215}" font-family="monospace" font-size="96" font-weight="bold" text-anchor="middle" fill="${text}">${String(timeRemaining.minutes).padStart(2, '0')}</text>
  <text x="${width * 0.60}" y="${height * 0.36 + 255}" font-family="monospace" font-size="24" font-weight="600" text-anchor="middle" fill="${subtext}">MINUTES</text>

  <!-- Seconds -->
  <text x="${width * 0.78}" y="${height * 0.36 + 215}" font-family="monospace" font-size="96" font-weight="bold" text-anchor="middle" fill="${text}">${String(timeRemaining.seconds).padStart(2, '0')}</text>
  <text x="${width * 0.78}" y="${height * 0.36 + 255}" font-family="monospace" font-size="24" font-weight="600" text-anchor="middle" fill="${subtext}">SECONDS</text>

  <!-- Progress Bar -->
  <rect x="${width * 0.08 + 36}" y="${height * 0.36 + 290}" width="${width * 0.84 - 72}" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
  <rect x="${width * 0.08 + 36}" y="${height * 0.36 + 290}" width="${(width * 0.84 - 72) * Math.max(0.04, Math.min(1, timeRemaining.formattedPercentage / 100))}" height="8" rx="4" fill="${accent}" />

  <!-- Mantra Footer -->
  <text x="${width * 0.5}" y="${height * 0.88}" font-family="sans-serif" font-size="34" font-style="italic" text-anchor="middle" fill="${subtext}">"${mantra}"</text>
</svg>
`.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
