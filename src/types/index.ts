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

export interface ScheduleEvent {
  id: string;
  time: string; // e.g. "9:30 AM"
  title: string; // e.g. "Team standup"
}

export interface DailyTask {
  id: string;
  title: string; // e.g. "Send report"
  completed: boolean;
}

export interface WeatherInfo {
  temperature: string; // e.g. "72°"
  condition: string; // e.g. "partly cloudy"
  location: string; // e.g. "Greenpoint, Brooklyn"
  forecastNote: string; // e.g. "Light rain likely after 6PM, bring an umbrella"
}

export interface BriefingProfile {
  userName: string; // e.g. "Alex"
  greetingPrefix?: string; // e.g. "Good morning"
  weather: WeatherInfo;
  events: ScheduleEvent[];
  tasks: DailyTask[];
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
  briefing?: BriefingProfile;
}

export type ThemeId =
  | 'citron-mint'
  | 'nordic-paper'
  | 'sunset-peach'
  | 'deep-indigo'
  | 'obsidian'
  | 'terminal'
  | 'aura'
  | 'bauhaus'
  | 'zen'
  | 'custom';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  bgType: 'solid' | 'gradient' | 'procedural' | 'image';
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary?: string;
  accentColor: string;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  cardBorder: string;
  fontFamily: 'mono' | 'sans' | 'serif';
  grain: boolean;
  isLightCard?: boolean;
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
  showGreeting: boolean;
  showWeather: boolean;
  showEvents: boolean;
  showTasks: boolean;
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
