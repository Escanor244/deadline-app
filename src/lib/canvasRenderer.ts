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
    applyFilmGrain(ctx, width, height, 0.04);
  }

  // 3. Draw Lock Screen Typography & Widgets
  if (deviceType === 'desktop') {
    drawDesktopLayout(ctx, width, height, deadline, theme, widgets, timeRemaining);
  } else {
    drawMobileLayout(ctx, width, height, deviceType, deadline, theme, widgets, timeRemaining);
  }
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
      // Calculate cover fit
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;

      ctx.save();
      if (theme.imageBlur && theme.imageBlur > 0) {
        ctx.filter = `blur(${theme.imageBlur * 2}px)`;
      }
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // Dim overlay
      const dim = (theme.imageDim ?? 40) / 100;
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.fillRect(0, 0, width, height);

      resolve();
    };
    img.onerror = () => {
      // Fallback
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);
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
  // Base dark gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, theme.bgPrimary);
  grad.addColorStop(1, theme.bgSecondary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 48;
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

  // CRT scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1.5);
  }
}

function drawAuraBg(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeConfig
) {
  // Deep background
  ctx.fillStyle = theme.bgPrimary;
  ctx.fillRect(0, 0, width, height);

  // Radial aura 1
  const rad1 = ctx.createRadialGradient(width * 0.5, height * 0.35, 50, width * 0.5, height * 0.35, width * 0.75);
  rad1.addColorStop(0, 'rgba(139, 92, 246, 0.38)');
  rad1.addColorStop(0.6, 'rgba(59, 130, 246, 0.15)');
  rad1.addColorStop(1, 'rgba(13, 7, 28, 0)');
  ctx.fillStyle = rad1;
  ctx.fillRect(0, 0, width, height);

  // Radial aura 2
  const rad2 = ctx.createRadialGradient(width * 0.2, height * 0.7, 30, width * 0.2, height * 0.7, width * 0.6);
  rad2.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
  rad2.addColorStop(1, 'rgba(13, 7, 28, 0)');
  ctx.fillStyle = rad2;
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

  // Geometric blocks
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.25, width * 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
  ctx.fillRect(0, height * 0.6, width * 0.65, height * 0.3);

  // Architectural hairline accents
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, 0);
  ctx.lineTo(width * 0.1, height);
  ctx.moveTo(0, height * 0.4);
  ctx.lineTo(width, height * 0.4);
  ctx.stroke();
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

  // Subtle luxury corner reticles
  const pad = Math.round(width * 0.06);
  const markLen = 24;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(pad, pad + markLen);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + markLen, pad);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - pad - markLen, pad);
  ctx.lineTo(width - pad, pad);
  ctx.lineTo(width - pad, pad + markLen);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(pad, height - pad - markLen);
  ctx.lineTo(pad, height - pad);
  ctx.lineTo(pad + markLen, height - pad);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - pad - markLen, height - pad);
  ctx.lineTo(width - pad, height - pad);
  ctx.lineTo(width - pad, height - pad - markLen);
  ctx.stroke();
}

