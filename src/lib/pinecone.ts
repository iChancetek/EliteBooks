/**
 * EliteBooks — Pinecone Vector Database Client
 */

export const PINECONE_CONFIG = {
  apiKey: process.env.PINECONE_API_KEY || 'pcsk_6F7rXg_BzAT7hQFHuwKrnJKTBZVEmUatWf8neBQi8U53UaR3crctP187VEUgnsaMX3aaeo',
  indexName: 'elitebooks-financial',
  host: 'https://elitebooks-nq97767.svc.aped-4627-b74a.pinecone.io',
};

/**
 * Generate embeddings via OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = (await import('./openai')).getOpenAIClient();
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding;
}

/**
 * Upsert vectors to Pinecone
 */
export async function upsertVectors(
  vectors: Array<{ id: string; values: number[]; metadata: Record<string, unknown> }>,
  namespace: string
) {
  const response = await fetch(`${PINECONE_CONFIG.host}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_CONFIG.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vectors,
      namespace,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinecone upsert failed: ${error}`);
  }

  return response.json();
}

/**
 * Query similar vectors
 */
export async function querySimilar(
  queryVector: number[],
  namespace: string,
  topK = 5
) {
  const response = await fetch(`${PINECONE_CONFIG.host}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_CONFIG.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vector: queryVector,
      topK,
      namespace,
      includeMetadata: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinecone query failed: ${error}`);
  }

  return response.json();
}
