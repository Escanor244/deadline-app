import { NextRequest, NextResponse } from 'next/server';
import { queryUniversalAi, resolveAiConfig } from '@/lib/aiProvider';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const config = resolveAiConfig();

    if (!config) {
      return NextResponse.json(
        {
          configured: false,
          error: 'No AI API key (Groq, OpenRouter, Gemini, or OpenAI) is configured in server environment variables.',
        },
        { status: 400 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt in request body' }, { status: 400 });
    }

    const result = await queryUniversalAi(prompt);

    return NextResponse.json({
      success: true,
      configured: true,
      text: result.text,
      provider: result.provider,
      model: result.model,
    });
  } catch (error: unknown) {
    console.error('API /api/ai/plan error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process AI planning request' },
      { status: 500 }
    );
  }
}
