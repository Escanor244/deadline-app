'use client';

import React, { useRef } from 'react';
import { ThemeConfig, ThemeId } from '@/types';
import { THEME_PRESETS } from '@/lib/themes';
import { Upload, Sliders, Sparkles, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  setTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (preset: ThemeConfig) => {
    // Preserve custom image if switching back to custom
    if (preset.id === 'custom' && currentTheme.customImageUri) {
      setTheme({
        ...preset,
        customImageUri: currentTheme.customImageUri,
        imageBlur: currentTheme.imageBlur ?? 4,
        imageDim: currentTheme.imageDim ?? 40,
      });
    } else {
      setTheme(preset);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const uri = event.target?.result as string;
      const customPreset = THEME_PRESETS.find((t) => t.id === 'custom') || currentTheme;
      setTheme({
        ...customPreset,
        customImageUri: uri,
        id: 'custom',
      });
    };
    reader.readAsDataURL(file);
  };

  const updateCustomParam = (key: 'imageBlur' | 'imageDim', value: number) => {
    setTheme({
      ...currentTheme,
      [key]: value,
    });
  };

  const ACCENT_COLORS = [
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Rose', hex: '#f43f5e' },
    { label: 'Cyan', hex: '#06b6d4' },
    { label: 'Violet', hex: '#8b5cf6' },
    { label: 'White', hex: '#ffffff' },
  ];

  return (
    <div className="space-y-6">
      {/* Aesthetic Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase">
            Aesthetic Archetype
          </label>
          <span className="text-[11px] text-zinc-500">6 anti-slop styles</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected = currentTheme.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500/60 bg-emerald-500/10 shadow-sm'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <span className="text-xs font-semibold text-zinc-200">
                      {preset.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 line-clamp-1 leading-snug">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Image Darkroom Controls (if Custom is chosen) */}
      {currentTheme.id === 'custom' && (
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Wallpaper Darkroom</span>
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition"
            >
              Choose Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {currentTheme.customImageUri ? (
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Image Blur (Focus)</span>
                  <span className="font-mono">{currentTheme.imageBlur ?? 4}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={currentTheme.imageBlur ?? 4}
                  onChange={(e) => updateCustomParam('imageBlur', Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Legibility Dimming</span>
                  <span className="font-mono">{currentTheme.imageDim ?? 40}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={currentTheme.imageDim ?? 40}
                  onChange={(e) => updateCustomParam('imageDim', Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-zinc-700 rounded-lg p-5 text-center cursor-pointer hover:border-zinc-500 transition"
            >
              <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
              <p className="text-xs text-zinc-400">
                Upload custom art or Gemini wallpaper
              </p>
              <span className="text-[10px] text-zinc-600">
                PNG, JPG, WebP supported
              </span>
            </div>
          )}
        </div>
      )}

      {/* Accent Color Swatches */}
      <div>
        <label className="block text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase mb-2">
          Accent Highlight
        </label>
        <div className="flex items-center space-x-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => setTheme({ ...currentTheme, accentColor: color.hex })}
              className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                currentTheme.accentColor === color.hex
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.label}
            />
          ))}
          <input
            type="color"
            value={currentTheme.accentColor}
            onChange={(e) => setTheme({ ...currentTheme, accentColor: e.target.value })}
            className="w-7 h-7 rounded-full bg-transparent cursor-pointer border border-zinc-700 ml-1"
            title="Custom Hex Color"
          />
        </div>
      </div>
    </div>
  );
};
