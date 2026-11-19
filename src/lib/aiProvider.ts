/**
 * Universal AI Provider Engine for Kairos Studio
 * Supports Google Gemini, Groq, OpenRouter, OpenAI, and any OpenAI-compatible endpoint.
 * Auto-detects provider based on API key prefix or explicit configuration.
 */

export type AiProviderType = 'gemini' | 'groq' | 'openrouter' | 'openai' | 'custom';

export interface AiConfig {
  provider: AiProviderType;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export function resolveAiConfig(): AiConfig | null {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0 || apiKey.includes('YourApiKeyHere') || apiKey.includes('YourGeminiApiKeyHere')) {
    return null;
  }

  const trimmedKey = apiKey.trim();
  const explicitProvider = process.env.AI_PROVIDER?.toLowerCase() as AiProviderType | undefined;
  const customModel = process.env.AI_MODEL;
  const customBaseUrl = process.env.AI_BASE_URL;

  // Auto-detect provider from key prefix if not explicitly set
  let provider: AiProviderType = 'gemini';

  if (explicitProvider) {
    provider = explicitProvider;
  } else if (trimmedKey.startsWith('gsk_')) {
    provider = 'groq';
  } else if (trimmedKey.startsWith('sk-or-')) {
    provider = 'openrouter';
  } else if (trimmedKey.startsWith('AIzaSy')) {
    provider = 'gemini';
  } else if (trimmedKey.startsWith('sk-')) {
    provider = 'openai';
  }

  // Smart default models & base URLs per provider
  let defaultModel = 'gemini-1.5-flash';
  let defaultBaseUrl: string | undefined = undefined;

  switch (provider) {
    case 'groq':
      defaultModel = 'llama-3.3-70b-versatile';
      defaultBaseUrl = 'https://api.groq.com/openai/v1';
      break;
    case 'openrouter':
      defaultModel = 'google/gemini-flash-1.5';
      defaultBaseUrl = 'https://openrouter.ai/api/v1';
      break;
    case 'openai':
      defaultModel = 'gpt-4o-mini';
      defaultBaseUrl = 'https://api.openai.com/v1';
      break;
    case 'gemini':
      defaultModel = 'gemini-1.5-flash';
      break;
    case 'custom':
      defaultModel = customModel || 'gpt-4o-mini';
      defaultBaseUrl = customBaseUrl || 'https://api.openai.com/v1';
      break;
  }

  return {
    provider,
    apiKey: trimmedKey,
    model: customModel || defaultModel,
    baseUrl: customBaseUrl || defaultBaseUrl,
  };
}

/**
 * Universal query function that routes request based on provider protocol
 */
export async function queryUniversalAi(prompt: string): Promise<{ text: string; provider: string; model: string }> {
  const config = resolveAiConfig();

  if (!config) {
    throw new Error('No AI API key configured in server environment variables.');
  }

  // Case 1: Native Google Gemini API
  if (config.provider === 'gemini') {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\nPlease format your response cleanly with bulleted reverse milestones and time estimates.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API error (${response.status})`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response received from Gemini.');

    return { text, provider: 'Google Gemini', model: config.model };
  }

  // Case 2: OpenAI-Compatible Protocol (Groq, OpenRouter, OpenAI, Together, DeepSeek, etc.)
  const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.groq.com/openai/v1';
  const endpoint = `${baseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.apiKey}`,
  };

  // OpenRouter recommended headers
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://github.com/Escanor244/deadline-app';
    headers['X-Title'] = 'Kairos Studio';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are an elite project planning assistant and creative director. Work backward from the target deadline to produce high-impact, actionable milestones and focus mantras.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || err?.error || `AI API error (${response.status})`;
    throw new Error(`${config.provider.toUpperCase()} Error: ${msg}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Empty response received from ${config.provider}.`);

  const providerNames: Record<string, string> = {
    groq: 'Groq (Llama 3.3)',
    openrouter: 'OpenRouter',
    openai: 'OpenAI',
    custom: 'Custom LLM',
  };

  return {
    text,
    provider: providerNames[config.provider] || config.provider,
    model: config.model,
  };
}
