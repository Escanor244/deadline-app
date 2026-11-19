import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim().length === 0 || apiKey.includes('YourGeminiApiKeyHere')) {
      return NextResponse.json(
        {
          configured: false,
          error: 'GEMINI_API_KEY is not configured in server environment variables.',
        },
        { status: 400 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt in request body' }, { status: 400 });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\nPlease format your response cleanly with bulleted milestones and estimated hours.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API error (${response.status})`);
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error('No suggestions received from Gemini.');
    }

    return NextResponse.json({
      success: true,
      configured: true,
      text: textOutput,
    });
  } catch (error: unknown) {
    console.error('API /api/ai/plan error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process AI planning request' },
      { status: 500 }
    );
  }
}
