'use client';

import React, { useState, useRef } from 'react';
import { Deadline } from '@/types';
import {
  DatabaseStatus,
  exportDeadlinesToJson,
  importDeadlinesFromJson,
  encodeDeadlineForShareUrl,
  syncDeadlineToCloud,
} from '@/lib/cloudSync';
import { Database, Download, Upload, Share2, Check, X, Cloud, HardDrive, AlertCircle, Copy } from 'lucide-react';

interface CloudDataManagerProps {
  isOpen: boolean;
  onClose: () => void;
  deadlines: Deadline[];
  activeDeadline: Deadline;
  dbStatus: DatabaseStatus;
  onImportDeadlines: (imported: Deadline[]) => void;
}

export const CloudDataManager: React.FC<CloudDataManagerProps> = ({
  isOpen,
  onClose,
  deadlines,
  activeDeadline,
  dbStatus,
  onImportDeadlines,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    exportDeadlinesToJson(deadlines);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importDeadlinesFromJson(file);
      onImportDeadlines(imported);
      alert(`Successfully imported ${imported.length} deadlines!`);
      onClose();
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to import JSON file');
    }
  };

  const handleCopyShareLink = () => {
    const encoded = encodeDeadlineForShareUrl(activeDeadline);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}?share=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMsg(null);
    const success = await syncDeadlineToCloud(activeDeadline);
    setIsSyncing(false);
    if (success) {
      setSyncMsg('Synced active deadline to MongoDB Atlas successfully!');
    } else {
      setSyncMsg('Could not sync to cloud. MongoDB may not be configured.');
    }
    setTimeout(() => setSyncMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Data Persistence & Cloud Sync
              </h2>
              <p className="text-xs text-zinc-400">
                Hybrid Storage: MongoDB Atlas, LocalStorage, and JSON File Backup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Database Status Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 ${
            dbStatus.connected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}
        >
          {dbStatus.connected ? (
            <Cloud className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <HardDrive className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wide">
                {dbStatus.connected ? '● MongoDB Atlas Connected' : '○ Local Storage Mode (Offline / Zero-Config)'}
              </span>
              {dbStatus.database && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {dbStatus.database}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {dbStatus.connected
                ? 'Your deadlines auto-sync to MongoDB Atlas cloud. Multi-device persistence is active.'
                : 'Zero-config mode active. Data persists in browser storage. To connect MongoDB on Vercel, simply set MONGODB_URI in your Vercel project settings.'}
            </p>

            {dbStatus.connected && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="mt-2.5 px-3 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition"
              >
                {isSyncing ? 'Syncing...' : 'Sync Active Deadline Now'}
              </button>
            )}

            {syncMsg && (
              <span className="block text-xs font-mono text-emerald-400 mt-2">
                {syncMsg}
              </span>
            )}
          </div>
        </div>

        {/* 1-Click JSON Backup & Restore */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
            JSON File Backup & Restore (Zero-Cloud)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportJson}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-left transition flex flex-col justify-between"
            >
              <div className="flex items-center space-x-2 text-zinc-200">
                <Download className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold">Export JSON</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Download all {deadlines.length} deadlines as backup file
              </p>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-left transition flex flex-col justify-between"
            >
              <div className="flex items-center space-x-2 text-zinc-200">
                <Upload className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Import JSON</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Restore deadlines from backup file
              </p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Cross-Device Shareable Link */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cross-Device Shareable Link</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              State Encoded in URL
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Generate a permanent link containing "{activeDeadline.title}". Anyone opening it on their phone or laptop instantly loads this exact countdown lock screen!
          </p>

          <button
            onClick={handleCopyShareLink}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center space-x-2 border border-zinc-700"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Share Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Shareable URL to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
