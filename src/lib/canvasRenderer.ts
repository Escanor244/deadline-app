import { Deadline, DeviceType, ThemeConfig, TimeRemaining, WidgetSettings } from '@/types';

export interface DeviceResolution {
  width: number;
  height: number;
  label: string;
}

export const DEVICE_RESOLUTIONS: Record<DeviceType, DeviceResolution> = {
  iphone16: {
    width: 1179,
    height: 2556,
    label: 'iPhone 16 Pro (1179 × 2556)',
  },
  pixel9: {
    width: 1080,
    height: 2400,
    label: 'Google Pixel 9 (1080 × 2400)',
  },
  desktop: {
    width: 2560,
    height: 1440,
    label: 'Desktop / Monitor (2560 × 1440)',
  },
};

/**
 * Procedurally draws the custom lock screen wallpaper onto an HTML5 Canvas at native resolution.
 */
export async function renderLockScreenToCanvas(
  canvas: HTMLCanvasElement,
  deviceType: DeviceType,
  deadline: Deadline,
  theme: ThemeConfig,
  widgets: WidgetSettings,
  timeRemaining: TimeRemaining
): Promise<void> {
  const { width, height } = DEVICE_RESOLUTIONS[deviceType];
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Background
  if (theme.id === 'custom' && theme.customImageUri) {
    await drawCustomImageBg(ctx, width, height, theme);
  } else if (theme.id === 'citron-mint') {
    drawCitronMintBg(ctx, width, height);
  } else if (theme.id === 'sunset-peach') {
    drawSunsetPeachBg(ctx, width, height);
  } else if (theme.id === 'nordic-paper') {
    drawNordicPaperBg(ctx, width, height);
  } else if (theme.id === 'deep-indigo') {
    drawDeepIndigoBg(ctx, width, height);
  } else if (theme.id === 'terminal') {
    drawTerminalBg(ctx, width, height, theme);
  } else if (theme.id === 'aura') {
    drawAuraBg(ctx, width, height, theme);
  } else if (theme.id === 'bauhaus') {
    drawBauhausBg(ctx, width, height, theme);
  } else {
    drawObsidianOrZenBg(ctx, width, height, theme);
  }

  // 2. Add film grain texture if enabled
  if (theme.grain) {
    applyFilmGrain(ctx, width, height, 0.035);
  }

  // 3. Draw Lock Screen Typography & Widgets
  if (deviceType === 'desktop') {
    drawDesktopLayout(ctx, width, height, deadline, theme, widgets, timeRemaining);
  } else {
    drawMobileLayout(ctx, width, height, deviceType, deadline, theme, widgets, timeRemaining);
  }
}

/**
 * Citron Mint Background: Vibrant Lime-to-Cyan grain gradient
 */
