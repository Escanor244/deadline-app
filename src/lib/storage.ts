import { Deadline, DeviceType, ThemeConfig, WidgetSettings } from '@/types';
import { createNewDeadline } from './smartPlanner';
import { THEME_PRESETS } from './themes';

const STORAGE_KEYS = {
  DEADLINES_LIST: 'kairos_deadlines_list',
  ACTIVE_DEADLINE_ID: 'kairos_active_deadline_id',
  THEME: 'kairos_active_theme',
  DEVICE: 'kairos_selected_device',
  WIDGETS: 'kairos_widget_settings',
  GEMINI_KEY: 'kairos_gemini_api_key',
};

export const DEFAULT_WIDGETS: WidgetSettings = {
  displayMode: 'wallpaper', // 'wallpaper' leaves top clear for phone's real clock
  showClock: true,
  showCountdown: true,
  countdownFormat: 'dhms',
  verticalPosition: 'center',
  showMilestone: true,
  showProgressRing: true,
  showMantra: true,
  showDeviceDecorations: true,
};

export function loadAllDeadlines(): Deadline[] {
  if (typeof window === 'undefined') return [createNewDeadline()];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEADLINES_LIST);
    if (!raw) {
      const initial = [createNewDeadline()];
      saveAllDeadlines(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [createNewDeadline()];
  } catch {
    return [createNewDeadline()];
  }
}

export function saveAllDeadlines(deadlines: Deadline[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DEADLINES_LIST, JSON.stringify(deadlines));
  } catch {
    // Ignore storage quota
  }
}

export function loadActiveDeadline(): Deadline {
  const all = loadAllDeadlines();
  if (typeof window === 'undefined') return all[0];
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_DEADLINE_ID);
    const found = all.find((d) => d.id === activeId);
    return found || all[0];
  } catch {
    return all[0];
  }
}

export const loadSavedDeadline = loadActiveDeadline;
export const saveDeadline = saveActiveDeadline;

export function saveActiveDeadline(deadline: Deadline): void {
  const all = loadAllDeadlines();
  const index = all.findIndex((d) => d.id === deadline.id);
  let updated: Deadline[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = deadline;
  } else {
    updated = [deadline, ...all];
  }
  saveAllDeadlines(updated);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DEADLINE_ID, deadline.id);
  }
}

export function deleteDeadline(id: string): Deadline[] {
  const all = loadAllDeadlines();
  const filtered = all.filter((d) => d.id !== id);
  const remaining = filtered.length > 0 ? filtered : [createNewDeadline()];
  saveAllDeadlines(remaining);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DEADLINE_ID, remaining[0].id);
  }
  return remaining;
}

export function loadSavedTheme(): ThemeConfig {
  if (typeof window === 'undefined') return THEME_PRESETS[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (!raw) return THEME_PRESETS[0];
    return JSON.parse(raw);
  } catch {
    return THEME_PRESETS[0];
  }
}

export function saveTheme(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  } catch {
    // Ignore
  }
}

export function loadSavedDevice(): DeviceType {
  if (typeof window === 'undefined') return 'iphone16';
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEVICE);
    if (raw === 'pixel9' || raw === 'desktop' || raw === 'iphone16') return raw;
    return 'iphone16';
  } catch {
    return 'iphone16';
  }
}

export function saveDevice(device: DeviceType): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DEVICE, device);
  } catch {
    // Ignore
  }
}

export function loadSavedWidgets(): WidgetSettings {
  if (typeof window === 'undefined') return DEFAULT_WIDGETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WIDGETS);
    if (!raw) return DEFAULT_WIDGETS;
    return { ...DEFAULT_WIDGETS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_WIDGETS;
  }
}

export function saveWidgets(widgets: WidgetSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(widgets));
  } catch {
    // Ignore
  }
}

export function loadGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
  } catch {
    return '';
  }
}

export function saveGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
  } catch {
    // Ignore
  }
}
