'use client';

import React, { useState } from 'react';
import { Deadline } from '@/types';
import { generateIcsCalendar, downloadIcsFile, createGoogleCalendarUrl } from '@/lib/calendar';
import { Calendar, Download, ExternalLink, Bell, Check, Clock, AlertTriangle } from 'lucide-react';

interface CalendarSyncProps {
  deadline: Deadline;
}

export const CalendarSync: React.FC<CalendarSyncProps> = ({ deadline }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [notificationState, setNotificationState] = useState<string>('default');

  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendar(deadline);
    const filename = `${deadline.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-reminders.ics`;
    downloadIcsFile(filename, icsContent);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
    if (permission === 'granted') {
      new Notification('ChronoLock Reminders Activated', {
        body: `Daily countdown alerts enabled for ${deadline.title}. Stay focused!`,
      });
    }
  };

  const mainGoogleCalUrl = createGoogleCalendarUrl(
    `🔥 FINAL DEADLINE: ${deadline.title}`,
    deadline.targetDate,
    `${deadline.description}\n\nLock Screen Mantra: "${deadline.mantra}"`
  );

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Calendar Sync & Deadline Reminders</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Zero backend required. Export milestone alerts straight to Apple Calendar, Google Calendar, or Outlook.
            </p>
          </div>

          <button
            onClick={handleDownloadIcs}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition shadow-lg"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded .ics File!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .ICS Calendar</span>
              </>
            )}
          </button>
        </div>

        {/* Sync Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Method 1: Apple / Outlook / Google .ICS */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-200">
              <Download className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold uppercase">
                1-Click iCalendar (.ics) Bundle
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Contains the final deadline and all {deadline.milestones.length} milestones. Includes automated 24-hour and 2-hour pre-deadline alarm alerts.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
              <span>Compatible with:</span>
              <span className="text-zinc-300">Apple Calendar</span>
              <span>·</span>
              <span className="text-zinc-300">Google Cal</span>
              <span>·</span>
              <span className="text-zinc-300">Outlook</span>
            </div>
            <button
              onClick={handleDownloadIcs}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition border border-zinc-700"
            >
              Export All Milestones (.ics)
            </button>
          </div>

          {/* Method 2: Direct Google Calendar Web Link */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-200">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase">
                Direct Google Calendar Link
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Open Google Calendar in your web browser with the event details, description, and deadline pre-populated.
            </p>
            <div className="pt-3">
              <a
                href={mainGoogleCalUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition border border-zinc-700 flex items-center justify-center space-x-1.5"
              >
                <span>Add Deadline to Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Browser Push Reminder Notification */}
        <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                Browser Check-In Notifications
              </p>
              <p className="text-[11px] text-zinc-400">
                Receive countdown alerts in your browser when this tab is open or pinned.
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestNotifications}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 transition"
          >
            {notificationState === 'granted'
              ? '✓ Notifications Enabled'
              : 'Enable Notifications'}
          </button>
        </div>
      </div>

      {/* Individual Milestone Calendar Links */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-zinc-300">
          Individual Milestone Calendar Links
        </h3>

        <div className="space-y-2">
          {deadline.milestones.map((m) => {
            const calUrl = createGoogleCalendarUrl(
              `⚡ [${m.pacingLabel}] ${m.title}`,
              m.dueDate,
              `${m.description}\n\nProject: ${deadline.title}`,
              m.estimatedHours || 1
            );

            return (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      {m.pacingLabel}
                    </span>
                    <span className="text-xs font-medium text-zinc-200">
                      {m.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Due: {new Date(m.dueDate).toLocaleString()}
                  </span>
                </div>

                <a
                  href={calUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium transition flex items-center space-x-1"
                >
                  <span>Add to GCal</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
