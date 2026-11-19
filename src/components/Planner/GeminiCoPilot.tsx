'use client';

import React, { useState, useEffect } from 'react';
import { Deadline, Milestone } from '@/types';
import { buildGeminiPlanningPrompt } from '@/lib/smartPlanner';
import { loadGeminiKey, saveGeminiKey } from '@/lib/storage';
import { Sparkles, Copy, Check, ExternalLink, Key, Cpu, AlertCircle } from 'lucide-react';

interface GeminiCoPilotProps {
  deadline: Deadline;
  setDeadline: (deadline: Deadline) => void;
}

export const GeminiCoPilot: React.FC<GeminiCoPilotProps> = ({
  deadline,
  setDeadline,
}) => {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(loadGeminiKey());
  }, []);

  const promptText = buildGeminiPlanningPrompt(deadline);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKey = (val: string) => {
    setApiKey(val);
    saveGeminiKey(val);
  };

  const handleCallGeminiApi = async () => {
    if (!apiKey.trim()) {
      setApiError('Please enter your Google Gemini API key first.');
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setAiSuggestions(null);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${promptText}\n\nPlease format your response as clear markdown with bulleted milestones and time estimates.`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error (${response.status})`);
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        setAiSuggestions(textOutput);
      } else {
        throw new Error('No suggestions received from Gemini.');
      }
    } catch (err: unknown) {
      setApiError((err as Error).message || 'Failed to connect to Gemini API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Google Gemini AI Planning Co-Pilot</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Use Gemini to reverse-engineer your milestones and generate lock screen art prompts.
          </p>
        </div>

        <a
          href="https://gemini.google.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
        >
          <span>Open Gemini App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Ready-To-Copy Multimodal Prompt */}
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300">
                1-Click Prompt For Gemini Web
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                100% Free · No API Key Needed
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Copy this tailored multimodal prompt and paste it into Gemini (web or mobile) to generate backward milestones or ask for image references.
            </p>

            <div className="mt-3 p-3 rounded-lg bg-zinc-950 font-mono text-xs text-zinc-300 border border-zinc-800/80 max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
              {promptText}
            </div>
          </div>

          <button
            onClick={handleCopyPrompt}
            className="w-full py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center space-x-2 border border-zinc-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Prompt Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Multimodal Gemini Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Method 2: Direct Client-Side Gemini API (Optional BYOK) */}
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct In-App Gemini API (BYOK)</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                Stored in LocalStorage
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Have a Google AI / Gemini API key? Paste it here to query Gemini 1.5 Flash directly from your browser.
            </p>

            <div className="mt-3 space-y-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                placeholder="AIzaSy... (Client-side only)"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-zinc-500 block">
                Your key never leaves your browser. Zero backend storage.
              </span>
            </div>

            {apiError && (
              <div className="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{apiError}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCallGeminiApi}
            disabled={isGenerating || !apiKey.trim()}
            className="w-full py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition flex items-center justify-center space-x-2 border border-amber-500/40 disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {isGenerating ? 'Querying Gemini...' : 'Generate Plan with Gemini 1.5'}
            </span>
          </button>
        </div>
      </div>

      {/* AI Output Stream View */}
      {aiSuggestions && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Reverse-Planning Suggestions:</span>
            </span>
            <button
              onClick={() => setAiSuggestions(null)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300"
            >
              Dismiss
            </button>
          </div>
          <div className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {aiSuggestions}
          </div>
        </div>
      )}
    </div>
  );
};
