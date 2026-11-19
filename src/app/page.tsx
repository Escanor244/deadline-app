'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Deadline, DeviceType, ThemeConfig, TimeRemaining, WidgetSettings } from '@/types';
import {
  loadAllDeadlines,
  loadActiveDeadline,
  saveActiveDeadline,
  saveAllDeadlines,
  deleteDeadline,
  loadSavedTheme,
  saveTheme,
  loadSavedDevice,
  saveDevice,
  loadSavedWidgets,
  saveWidgets,
} from '@/lib/storage';
import { createNewDeadline, calculateTimeRemaining } from '@/lib/smartPlanner';
import { renderLockScreenToCanvas, downloadCanvasWallpaper } from '@/lib/canvasRenderer';
import {
  checkDatabaseStatus,
  decodeDeadlineFromShareUrl,
  syncDeadlineToCloud,
  DatabaseStatus,
} from '@/lib/cloudSync';
import { Navbar } from '@/components/Navbar';
import { CountdownHero } from '@/components/Dashboard/CountdownHero';
import { WallpaperStudio } from '@/components/Studio/WallpaperStudio';
import { FullscreenMode } from '@/components/Studio/FullscreenMode';
import { DeadlineSetup } from '@/components/Planner/DeadlineSetup';
import { MilestoneList } from '@/components/Planner/MilestoneList';
import { GeminiCoPilot } from '@/components/Planner/GeminiCoPilot';
import { CalendarSync } from '@/components/Export/CalendarSync';
import { CloudDataManager } from '@/components/Storage/CloudDataManager';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'studio' | 'calendar'>('planner');
  const [allDeadlines, setAllDeadlines] = useState<Deadline[]>([]);
  const [deadline, setDeadlineState] = useState<Deadline>(() => createNewDeadline());
  const [theme, setThemeState] = useState<ThemeConfig>(loadSavedTheme);
  const [deviceType, setDeviceTypeState] = useState<DeviceType>(loadSavedDevice);
  const [widgets, setWidgetsState] = useState<WidgetSettings>(loadSavedWidgets);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: false,
    configured: false,
    mode: 'local_storage',
    message: 'Checking storage...',
  });

  const [currentTimeStr, setCurrentTimeStr] = useState<string>('09:41');
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(deadline.targetDate, deadline.createdAt)
  );

  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initial load & URL state handling
  useEffect(() => {
    setMounted(true);
    const loadedAll = loadAllDeadlines();
    let active = loadActiveDeadline();

    // Check if shared via URL (?share=...)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shareParam = urlParams.get('share');
      if (shareParam) {
        const decoded = decodeDeadlineFromShareUrl(shareParam);
        if (decoded) {
          active = decoded;
          saveActiveDeadline(decoded);
          loadedAll.unshift(decoded);
        }
      }
    }

    setAllDeadlines(loadedAll);
    setDeadlineState(active);
    setThemeState(loadSavedTheme());
    setDeviceTypeState(loadSavedDevice());
    setWidgetsState(loadSavedWidgets());

    // Check database status
    checkDatabaseStatus().then((status) => {
      setDbStatus(status);
      if (status.connected && active) {
        syncDeadlineToCloud(active);
      }
    });
  }, []);

  // Update clock & countdown ticker every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setTimeRemaining(calculateTimeRemaining(deadline.targetDate, deadline.createdAt));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline.targetDate, deadline.createdAt]);

  // Wrapped State Setters with localStorage persistence & cloud sync
  const setDeadline = (newDl: Deadline) => {
    setDeadlineState(newDl);
    saveActiveDeadline(newDl);
    setAllDeadlines(loadAllDeadlines());
    if (dbStatus.connected) {
      syncDeadlineToCloud(newDl);
    }
  };

  const handleSelectDeadline = (id: string) => {
    const found = allDeadlines.find((d) => d.id === id);
    if (found) {
      setDeadlineState(found);
      saveActiveDeadline(found);
    }
  };

  const handleCreateNewDeadline = () => {
    const fresh = createNewDeadline('New Objective', 'launch', 14);
    saveActiveDeadline(fresh);
    const updated = loadAllDeadlines();
    setAllDeadlines(updated);
    setDeadlineState(fresh);
    setActiveTab('planner');
    if (dbStatus.connected) {
      syncDeadlineToCloud(fresh);
    }
  };

  const handleDeleteDeadline = (id: string) => {
    const remaining = deleteDeadline(id);
    setAllDeadlines(remaining);
    setDeadlineState(remaining[0]);
  };

  const handleImportDeadlines = (imported: Deadline[]) => {
    saveAllDeadlines(imported);
    setAllDeadlines(imported);
    if (imported.length > 0) {
      saveActiveDeadline(imported[0]);
      setDeadlineState(imported[0]);
    }
  };

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
  };

  const setDeviceType = (newDev: DeviceType) => {
    setDeviceTypeState(newDev);
    saveDevice(newDev);
  };

  const setWidgets = (newW: WidgetSettings) => {
    setWidgetsState(newW);
    saveWidgets(newW);
  };

  // High-Resolution Retina Wallpaper Export Handler
  const handleExportWallpaper = async () => {
    if (!hiddenCanvasRef.current) return;
    setIsExporting(true);

    try {
      await renderLockScreenToCanvas(
        hiddenCanvasRef.current,
        deviceType,
        deadline,
        theme,
        widgets,
        timeRemaining
      );

      const cleanTitle = deadline.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `kairos-${deviceType}-${cleanTitle}-wallpaper.png`;
      downloadCanvasWallpaper(hiddenCanvasRef.current, filename);
    } catch (err) {
      console.error('Wallpaper export failed', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Kairos Command Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Hidden high-res canvas for retina export */}
      <canvas ref={hiddenCanvasRef} className="hidden pointer-events-none" />

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEnterFullscreen={() => setIsFullscreen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        isCloudConnected={dbStatus.connected}
        deadlineTitle={deadline.title}
        daysRemaining={timeRemaining.days}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Full-Width Telemetry Countdown Hero Card */}
        <CountdownHero
          deadline={deadline}
          timeRemaining={timeRemaining}
          onEnterFullscreen={() => setIsFullscreen(true)}
          onGoToStudio={() => setActiveTab('studio')}
          onGoToCalendar={() => setActiveTab('calendar')}
          onCreateNewDeadline={handleCreateNewDeadline}
          allDeadlines={allDeadlines}
          onSelectDeadline={handleSelectDeadline}
        />

        {/* TAB 1: MILESTONES & ROADMAP (Default Main Workspace) */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            <DeadlineSetup
              deadline={deadline}
              setDeadline={setDeadline}
              allDeadlines={allDeadlines}
              onSelectDeadline={handleSelectDeadline}
              onCreateNewDeadline={handleCreateNewDeadline}
              onDeleteDeadline={handleDeleteDeadline}
            />
            <MilestoneList deadline={deadline} setDeadline={setDeadline} />
            <GeminiCoPilot deadline={deadline} setDeadline={setDeadline} />
          </div>
        )}

        {/* TAB 2: WALLPAPER & LOCK SCREEN STUDIO */}
        {activeTab === 'studio' && (
          <WallpaperStudio
            deadline={deadline}
            theme={theme}
            setTheme={setTheme}
            deviceType={deviceType}
            setDeviceType={setDeviceType}
            widgets={widgets}
            setWidgets={setWidgets}
            timeRemaining={timeRemaining}
            currentTimeStr={currentTimeStr}
            onExportWallpaper={handleExportWallpaper}
            isExporting={isExporting}
            onEnterFullscreen={() => setIsFullscreen(true)}
          />
        )}

        {/* TAB 3: CALENDAR & ALERTS */}
        {activeTab === 'calendar' && (
          <div className="max-w-4xl mx-auto">
            <CalendarSync deadline={deadline} />
          </div>
        )}
      </main>

      {/* Cloud & Data Persistence Modal */}
      <CloudDataManager
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        deadlines={allDeadlines}
        activeDeadline={deadline}
        dbStatus={dbStatus}
        onImportDeadlines={handleImportDeadlines}
      />

      {/* Fullscreen HUD Mode */}
      {isFullscreen && (
        <FullscreenMode
          deadline={deadline}
          theme={theme}
          widgets={widgets}
          timeRemaining={timeRemaining}
          currentTimeStr={currentTimeStr}
          onClose={() => setIsFullscreen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 font-mono">
        <p>
          KAIROS STUDIO // High-Precision Reverse Planning & Countdown Lock Screen Generator
        </p>
      </footer>
    </div>
  );
}
