'use client';

import React, { useState } from 'react';
import { Deadline } from '@/types';
import { buildGeminiPlanningPrompt } from '@/lib/smartPlanner';
import { Sparkles, Copy, Check, ExternalLink, Cpu, AlertCircle, Bot } from 'lucide-react';

interface GeminiCoPilotProps {
  deadline: Deadline;
  setDeadline: (deadline: Deadline) => void;
}

export const GeminiCoPilot: React.FC<GeminiCoPilotProps> = ({
  deadline,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<{ provider: string; model: string } | null>(null);

  const promptText = buildGeminiPlanningPrompt(deadline);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCallServerAi = async () => {
    setIsGenerating(true);
    setApiError(null);
    setAiSuggestions(null);
    setProviderInfo(null);

    try {
      const response = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.configured === false) {
          throw new Error(
            'No AI key is set in environment variables (Groq, OpenRouter, Gemini, or OpenAI). You can use the 1-Click Copy Prompt button on the left to paste into Gemini or ChatGPT directly!'
          );
        }
        throw new Error(data?.error || `API error (${response.status})`);
      }

      if (data?.text) {
        setAiSuggestions(data.text);
        if (data.provider) {
          setProviderInfo({ provider: data.provider, model: data.model });
        }
      } else {
        throw new Error('No output returned from AI service.');
      }
    } catch (err: unknown) {
      setApiError((err as Error).message || 'Failed to connect to AI planning service.');
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
            <span>AI Planning Co-Pilot (Universal)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compatible with Groq (Llama 3.3), OpenRouter, Google Gemini, or OpenAI.
          </p>
        </div>

        <a
          href="https://gemini.google.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
        >
          <span>Open Web Chat</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Ready-To-Copy Prompt (100% Free) */}
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300">
                1-Click Prompt Copy
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Free · Any Model
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Copy this tailored reverse-planning prompt and paste it into Gemini, ChatGPT, or Claude to get instant milestone suggestions.
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
                <span>Copy Tailored Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Method 2: Universal Server AI Generation */}
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>One-Click Server AI Execution</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                Universal Adapter
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Supports <strong className="text-zinc-200">Groq</strong>, <strong className="text-zinc-200">OpenRouter</strong>, <strong className="text-zinc-200">Gemini</strong>, or <strong className="text-zinc-200">OpenAI</strong> via server environment.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
              <p>• Reverse-engineered milestone checkpoints</p>
              <p>• Estimated workload hours per phase</p>
              <p>• High-focus lock screen motivational mantras</p>
            </div>

            {apiError && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{apiError}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCallServerAi}
            disabled={isGenerating}
            className="w-full py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition flex items-center justify-center space-x-2 border border-amber-500/40 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isGenerating ? 'Querying Universal AI...' : 'Generate Plan with AI'}
            </span>
          </button>
        </div>
      </div>

      {/* AI Output Stream View */}
      {aiSuggestions && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center space-x-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>
                AI Reverse-Planning Suggestions
                {providerInfo && (
                  <span className="text-[10px] text-zinc-400 font-normal ml-2">
                    ({providerInfo.provider} · {providerInfo.model})
                  </span>
                )}
              </span>
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
