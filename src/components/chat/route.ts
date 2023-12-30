import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import React from 'react';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Assuming VITE_OPENAI_API_KEY is an environment variable
  dangerouslyAllowBrowser: true,
});

export const runtime = 'edge';

export async function POST(req: VercelRequest, res: VercelResponse) {
  try {
    await res.json(req); // Parse JSON from the request body
    const { messages } = req.body;

    console.log(`api`, import.meta.env.VITE_OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error processing request:', error);

  }
}

