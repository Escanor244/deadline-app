'use client';

import React, { useState } from 'react';
import { Deadline, DeadlineCategory } from '@/types';
import { createNewDeadline, generateBackwardMilestones } from '@/lib/smartPlanner';
import { Target, RefreshCw, Plus, Trash2, FolderPlus } from 'lucide-react';

interface DeadlineSetupProps {
  deadline: Deadline;
  setDeadline: (deadline: Deadline) => void;
  allDeadlines: Deadline[];
  onSelectDeadline: (id: string) => void;
  onCreateNewDeadline: () => void;
  onDeleteDeadline: (id: string) => void;
}

export const DeadlineSetup: React.FC<DeadlineSetupProps> = ({
  deadline,
  setDeadline,
  allDeadlines,
  onSelectDeadline,
  onCreateNewDeadline,
  onDeleteDeadline,
}) => {
  const toLocalInputValue = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const pad = (n: number) => (n < 10 ? '0' + n : n);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const handleDateChange = (val: string) => {
    const iso = new Date(val).toISOString();
    setDeadline({
      ...deadline,
      targetDate: iso,
    });
  };

  const handleAutoSchedule = () => {
    const autoMilestones = generateBackwardMilestones(
      deadline.title,
      deadline.targetDate
    );
    setDeadline({
      ...deadline,
      milestones: autoMilestones,
    });
  };

  const CATEGORIES: { id: DeadlineCategory; label: string }[] = [
    { id: 'launch', label: 'Product Launch / MVP' },
    { id: 'engineering', label: 'Engineering / Software' },
    { id: 'academic', label: 'Academic / Thesis' },
    { id: 'career', label: 'Career / Job Applications' },
    { id: 'creative', label: 'Creative / Portfolio' },
    { id: 'fitness', label: 'Fitness / Athletic' },
    { id: 'personal', label: 'Personal Goal' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header & Active Deadline Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Target Deadline Setup
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Synced with local data/deadlines.json
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Define your goal details below. Edits auto-save immediately to your local repository database.
          </p>
        </div>

        {/* Multi-Deadline Controls */}
        <div className="flex items-center space-x-2">
          {allDeadlines.length > 1 && (
            <select
              value={deadline.id}
              onChange={(e) => onSelectDeadline(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white outline-none cursor-pointer"
            >
              {allDeadlines.map((dl) => (
                <option key={dl.id} value={dl.id} className="bg-zinc-900">
                  {dl.title.length > 20 ? dl.title.slice(0, 18) + '...' : dl.title}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={onCreateNewDeadline}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition"
            title="Create a new goal or deadline"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>

          {allDeadlines.length > 1 && (
            <button
              type="button"
              onClick={() => onDeleteDeadline(deadline.id)}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition"
              title="Delete this deadline"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
            Deadline / Project Name
          </label>
          <input
            type="text"
            value={deadline.title}
            onChange={(e) => setDeadline({ ...deadline, title: e.target.value })}
            placeholder="e.g. Launch AI SaaS V1, Fall Final Exams, Senior Capstone"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
            Category
          </label>
          <select
            value={deadline.category}
            onChange={(e) =>
              setDeadline({
                ...deadline,
                category: e.target.value as DeadlineCategory,
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-zinc-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Target Date & Time */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300">
              Target Date & Time
            </label>
            <button
              type="button"
              onClick={handleAutoSchedule}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              title="Recalculate reverse milestones based on this date"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Auto-Pace Milestones</span>
            </button>
          </div>
          <input
            type="datetime-local"
            value={toLocalInputValue(deadline.targetDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Motivational Mantra */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5 flex items-center justify-between">
            <span>Lock Screen Mantra</span>
            <span className="text-[10px] text-zinc-500">Appears on wallpaper</span>
          </label>
          <input
            type="text"
            value={deadline.mantra}
            onChange={(e) => setDeadline({ ...deadline, mantra: e.target.value })}
            placeholder="e.g. Focus on the finish line. No excuses."
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Goal Objective */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
          Objective & Success Criteria
        </label>
        <textarea
          rows={2}
          value={deadline.description}
          onChange={(e) =>
            setDeadline({ ...deadline, description: e.target.value })
          }
          placeholder="What specific outcome defines completion? (e.g. Submit paper with bibliography, Deploy to production with 10 beta users)"
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>
    </div>
  );
};
