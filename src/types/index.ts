export type DeviceType = 'iphone16' | 'pixel9' | 'desktop';

export type DeadlineCategory = 'launch' | 'engineering' | 'academic' | 'career' | 'creative' | 'fitness' | 'personal';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  completed: boolean;
  pacingLabel: string; // e.g. "Phase 1 · T-14d", "Checkpoint · T-48h"
  estimatedHours: number;
}

export interface Deadline {
  id: string;
  title: string;
  category: DeadlineCategory;
  targetDate: string; // ISO string
  createdAt: string;
  description: string;
  mantra: string;
  milestones: Milestone[];
}

export type ThemeId = 'obsidian' | 'terminal' | 'aura' | 'bauhaus' | 'zen' | 'custom';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  bgType: 'solid' | 'gradient' | 'procedural' | 'image';
  bgPrimary: string;
  bgSecondary: string;
  accentColor: string;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  cardBorder: string;
  fontFamily: 'mono' | 'sans' | 'serif';
  grain: boolean;
  customImageUri?: string;
  imageBlur?: number; // 0 to 20
  imageDim?: number;  // 0 to 100
}

export interface WidgetSettings {
  displayMode: 'wallpaper' | 'standalone_hud'; // 'wallpaper' leaves top clear for phone's real clock; 'standalone_hud' renders simulated clock
  showClock: boolean;
  showCountdown: boolean;
  countdownFormat: 'dhms' | 'compact' | 'days_only';
  verticalPosition: 'center' | 'lower_third'; // position of countdown widget on phone
  showMilestone: boolean;
  showProgressRing: boolean;
  showMantra: boolean;
  showDeviceDecorations: boolean; // Dynamic Island / Status Bar
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formattedPercentage: number;
}
