/**
 * EliteBooks — RAG Utility
 * Handles text splitting and ingestion into Pinecone
 */

import { generateEmbedding, upsertVectors } from './pinecone';

export interface Chunk {
  id: string;
  text: string;
  metadata: Record<string, any>;
}

/**
 * Split text into overlapping chunks
 */
export function splitText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    let chunk = text.slice(start, end);
    
    // Try to break at a newline or space if not at the very end
    if (end < text.length) {
      const lastSpace = chunk.lastIndexOf(' ');
      if (lastSpace > chunkSize * 0.8) {
        chunk = chunk.slice(0, lastSpace);
      }
    }
    
    chunks.push(chunk.trim());
    start += chunk.length - overlap;
    
    // Prevent infinite loop if overlap is too large
    if (chunk.length <= overlap) break;
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * Ingest a document into Pinecone
 */
export async function ingestContent(
  content: string, 
  title: string, 
  source: string,
  namespace = 'elitebooks-help'
) {
  console.log(`[RAG] Ingesting: ${title} (${content.length} chars)`);
  
  const chunks = splitText(content);
  const vectors = [];

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i];
    const embedding = await generateEmbedding(text);
    
    vectors.push({
      id: `${source}-${i}`,
      values: embedding,
      metadata: {
        text,
        title,
        source,
        chunkIndex: i,
      }
    });
  }

  await upsertVectors(vectors, namespace);
  return { chunkCount: chunks.length };
}

/**
 * Store a specific memory in Pinecone
 */
export async function storeMemory(
  text: string,
  metadata: Record<string, any>,
  namespace = 'agent-memory'
) {
  const embedding = await generateEmbedding(text);
  const id = `mem-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  await upsertVectors([{
    id,
    values: embedding,
    metadata: {
      ...metadata,
      text,
      timestamp: new Date().toISOString(),
    }
  }], namespace);
  
  return id;
}

/**
 * Retrieve relevant memories from Pinecone
 */
export async function retrieveMemory(
  query: string,
  namespace = 'agent-memory',
  topK = 3
) {
  const { querySimilar } = await import('./pinecone');
  const queryVector = await generateEmbedding(query);
  const results = await querySimilar(queryVector, namespace, topK);
  
  return results.matches.map((m: any) => ({
    text: m.metadata.text,
    metadata: m.metadata,
    score: m.score
  }));
}
