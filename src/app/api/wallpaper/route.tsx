import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { calculateTimeRemaining } from '@/lib/smartPlanner';

export const runtime = 'edge';

/**
 * Dynamic Lock Screen Wallpaper API (Native PNG)
 * Renders the Morning Briefing Porcelain Glass Card on Edge Runtime.
 * All divs have explicit display: flex per Satori specification.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'Production Launch V1';
  const targetDate =
    searchParams.get('targetDate') ||
    searchParams.get('deadline') ||
    new Date(Date.now() + 14 * 86400000).toISOString();
  const theme = searchParams.get('theme') || 'citron-mint';
  const userName = searchParams.get('userName') || 'Alex';
  const temp = searchParams.get('temp') || '72°';
  const condition = searchParams.get('condition') || 'partly cloudy';
  const location = searchParams.get('location') || 'Greenpoint, Brooklyn';
  const forecastNote =
    searchParams.get('note') || 'Light rain likely after 6PM, bring an umbrella';

  const timeRemaining = calculateTimeRemaining(targetDate);

  // Today's date string
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Background styling
  let bgGradient = 'linear-gradient(135deg, #cff674 0%, #9cf1a5 38%, #7bf0d5 72%, #6ee7b7 100%)';
  let cardBg = 'rgba(255, 255, 255, 0.92)';
  let cardBorder = '2px solid rgba(255, 255, 255, 0.85)';
  let textColor = '#0f172a';
  let subtextColor = '#64748b';
  let accentColor = '#15803d';
  let dividerColor = 'rgba(0, 0, 0, 0.08)';

  if (theme === 'sunset-peach') {
    bgGradient = 'linear-gradient(135deg, #fda4af 0%, #fcd34d 50%, #f43f5e 100%)';
    cardBg = 'rgba(255, 255, 255, 0.92)';
    accentColor = '#be123c';
  } else if (theme === 'nordic-paper') {
    bgGradient = 'linear-gradient(180deg, #f8f6f0 0%, #e9e4d8 100%)';
    cardBg = 'rgba(255, 255, 255, 0.96)';
    accentColor = '#c2410c';
  } else if (theme === 'deep-indigo') {
    bgGradient = 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #171131 100%)';
    cardBg = 'rgba(30, 27, 75, 0.85)';
    cardBorder = '2px solid rgba(167, 139, 250, 0.3)';
    textColor = '#f8fafc';
    subtextColor = '#cbd5e1';
    accentColor = '#a78bfa';
    dividerColor = 'rgba(255, 255, 255, 0.12)';
  } else if (theme === 'obsidian') {
    bgGradient = 'linear-gradient(180deg, #09090b 0%, #18181b 100%)';
    cardBg = 'rgba(24, 24, 27, 0.88)';
    cardBorder = '2px solid rgba(255, 255, 255, 0.15)';
    textColor = '#ffffff';
    subtextColor = '#a1a1aa';
    accentColor = '#10b981';
    dividerColor = 'rgba(255, 255, 255, 0.12)';
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 48px',
          background: bgGradient,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Porcelain Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: cardBg,
            borderRadius: '48px',
            padding: '54px 48px',
            border: cardBorder,
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Date */}
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 500,
              color: subtextColor,
              marginBottom: '10px',
            }}
          >
            {todayDateStr}
          </div>

          {/* Heading */}
          <div
            style={{
              display: 'flex',
              fontSize: '48px',
              fontWeight: 800,
              color: textColor,
              letterSpacing: '-1px',
              marginBottom: '24px',
            }}
          >
            {`Good morning, ${userName}`}
          </div>

          {/* Weather row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '26px',
                fontWeight: 600,
                color: textColor,
                marginBottom: '6px',
              }}
            >
              {`${temp}, ${condition} - ${location}`}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                fontWeight: 400,
                color: subtextColor,
              }}
            >
              {forecastNote}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '1px',
              backgroundColor: dividerColor,
              marginBottom: '28px',
            }}
          />

          {/* Dual Column Life Grid */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '36px',
            }}
          >
            {/* Events Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '48%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: textColor,
                  marginBottom: '14px',
                }}
              >
                SCHEDULE: 3 events today
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '19px',
                  fontWeight: 500,
                  color: textColor,
                  marginBottom: '8px',
                }}
              >
                9:30 AM - Team standup
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '19px',
                  fontWeight: 500,
                  color: textColor,
                  marginBottom: '8px',
                }}
              >
                1:00 PM - Lunch with Priya
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '19px',
                  fontWeight: 500,
                  color: textColor,
                }}
              >
                4:00 PM - Dentist
              </div>
            </div>

            {/* Tasks Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '48%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: textColor,
                  marginBottom: '14px',
                }}
              >
                TASKS: 2 due today
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '19px',
                  fontWeight: 500,
                  color: textColor,
                  marginBottom: '8px',
                }}
              >
                * Send report
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '19px',
                  fontWeight: 500,
                  color: textColor,
                }}
              >
                * Renew car registration
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '1px',
              backgroundColor: dividerColor,
              marginBottom: '28px',
            }}
          />

          {/* Target Countdown Footer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: '0.5px',
                }}
              >
                {`TARGET: ${title.toUpperCase()}`}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: textColor,
                }}
              >
                {`${timeRemaining.days}d ${timeRemaining.hours}h left`}
              </div>
            </div>

            {/* Pacing Progress Bar */}
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: dividerColor,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: `${Math.max(5, timeRemaining.formattedPercentage)}%`,
                  height: '100%',
                  backgroundColor: accentColor,
                  borderRadius: '6px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