function drawCitronMintBg(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#cff674'); // Bright electric lime
  grad.addColorStop(0.38, '#9cf1a5'); // Fresh spring mint
  grad.addColorStop(0.72, '#7bf0d5'); // Soft aqua
  grad.addColorStop(1, '#6ee7b7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle luminous aura in top corner
  const radial = ctx.createRadialGradient(width * 0.15, height * 0.1, 40, width * 0.15, height * 0.1, width * 0.7);
  radial.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Sunset Peach Background: Coral, blush peach and golden apricot
 */
function drawSunsetPeachBg(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const grad = ctx.createLinearGradient(0, 0, width * 0.8, height);
  grad.addColorStop(0, '#fda4af');
  grad.addColorStop(0.5, '#fcd34d');
  grad.addColorStop(1, '#f43f5e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Nordic Paper Background: Warm ceramic ivory
 */
function drawNordicPaperBg(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#f8f6f0');
  grad.addColorStop(1, '#e9e4d8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Tokyo Indigo Background: Deep sapphire to midnight violet
 */
function drawDeepIndigoBg(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.6, '#1e1b4b');
  grad.addColorStop(1, '#171131');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const radial = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, width * 0.8);
  radial.addColorStop(0, 'rgba(167, 139, 250, 0.25)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws custom uploaded image with blur and dimming for legibility
 */
function drawCustomImageBg(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeConfig
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;

      ctx.save();
      if (theme.imageBlur && theme.imageBlur > 0) {
        ctx.filter = `blur(${theme.imageBlur * 2}px)`;
      }
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      const dim = (theme.imageDim ?? 40) / 100;
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.fillRect(0, 0, width, height);
      resolve();
    };
    img.onerror = () => {
      drawObsidianOrZenBg(ctx, width, height, theme);
      resolve();
    };
    img.src = theme.customImageUri || '';
  });
}

function drawTerminalBg(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeConfig
) {
  ctx.fillStyle = theme.bgPrimary;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawAuraBg(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeConfig
) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, theme.bgPrimary);
  grad.addColorStop(1, theme.bgSecondary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const orbGrad = ctx.createRadialGradient(width * 0.7, height * 0.3, 20, width * 0.7, height * 0.3, width * 0.6);
  orbGrad.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
  orbGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = orbGrad;
  ctx.fillRect(0, 0, width, height);
}

function drawBauhausBg(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeConfig
) {
  ctx.fillStyle = theme.bgPrimary;
  ctx.fillRect(0, 0, width, height);
}

function drawObsidianOrZenBg(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeConfig
) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, theme.bgPrimary);
  grad.addColorStop(1, theme.bgSecondary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Procedural grain pattern for tactile organic texture
 */
function applyFilmGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha: number
) {
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext('2d');
  if (!gCtx) return;

  const imgData = gCtx.createImageData(256, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = Math.floor(alpha * 255);
  }
  gCtx.putImageData(imgData, 0, 0);

  const pattern = ctx.createPattern(grainCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }
}

/**
 * Draws Mobile (iPhone / Android) Lock Screen layout
 * Accurately implements the Morning Briefing Porcelain Glass Card from reference
 */
function drawMobileLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deviceType: DeviceType,
  deadline: Deadline,
  theme: ThemeConfig,
  widgets: WidgetSettings,
  timeRemaining: TimeRemaining
) {
  const fontFam = 'system-ui, -apple-system, "SF Pro Display", "Segoe UI", Roboto, sans-serif';
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

  // 1. Top Section (Clock & Date or Safe Area)
  if (widgets.displayMode === 'standalone_hud' || widgets.showClock) {
    let topCursorY = height * 0.12;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    ctx.fillStyle = theme.isLightCard ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.75)';
    ctx.font = `500 ${Math.round(width * 0.042)}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.fillText(dateStr, width / 2, topCursorY);

    topCursorY += height * 0.085;

    ctx.fillStyle = theme.isLightCard ? '#0f172a' : '#ffffff';
    ctx.font = `700 ${Math.round(width * 0.22)}px ${fontFam}`;
    ctx.textAlign = 'center';
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    ctx.fillText(timeStr, width / 2, topCursorY);
  }

  // 2. Porcelain Glass Card
  const cardMargin = width * 0.055;
  const cardWidth = width - cardMargin * 2;
  const cardX = cardMargin;
  const cardY = widgets.displayMode === 'standalone_hud' ? height * 0.32 : height * 0.26;
  const cardHeight = height * 0.52;
  const innerPad = Math.round(width * 0.075);

  ctx.save();
  // Soft drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
  ctx.shadowBlur = Math.round(width * 0.05);
  ctx.shadowOffsetY = Math.round(height * 0.015);

  // Fill porcelain card
  ctx.fillStyle = theme.cardBg;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, Math.round(width * 0.08));
  ctx.fill();
  ctx.restore();

  // Card hairline border
  ctx.save();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, Math.round(width * 0.08));
  ctx.stroke();
  ctx.restore();

  // Content coordinates
  let curY = cardY + innerPad * 1.1;

  // A. Date subheader (e.g., "Wednesday, September 9")
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillStyle = theme.isLightCard ? '#64748b' : theme.subtextColor;
  ctx.font = `500 ${Math.round(width * 0.034)}px ${fontFam}`;
  ctx.textAlign = 'left';
  ctx.fillText(todayDateStr, cardX + innerPad, curY);

  curY += Math.round(width * 0.085);

  // B. Large Personal Greeting (e.g. "Good morning, Alex")
  const greetingText = `${briefing.greetingPrefix || 'Good morning'}, ${briefing.userName || 'Alex'}`;
  ctx.fillStyle = theme.isLightCard ? '#0f172a' : theme.textColor;
  ctx.font = `700 ${Math.round(width * 0.068)}px ${fontFam}`;
  ctx.fillText(greetingText, cardX + innerPad, curY);

  curY += Math.round(width * 0.08);

  // C. Weather & Morning Context
  if (widgets.showWeather !== false) {
    const weatherText = `☁  ${briefing.weather.temperature}, ${briefing.weather.condition} ${briefing.weather.location}`;
    ctx.fillStyle = theme.isLightCard ? '#1e293b' : theme.textColor;
    ctx.font = `600 ${Math.round(width * 0.035)}px ${fontFam}`;
    ctx.fillText(weatherText, cardX + innerPad, curY);

    curY += Math.round(width * 0.048);

    if (briefing.weather.forecastNote) {
      ctx.fillStyle = theme.isLightCard ? '#64748b' : theme.subtextColor;
      ctx.font = `400 ${Math.round(width * 0.031)}px ${fontFam}`;
      ctx.fillText(briefing.weather.forecastNote, cardX + innerPad, curY);
      curY += Math.round(width * 0.06);
    }
  }

  // Divider Line
  ctx.strokeStyle = theme.isLightCard ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + innerPad, curY);
  ctx.lineTo(cardX + cardWidth - innerPad, curY);
  ctx.stroke();

  curY += Math.round(width * 0.06);

  // D. Dual Column Life Grid: Events Today & Tasks Due Today
  const colWidth = (cardWidth - innerPad * 2) / 2;
  const col1X = cardX + innerPad;
  const col2X = cardX + innerPad + colWidth + Math.round(width * 0.02);

  // Column 1 Header: Events
  const eventsCount = briefing.events.length;
  ctx.fillStyle = theme.isLightCard ? '#0f172a' : theme.textColor;
  ctx.font = `600 ${Math.round(width * 0.034)}px ${fontFam}`;
  ctx.fillText(`🗓  ${eventsCount} events today`, col1X, curY);

  // Column 2 Header: Tasks
  const tasksCount = briefing.tasks.length;
  ctx.fillText(`📋  ${tasksCount} tasks due today`, col2X, curY);

  curY += Math.round(width * 0.055);

  // List Rows (up to 3 items per column)
  const maxRows = Math.max(briefing.events.length, briefing.tasks.length, 3);
  const rowHeight = Math.round(width * 0.055);

  for (let r = 0; r < Math.min(maxRows, 3); r++) {
    const rowY = curY + r * rowHeight;

    // Event Row
    if (briefing.events[r]) {
      const ev = briefing.events[r];
      ctx.fillStyle = theme.isLightCard ? '#334155' : theme.textColor;
      ctx.font = `500 ${Math.round(width * 0.03)}px ${fontFam}`;
      const evText = `${ev.time} — ${ev.title}`;
      const truncaEv = evText.length > 22 ? evText.slice(0, 20) + '...' : evText;
      ctx.fillText(truncaEv, col1X, rowY);
    }

    // Task Row
    if (briefing.tasks[r]) {
      const tk = briefing.tasks[r];
      ctx.fillStyle = theme.isLightCard ? '#334155' : theme.textColor;
      ctx.font = `500 ${Math.round(width * 0.03)}px ${fontFam}`;
      const tkText = tk.title;
      const truncaTk = tkText.length > 22 ? tkText.slice(0, 20) + '...' : tkText;
      ctx.fillText(truncaTk, col2X, rowY);
    }
  }

  // E. Integrated Target Deadline & Countdown Progress Bar (at bottom of card)
  const footerY = cardY + cardHeight - Math.round(width * 0.14);

  // Divider Line
  ctx.strokeStyle = theme.isLightCard ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.moveTo(cardX + innerPad, footerY - Math.round(width * 0.05));
  ctx.lineTo(cardX + cardWidth - innerPad, footerY - Math.round(width * 0.05));
  ctx.stroke();

  // Target Goal Title & Days remaining
  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${Math.round(width * 0.032)}px ${fontFam}`;
  ctx.fillText(`🎯 TARGET: ${deadline.title.toUpperCase()}`, cardX + innerPad, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = theme.isLightCard ? '#0f172a' : theme.textColor;
  ctx.font = `700 ${Math.round(width * 0.034)}px ${fontFam}`;
  ctx.fillText(`${timeRemaining.days}d ${timeRemaining.hours}h left`, cardX + cardWidth - innerPad, footerY);

  // Pacing Progress Bar
  const barY = footerY + Math.round(width * 0.03);
  const barW = cardWidth - innerPad * 2;
  const barH = Math.round(width * 0.018);

  ctx.fillStyle = theme.isLightCard ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  roundRect(ctx, cardX + innerPad, barY, barW, barH, barH / 2);
  ctx.fill();

  const fillW = Math.max(barH, (barW * timeRemaining.formattedPercentage) / 100);
  ctx.fillStyle = theme.accentColor;
  roundRect(ctx, cardX + innerPad, barY, fillW, barH, barH / 2);
  ctx.fill();
}

/**
 * Draws Desktop / Widescreen Layout
 */
function drawDesktopLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deadline: Deadline,
  theme: ThemeConfig,
  widgets: WidgetSettings,
  timeRemaining: TimeRemaining
) {
  const fontFam = 'system-ui, -apple-system, sans-serif';
  const briefing = deadline.briefing || {
    userName: 'Alex',
    greetingPrefix: 'Good morning',
    weather: {
      temperature: '72°',
      condition: 'partly cloudy',
      location: 'Greenpoint, Brooklyn',
      forecastNote: 'Light rain likely after 6PM',
    },
    events: [
      { id: 'ev-1', time: '9:30 AM', title: 'Team standup' },
      { id: 'ev-2', time: '1:00 PM', title: 'Lunch with Priya' },
    ],
    tasks: [
      { id: 'tk-1', title: 'Send report', completed: false },
      { id: 'tk-2', title: 'Renew car registration', completed: false },
    ],
  };

  const cardWidth = Math.round(width * 0.45);
  const cardHeight = Math.round(height * 0.58);
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;
  const pad = Math.round(width * 0.03);

  // Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = theme.cardBg;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 36);
  ctx.fill();
  ctx.restore();

  // Border
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 36);
  ctx.stroke();

  let curY = cardY + pad * 1.2;

  // Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillStyle = theme.isLightCard ? '#64748b' : theme.subtextColor;
  ctx.font = `500 ${Math.round(height * 0.024)}px ${fontFam}`;
  ctx.textAlign = 'left';
  ctx.fillText(dateStr, cardX + pad, curY);

  curY += Math.round(height * 0.05);

  // Greeting
  ctx.fillStyle = theme.isLightCard ? '#0f172a' : theme.textColor;
  ctx.font = `700 ${Math.round(height * 0.046)}px ${fontFam}`;
  ctx.fillText(`${briefing.greetingPrefix || 'Good morning'}, ${briefing.userName || 'Alex'}`, cardX + pad, curY);

  curY += Math.round(height * 0.05);

  // Weather
  ctx.fillStyle = theme.isLightCard ? '#334155' : theme.textColor;
  ctx.font = `500 ${Math.round(height * 0.022)}px ${fontFam}`;
  ctx.fillText(`☁  ${briefing.weather.temperature}, ${briefing.weather.condition} • ${briefing.weather.location}`, cardX + pad, curY);

  curY += Math.round(height * 0.04);

  // Divider
  ctx.strokeStyle = theme.isLightCard ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + pad, curY);
  ctx.lineTo(cardX + cardWidth - pad, curY);
  ctx.stroke();

  curY += Math.round(height * 0.045);

  // Dual Column
  const colW = (cardWidth - pad * 2) / 2;
  ctx.font = `600 ${Math.round(height * 0.022)}px ${fontFam}`;
  ctx.fillStyle = theme.isLightCard ? '#0f172a' : theme.textColor;
  ctx.fillText(`🗓  ${briefing.events.length} events today`, cardX + pad, curY);
  ctx.fillText(`📋  ${briefing.tasks.length} tasks due today`, cardX + pad + colW, curY);

  curY += Math.round(height * 0.04);

  for (let r = 0; r < 2; r++) {
    const rowY = curY + r * Math.round(height * 0.035);
    ctx.font = `400 ${Math.round(height * 0.019)}px ${fontFam}`;
    ctx.fillStyle = theme.isLightCard ? '#475569' : theme.textColor;

    if (briefing.events[r]) {
      ctx.fillText(`${briefing.events[r].time} — ${briefing.events[r].title}`, cardX + pad, rowY);
    }
    if (briefing.tasks[r]) {
      ctx.fillText(briefing.tasks[r].title, cardX + pad + colW, rowY);
    }
  }

  // Footer Target
  const footerY = cardY + cardHeight - Math.round(height * 0.08);
  ctx.strokeStyle = theme.isLightCard ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.moveTo(cardX + pad, footerY - Math.round(height * 0.03));
  ctx.lineTo(cardX + cardWidth - pad, footerY - Math.round(height * 0.03));
  ctx.stroke();

  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${Math.round(height * 0.024)}px ${fontFam}`;
  ctx.fillText(`🎯 TARGET: ${deadline.title.toUpperCase()}`, cardX + pad, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = theme.isLightCard ? '#0f172a' : theme.textColor;
  ctx.fillText(`${timeRemaining.days}d ${timeRemaining.hours}h left`, cardX + cardWidth - pad, footerY);
}

/**
 * Helper to draw rounded rectangle on canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Triggers instant browser download of the canvas as high-resolution PNG
 */
export function downloadCanvasWallpaper(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
