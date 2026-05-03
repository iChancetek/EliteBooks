import OpenAI from 'openai';

// Lazy singleton — only initializes when actually called
let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    });
  }
  return _client;
}

export default getOpenAIClient;
