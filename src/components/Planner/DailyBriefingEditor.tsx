'use client';

import React, { useState } from 'react';
import { Deadline, BriefingProfile, ScheduleEvent, DailyTask } from '@/types';
import { User, Sun, CloudRain, Calendar, CheckSquare, Plus, Trash2, Sparkles, MapPin } from 'lucide-react';

interface DailyBriefingEditorProps {
  deadline: Deadline;
  setDeadline: (deadline: Deadline) => void;
}

export const DailyBriefingEditor: React.FC<DailyBriefingEditorProps> = ({
  deadline,
  setDeadline,
}) => {
  const briefing: BriefingProfile = deadline.briefing || {
    userName: 'Alex',
    greetingPrefix: 'Good morning',
    weather: {
      temperature: '72°',
      condition: 'partly cloudy',
      location: 'Greenpoint, Brooklyn',
      forecastNote: 'Light rain likely after 6PM, bring an umbrella',
    },
    events: [
      { id: 'ev-1', time: '9:30 AM', title: 'Team standup' },
      { id: 'ev-2', time: '1:00 PM', title: 'Lunch with Priya' },
      { id: 'ev-3', time: '4:00 PM', title: 'Dentist (20 min drive)' },
    ],
    tasks: [
      { id: 'tk-1', title: 'Send report', completed: false },
      { id: 'tk-2', title: 'Renew car registration', completed: false },
    ],
  };

  const updateBriefing = (partial: Partial<BriefingProfile>) => {
    setDeadline({
      ...deadline,
      briefing: {
        ...briefing,
        ...partial,
      },
    });
  };

  const [newEventTime, setNewEventTime] = useState('2:00 PM');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent: ScheduleEvent = {
      id: `ev-${Date.now()}`,
      time: newEventTime.trim() || '12:00 PM',
      title: newEventTitle.trim(),
    };
    updateBriefing({
      events: [...briefing.events, newEvent],
    });
    setNewEventTitle('');
  };

  const handleRemoveEvent = (id: string) => {
    updateBriefing({
      events: briefing.events.filter((e) => e.id !== id),
    });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: DailyTask = {
      id: `tk-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
    };
    updateBriefing({
      tasks: [...briefing.tasks, newTask],
    });
    setNewTaskTitle('');
  };

  const handleRemoveTask = (id: string) => {
    updateBriefing({
      tasks: briefing.tasks.filter((t) => t.id !== id),
    });
  };

  const handleToggleTask = (id: string) => {
    updateBriefing({
      tasks: briefing.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Daily Briefing & Morning Lock Screen
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live on Widget
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Personalize your morning greeting, local weather note, today's events, and daily tasks.
          </p>
        </div>
      </div>

      {/* Profile & Greeting Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Your Name</span>
          </label>
          <input
            type="text"
            value={briefing.userName}
            onChange={(e) => updateBriefing({ userName: e.target.value })}
            placeholder="e.g. Alex, Sarah, Jordan"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-1.5">
            Greeting Phrase
          </label>
          <select
            value={briefing.greetingPrefix || 'Good morning'}
            onChange={(e) => updateBriefing({ greetingPrefix: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="Good morning">Good morning</option>
            <option value="Good afternoon">Good afternoon</option>
            <option value="Good evening">Good evening</option>
            <option value="Focus today">Focus today</option>
            <option value="Ship it">Ship it</option>
          </select>
        </div>
      </div>

      {/* Weather & Context Note */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-zinc-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Weather & Location Context</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Temperature</label>
            <input
              type="text"
              value={briefing.weather.temperature}
              onChange={(e) =>
                updateBriefing({
                  weather: { ...briefing.weather, temperature: e.target.value },
                })
              }
              placeholder="72°"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Condition</label>
            <input
              type="text"
              value={briefing.weather.condition}
              onChange={(e) =>
                updateBriefing({
                  weather: { ...briefing.weather, condition: e.target.value },
                })
              }
              placeholder="partly cloudy"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">City / Neighborhood</label>
            <input
              type="text"
              value={briefing.weather.location}
              onChange={(e) =>
                updateBriefing({
                  weather: { ...briefing.weather, location: e.target.value },
                })
              }
              placeholder="Greenpoint, Brooklyn"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Forecast / Morning Note</label>
          <input
            type="text"
            value={briefing.weather.forecastNote}
            onChange={(e) =>
              updateBriefing({
                weather: { ...briefing.weather, forecastNote: e.target.value },
              })
            }
            placeholder="Light rain likely after 6PM, bring an umbrella"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
          />
        </div>
      </div>

      {/* Dual Column Life Editor: Events Today & Tasks Due Today */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Column: Events Today */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Events Today ({briefing.events.length})</span>
            </label>
            <span className="text-[10px] text-zinc-500">Appears on lock screen</span>
          </div>

          <div className="space-y-2">
            {briefing.events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-white group"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="font-mono text-emerald-400 text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10">
                    {ev.time}
                  </span>
                  <span className="truncate">{ev.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(ev.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Event Row */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              placeholder="9:30 AM"
              className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
            />
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Event name (e.g. Team standup)"
              className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
            />
            <button
              type="button"
              onClick={handleAddEvent}
              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition"
              title="Add event"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Tasks Due Today */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tasks Due Today ({briefing.tasks.length})</span>
            </label>
            <span className="text-[10px] text-zinc-500">Checklist on widget</span>
          </div>

          <div className="space-y-2">
            {briefing.tasks.map((tk) => (
              <div
                key={tk.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-white group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={tk.completed}
                    onChange={() => handleToggleTask(tk.id)}
                    className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span
                    className={`truncate ${
                      tk.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                    }`}
                  >
                    {tk.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTask(tk.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Task Row */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task name (e.g. Send report, Renew registration)"
              className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition"
              title="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