/**
 * Procedural grain pattern for tactile non-slop texture
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
  const fontFam =
    theme.fontFamily === 'mono'
      ? '"JetBrains Mono", "Courier New", monospace'
      : theme.fontFamily === 'serif'
      ? '"Georgia", "Times New Roman", serif'
      : 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const targetDateObj = new Date(deadline.targetDate);

  // 1. Top Section (Clock & Date)
  // In 'wallpaper' mode, we leave the top 30% clean as a safe-zone for the phone's native lock screen clock
  if (widgets.displayMode === 'standalone_hud' || widgets.showClock) {
    let topCursorY = height * 0.14;

    // Date banner
    ctx.fillStyle = theme.subtextColor;
    ctx.font = `600 ${Math.round(width * 0.038)}px ${fontFam}`;
    ctx.textAlign = 'center';
    const dateStr = targetDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
    ctx.fillText(dateStr, width / 2, topCursorY);

    topCursorY += height * 0.09;

    // Large Time
    ctx.fillStyle = theme.textColor;
    ctx.font = `700 ${Math.round(width * 0.22)}px ${fontFam}`;
    ctx.textAlign = 'center';

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    ctx.fillText(timeStr, width / 2, topCursorY);
  } else {
    // Wallpaper Safe-zone indicator (subtle hairline marker)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.28);
    ctx.lineTo(width * 0.8, height * 0.28);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 2. Countdown Display Positioning
  let cursorY = widgets.verticalPosition === 'lower_third' ? height * 0.48 : height * 0.35;

  // Countdown Card
  const cardMargin = width * 0.08;
  const cardWidth = width - cardMargin * 2;
  const cardHeight = height * 0.25;

  // Frosted Card Background
  ctx.fillStyle = theme.cardBg;
  roundRect(ctx, cardMargin, cursorY, cardWidth, cardHeight, 32);
  ctx.fill();

  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, cardMargin, cursorY, cardWidth, cardHeight, 32);
  ctx.stroke();

  // Card Header: Category & Deadline
  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${Math.round(width * 0.032)}px ${fontFam}`;
  ctx.textAlign = 'left';
  const categoryHeader = `// TARGET DEADLINE · ${deadline.category.toUpperCase()}`;
  ctx.fillText(categoryHeader, cardMargin + 36, cursorY + 48);

  // Project Title
  ctx.fillStyle = theme.textColor;
  ctx.font = `700 ${Math.round(width * 0.052)}px ${fontFam}`;
  const truncatedTitle = deadline.title.length > 28 ? deadline.title.slice(0, 26) + '...' : deadline.title;
  ctx.fillText(truncatedTitle, cardMargin + 36, cursorY + 98);

  // Countdown display based on format
  const countY = cursorY + 160;

  if (widgets.countdownFormat === 'days_only') {
    ctx.fillStyle = theme.textColor;
    ctx.font = `700 ${Math.round(width * 0.16)}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.fillText(String(timeRemaining.days), cardMargin + cardWidth / 2, countY + 45);

    ctx.fillStyle = theme.subtextColor;
    ctx.font = `600 ${Math.round(width * 0.03)}px ${fontFam}`;
    ctx.fillText('DAYS REMAINING TO TARGET', cardMargin + cardWidth / 2, countY + 85);
  } else if (widgets.countdownFormat === 'compact') {
    const compactText = `${String(timeRemaining.days).padStart(2, '0')}d : ${String(timeRemaining.hours).padStart(2, '0')}h : ${String(timeRemaining.minutes).padStart(2, '0')}m : ${String(timeRemaining.seconds).padStart(2, '0')}s`;
    ctx.fillStyle = theme.textColor;
    ctx.font = `700 ${Math.round(width * 0.065)}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.fillText(compactText, cardMargin + cardWidth / 2, countY + 55);
  } else {
    // Standard DHMS 4-column
    const numCols = 4;
    const colWidth = (cardWidth - 72) / numCols;
    const units = [
      { label: 'DAYS', val: String(timeRemaining.days).padStart(2, '0') },
      { label: 'HOURS', val: String(timeRemaining.hours).padStart(2, '0') },
      { label: 'MINUTES', val: String(timeRemaining.minutes).padStart(2, '0') },
      { label: 'SECONDS', val: String(timeRemaining.seconds).padStart(2, '0') },
    ];

    units.forEach((u, i) => {
      const colX = cardMargin + 36 + i * colWidth + colWidth / 2;

      // Number
      ctx.fillStyle = theme.textColor;
      ctx.font = `700 ${Math.round(width * 0.085)}px ${fontFam}`;
      ctx.textAlign = 'center';
      ctx.fillText(u.val, colX, countY + 45);

      // Label
      ctx.fillStyle = theme.subtextColor;
      ctx.font = `600 ${Math.round(width * 0.024)}px ${fontFam}`;
      ctx.fillText(u.label, colX, countY + 80);
    });
  }

  // Timeline Progress Bar at bottom of card
  if (widgets.showProgressRing) {
    const barY = cursorY + cardHeight - 24;
    const barW = cardWidth - 72;
    const barX = cardMargin + 36;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    roundRect(ctx, barX, barY, barW, 8, 4);
    ctx.fill();

    const progressRatio = Math.max(0.04, Math.min(1, timeRemaining.formattedPercentage / 100));
    ctx.fillStyle = theme.accentColor;
    roundRect(ctx, barX, barY, barW * progressRatio, 8, 4);
    ctx.fill();
  }

  // 3. Lower Section: Active Milestone Ticker
  cursorY = height * 0.67;

  if (widgets.showMilestone) {
    const nextMilestone = deadline.milestones.find((m) => !m.completed) || deadline.milestones[0];
    if (nextMilestone) {
      const msHeight = height * 0.12;

      ctx.fillStyle = theme.cardBg;
      roundRect(ctx, cardMargin, cursorY, cardWidth, msHeight, 24);
      ctx.fill();

      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.5;
      roundRect(ctx, cardMargin, cursorY, cardWidth, msHeight, 24);
      ctx.stroke();

      // Badge
      ctx.fillStyle = theme.accentColor;
      ctx.font = `700 ${Math.round(width * 0.028)}px ${fontFam}`;
      ctx.textAlign = 'left';
      ctx.fillText(`NEXT MILESTONE [${nextMilestone.pacingLabel}]`, cardMargin + 32, cursorY + 44);

      // Milestone Title
      ctx.fillStyle = theme.textColor;
      ctx.font = `600 ${Math.round(width * 0.038)}px ${fontFam}`;
      const msTitle = nextMilestone.title.length > 34 ? nextMilestone.title.slice(0, 32) + '...' : nextMilestone.title;
      ctx.fillText(msTitle, cardMargin + 32, cursorY + 88);
    }
  }

  // 4. Bottom Anchor: Motivational Mantra
  if (widgets.showMantra && deadline.mantra) {
    const bottomY = height * 0.88;
    ctx.fillStyle = theme.subtextColor;
    ctx.font = `italic 500 ${Math.round(width * 0.034)}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.fillText(`"${deadline.mantra}"`, width / 2, bottomY);
  }
}

/**
 * Draws Desktop / Widescreen Monitor Lock Screen layout
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
  const fontFam =
    theme.fontFamily === 'mono'
      ? '"JetBrains Mono", "Courier New", monospace'
      : theme.fontFamily === 'serif'
      ? '"Georgia", "Times New Roman", serif'
      : 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

  // Desktop Header
  ctx.fillStyle = theme.subtextColor;
  ctx.font = `600 ${Math.round(height * 0.026)}px ${fontFam}`;
  ctx.textAlign = 'left';
  ctx.fillText('// CHRONOLOCK STUDIO · WORKSPACE DEADLINE HUD', width * 0.08, height * 0.12);

  // Big Clock on Desktop
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  ctx.fillStyle = theme.textColor;
  ctx.font = `700 ${Math.round(height * 0.12)}px ${fontFam}`;
  ctx.fillText(timeStr, width * 0.08, height * 0.26);

  // Center Hero Countdown Card
  const cardX = width * 0.08;
  const cardY = height * 0.35;
  const cardW = width * 0.84;
  const cardH = height * 0.42;

  ctx.fillStyle = theme.cardBg;
  roundRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fill();

  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.stroke();

  // Project Header Inside Card
  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${Math.round(height * 0.024)}px ${fontFam}`;
  ctx.fillText(`COUNTDOWN TO TARGET · ${deadline.category.toUpperCase()}`, cardX + 48, cardY + 56);

  ctx.fillStyle = theme.textColor;
  ctx.font = `700 ${Math.round(height * 0.048)}px ${fontFam}`;
  ctx.fillText(deadline.title, cardX + 48, cardY + 110);

  // 4 Big Columns
  const countY = cardY + 160;
  const colW = (cardW - 96) / 4;
  const units = [
    { label: 'DAYS REMAINING', val: String(timeRemaining.days).padStart(2, '0') },
    { label: 'HOURS', val: String(timeRemaining.hours).padStart(2, '0') },
    { label: 'MINUTES', val: String(timeRemaining.minutes).padStart(2, '0') },
    { label: 'SECONDS', val: String(timeRemaining.seconds).padStart(2, '0') },
  ];

  units.forEach((u, i) => {
    const colCenterX = cardX + 48 + i * colW + colW / 2;

    ctx.fillStyle = theme.textColor;
    ctx.font = `700 ${Math.round(height * 0.11)}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.fillText(u.val, colCenterX, countY + 70);

    ctx.fillStyle = theme.subtextColor;
    ctx.font = `600 ${Math.round(height * 0.02)}px ${fontFam}`;
    ctx.fillText(u.label, colCenterX, countY + 110);
  });

  // Footer Milestone & Mantra
  ctx.textAlign = 'left';
  if (widgets.showMilestone) {
    const nextMilestone = deadline.milestones.find((m) => !m.completed) || deadline.milestones[0];
    if (nextMilestone) {
      ctx.fillStyle = theme.accentColor;
      ctx.font = `700 ${Math.round(height * 0.022)}px ${fontFam}`;
      ctx.fillText(`CURRENT SPRINT: ${nextMilestone.title} [${nextMilestone.pacingLabel}]`, width * 0.08, height * 0.86);
    }
  }

  if (widgets.showMantra && deadline.mantra) {
    ctx.fillStyle = theme.subtextColor;
    ctx.font = `italic 500 ${Math.round(height * 0.024)}px ${fontFam}`;
    ctx.textAlign = 'right';
    ctx.fillText(`"${deadline.mantra}"`, width * 0.92, height * 0.86);
  }
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
