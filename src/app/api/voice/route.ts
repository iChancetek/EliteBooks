/**
 * EliteBooks — Voice API Route
 * Whisper STT + OpenAI TTS
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Speech-to-Text (Whisper)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;

      if (!audioFile) {
        return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
      }

      const openai = getOpenAIClient();
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
        response_format: 'text',
      });

      return NextResponse.json({
        success: true,
        text: transcription,
      });
    }

    // Text-to-Speech
    const body = await request.json();
    const { text, voice = 'nova' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const speech = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice,
      input: text,
      response_format: 'mp3',
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
      },
    });
  } catch (error) {
    console.error('[Voice API Error]', error);
    return NextResponse.json(
      { error: 'Voice processing failed' },
      { status: 500 }
    );
  }
}
