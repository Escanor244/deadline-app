'use client';

import React, { useState, useEffect } from 'react';
import { Deadline, DeadlineCategory } from '@/types';
import { generateBackwardMilestones } from '@/lib/smartPlanner';
import { Plus, X, Calendar, Target, Sparkles, AlertCircle } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newDeadline: Deadline) => void;
}

const CATEGORIES: { id: DeadlineCategory; label: string }[] = [
  { id: 'launch', label: 'Product Launch / MVP' },
  { id: 'engineering', label: 'Engineering / Software' },
  { id: 'academic', label: 'Academic / Thesis' },
  { id: 'career', label: 'Career / Job Applications' },
  { id: 'creative', label: 'Creative / Portfolio' },
  { id: 'fitness', label: 'Fitness / Athletic' },
  { id: 'personal', label: 'Personal Goal' },
];

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const getDefaultTargetDate = (daysAhead: number = 14) => {
    const d = new Date(Date.now() + daysAhead * 86400000);
    d.setHours(23, 59, 0, 0);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DeadlineCategory>('launch');
  const [targetDateStr, setTargetDateStr] = useState(getDefaultTargetDate(14));
  const [mantra, setMantra] = useState('');
  const [description, setDescription] = useState('');
  const [autoMilestones, setAutoMilestones] = useState(true);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('launch');
      setTargetDateStr(getDefaultTargetDate(14));
      setMantra('');
      setDescription('');
      setAutoMilestones(true);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickDays = (days: number) => {
    setTargetDateStr(getDefaultTargetDate(days));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Please enter a goal or project title.');
      return;
    }

    const targetIso = new Date(targetDateStr).toISOString();
    const nowIso = new Date().toISOString();

    const newDeadline: Deadline = {
      id: `dl-${Date.now()}`,
      title: cleanTitle,
      category,
      targetDate: targetIso,
      createdAt: nowIso,
      description:
        description.trim() ||
        'Ship on schedule with precision and uncompromising standards.',
      mantra: mantra.trim() || 'Focus on the finish line.',
      milestones: [],
    };

    if (autoMilestones) {
      newDeadline.milestones = generateBackwardMilestones(cleanTitle, targetIso);
    }

    onCreate(newDeadline);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>Create New Goal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  NEW
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enter your goal details. We will compute reverse milestones and build your lock screen countdown.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
              Goal / Project Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Master's Thesis Defense, Launch AI SaaS V1, Run Half Marathon"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DeadlineCategory)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-900">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Date & Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-bold uppercase text-zinc-300">
                Target Date & Time <span className="text-emerald-400">*</span>
              </label>
              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400">
                <span>Quick:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDays(7)}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  +7d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDays(14)}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  +14d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDays(30)}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  +30d
                </button>
              </div>
            </div>
            <input
              type="datetime-local"
              required
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Lock Screen Mantra */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Lock Screen Mantra</span>
              <span className="text-[10px] text-zinc-500">Visible on wallpaper</span>
            </label>
            <input
              type="text"
              value={mantra}
              onChange={(e) => setMantra(e.target.value)}
              placeholder="e.g. Focus on the finish line. Do not compromise."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Objective / Description */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
              Success Criteria / Objective (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specific outcome that defines success (e.g. Final code pushed, all 50 test cases green)"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Auto Milestones Checkbox */}
          <div className="flex items-center space-x-2.5 pt-1">
            <input
              type="checkbox"
              id="autoMilestones"
              checked={autoMilestones}
              onChange={(e) => setAutoMilestones(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="autoMilestones"
              className="text-xs text-zinc-300 cursor-pointer select-none"
            >
              Automatically generate 4 backward pacing milestones (25%, 60%, 85%, 98%)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Create Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
