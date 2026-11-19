import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { calculateTimeRemaining } from '@/lib/smartPlanner';

export const runtime = 'edge';

/**
 * Dynamic Lock Screen Wallpaper API (Native PNG)
 * Renders a crisp native PNG image on the edge, perfect for iOS Shortcuts auto-refresh.
 * URL: /api/wallpaper?title=Launch&targetDate=2026-12-01T00:00:00Z&theme=obsidian
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'High Priority Milestone';
  const targetDate =
    searchParams.get('targetDate') ||
    searchParams.get('deadline') ||
    new Date(Date.now() + 7 * 86400000).toISOString();
  const mantra = searchParams.get('mantra') || 'Focus on the finish line.';
  const theme = searchParams.get('theme') || 'obsidian';

  const timeRemaining = calculateTimeRemaining(targetDate);

  // Theme palettes
  let bgGradient = 'linear-gradient(to bottom, #09090b, #141417)';
  let accent = '#10b981';
  let cardBg = 'rgba(24, 24, 27, 0.85)';
  let text = '#ffffff';
  let subtext = '#a1a1aa';

  if (theme === 'terminal') {
    bgGradient = 'linear-gradient(to bottom, #030806, #091811)';
    accent = '#22c55e';
    cardBg = 'rgba(5, 20, 12, 0.9)';
    text = '#86efac';
    subtext = '#4ade80';
  } else if (theme === 'aura') {
    bgGradient = 'linear-gradient(to bottom, #0d071c, #241242)';
    accent = '#f59e0b';
    cardBg = 'rgba(255, 255, 255, 0.1)';
  } else if (theme === 'bauhaus') {
    bgGradient = 'linear-gradient(to bottom, #0e0e11, #1c1c24)';
    accent = '#ef4444';
    cardBg = 'rgba(28, 28, 36, 0.9)';
  }

  // Native iPhone 16 resolution ratio (rendered at standard @2x canvas 1080x1920 for edge speed)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 48px',
          background: bgGradient,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top Safe Area - Left clear for iPhone's real clock */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '60px',
          }}
        >
          <div
            style={{
              borderBottom: '2px dashed rgba(255, 255, 255, 0.1)',
              width: '280px',
            }}
          />
        </div>

        {/* Center Countdown Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: cardBg,
            borderRadius: '36px',
            padding: '48px 36px',
            border: '2px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: accent,
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            // TARGET COUNTDOWN
          </div>

          <div
            style={{
              fontSize: '44px',
              fontWeight: 800,
              color: text,
              marginBottom: '36px',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          {/* 4 Unit Columns */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            {[
              { label: 'DAYS', val: timeRemaining.days },
              { label: 'HOURS', val: timeRemaining.hours },
              { label: 'MINUTES', val: timeRemaining.minutes },
              { label: 'SECONDS', val: timeRemaining.seconds },
            ].map((u, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  padding: '20px 16px',
                  borderRadius: '24px',
                  minWidth: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    color: text,
                    lineHeight: 1,
                  }}
                >
                  {String(u.val).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: subtext,
                    marginTop: '8px',
                    letterSpacing: '1px',
                  }}
                >
                  {u.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div
              style={{
                width: `${Math.max(5, timeRemaining.formattedPercentage)}%`,
                height: '100%',
                backgroundColor: accent,
                borderRadius: '5px',
              }}
            />
          </div>
        </div>

        {/* Footer Mantra */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontStyle: 'italic',
              color: subtext,
            }}
          >
            "{mantra}"
          </span>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 1422, // 16:9 phone aspect ratio for fast Edge PNG generation
    }
  );
}
