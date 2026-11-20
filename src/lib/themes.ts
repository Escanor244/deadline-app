import { ThemeConfig } from '@/types';

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'citron-mint',
    name: 'Citron Mint Glass',
    tagline: 'Vibrant lime-to-cyan dither gradient with porcelain frosted glass card.',
    bgType: 'gradient',
    bgPrimary: '#d2f871', // Vibrant electric lime / chartreuse
    bgSecondary: '#86efac', // Soft spring mint
    bgTertiary: '#67e8f9', // Cyan seafoam
    accentColor: '#15803d', // Forest emerald accent
    textColor: '#0f172a', // Deep slate for sharp contrast on porcelain
    subtextColor: '#475569', // Slate-600
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'sans',
    grain: true,
    isLightCard: true,
  },
  {
    id: 'nordic-paper',
    name: 'Nordic Paper',
    tagline: 'Warm ceramic ivory with crisp Swiss typography and subtle paper grain.',
    bgType: 'solid',
    bgPrimary: '#f5f3ec',
    bgSecondary: '#e6e2d6',
    accentColor: '#c2410c', // Warm terracotta
    textColor: '#18181b', // Zinc-900
    subtextColor: '#52525b', // Zinc-600
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    fontFamily: 'sans',
    grain: true,
    isLightCard: true,
  },
  {
    id: 'sunset-peach',
    name: 'Sunset Aura',
    tagline: 'Warm blush coral, golden apricot, and soft rose frosted glass.',
    bgType: 'gradient',
    bgPrimary: '#fda4af', // Coral rose
    bgSecondary: '#fcd34d', // Warm apricot
    bgTertiary: '#f43f5e',
    accentColor: '#be123c', // Crimson rose
    textColor: '#0f172a',
    subtextColor: '#475569',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'sans',
    grain: true,
    isLightCard: true,
  },
  {
    id: 'deep-indigo',
    name: 'Tokyo Indigo',
    tagline: 'Deep midnight sapphire with luminous violet frosted glass.',
    bgType: 'gradient',
    bgPrimary: '#090d16',
    bgSecondary: '#1e1b4b',
    accentColor: '#a78bfa', // Luminous violet
    textColor: '#f8fafc',
    subtextColor: '#cbd5e1',
    cardBg: 'rgba(30, 27, 75, 0.75)',
    cardBorder: 'rgba(167, 139, 250, 0.25)',
    fontFamily: 'sans',
    grain: true,
    isLightCard: false,
  },
  {
    id: 'obsidian',
    name: 'Obsidian Minimal',
    tagline: 'Minimalist titanium charcoal for dark mode purists.',
    bgType: 'solid',
    bgPrimary: '#09090b',
    bgSecondary: '#141417',
    accentColor: '#10b981', // Signal Emerald
    textColor: '#ffffff',
    subtextColor: '#a1a1aa',
    cardBg: 'rgba(24, 24, 27, 0.82)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    fontFamily: 'sans',
    grain: true,
    isLightCard: false,
  },
  {
    id: 'custom',
    name: 'Custom Darkroom',
    tagline: 'Upload your own wallpaper with legibility tinting and blur.',
    bgType: 'image',
    bgPrimary: '#000000',
    bgSecondary: '#111111',
    accentColor: '#38bdf8', // Sky
    textColor: '#ffffff',
    subtextColor: '#e2e8f0',
    cardBg: 'rgba(0, 0, 0, 0.65)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    fontFamily: 'sans',
    grain: true,
    isLightCard: false,
    imageBlur: 4,
    imageDim: 45,
  },
];
