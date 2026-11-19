'use client';

import React, { useState } from 'react';
import { Deadline, Milestone } from '@/types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Clock, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface MilestoneListProps {
  deadline: Deadline;
  setDeadline: (deadline: Deadline) => void;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({
  deadline,
  setDeadline,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newHours, setNewHours] = useState(2);
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleMilestone = (id: string) => {
    const updated = deadline.milestones.map((m) => {
      if (m.id === id) {
        const nextState = !m.completed;
        if (nextState) {
          // Trigger crisp celebratory confetti
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#34d399', '#ffffff'],
          });
        }
        return { ...m, completed: nextState };
      }
      return m;
    });

    setDeadline({
      ...deadline,
      milestones: updated,
    });
  };

  const deleteMilestone = (id: string) => {
    setDeadline({
      ...deadline,
      milestones: deadline.milestones.filter((m) => m.id !== id),
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Default due date: midpoint between now and target
    const now = Date.now();
    const target = new Date(deadline.targetDate).getTime();
    const defaultDue = new Date(now + (target - now) * 0.5).toISOString();

    const newMs: Milestone = {
      id: `ms-${Date.now()}`,
      title: newTitle.trim(),
      description: 'Custom milestone checkpoint',
      dueDate: defaultDue,
      completed: false,
      pacingLabel: `Checkpoint ${deadline.milestones.length + 1}`,
      estimatedHours: newHours || 1,
    };

    setDeadline({
      ...deadline,
      milestones: [...deadline.milestones, newMs],
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  const completedCount = deadline.milestones.filter((m) => m.completed).length;
  const totalHours = deadline.milestones.reduce((acc, m) => acc + (m.estimatedHours || 1), 0);

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Reverse Milestone Timeline</span>
            <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {completedCount} / {deadline.milestones.length} Completed
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Key steps worked backward from your target date to prevent last-minute cramming.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
          <span>Est. Workload: <strong className="text-white">{totalHours}h</strong></span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-sans text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Checkpoint</span>
          </button>
        </div>
      </div>

      {/* Add Milestone Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddMilestone}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Milestone title (e.g. Complete UI polish and test on mobile)"
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-zinc-400">Hours:</span>
              <input
                type="number"
                min="1"
                max="40"
                value={newHours}
                onChange={(e) => setNewHours(Number(e.target.value))}
                className="w-16 px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Milestone Checkpoints List */}
      <div className="space-y-3">
        {deadline.milestones.map((m, index) => {
          const dueDateObj = new Date(m.dueDate);
          const formattedDue = dueDateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                m.completed
                  ? 'border-zinc-800/60 bg-zinc-950/40 opacity-70'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              {/* Checkbox & Details */}
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleMilestone(m.id)}
                  className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition flex-shrink-0"
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        m.completed
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {m.pacingLabel}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center space-x-1 font-mono">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{m.estimatedHours}h est</span>
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center space-x-1 font-mono">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span>{formattedDue}</span>
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-semibold mt-1.5 ${
                      m.completed ? 'line-through text-zinc-400' : 'text-zinc-100'
                    }`}
                  >
                    {m.title}
                  </h4>
                  {m.description && (
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                      {m.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={() => deleteMilestone(m.id)}
                className="text-zinc-600 hover:text-rose-400 transition p-1"
                title="Remove milestone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
