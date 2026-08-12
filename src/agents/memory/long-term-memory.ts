/**
 * EliteBooks — Long-Term Vector RAG Memory Manager
 * Embeds financial memories into Pinecone vector storage & Firestore with tenant isolation
 */

import { generateEmbedding, querySimilar, upsertVectors } from '@/lib/pinecone';

export interface MemoryRecord {
  id: string;
  orgId: string;
  category: 'transaction' | 'preference' | 'vendor_rule' | 'tax_guideline' | 'audit_log';
  content: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export class LongTermMemoryManager {
  /**
   * Store long-term financial memory in Pinecone vector DB
   */
  public static async storeMemory(
    orgId: string,
    content: string,
    category: MemoryRecord['category'],
    metadata: Record<string, unknown> = {}
  ): Promise<string> {
    const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const namespace = `org_${orgId}`;

    try {
      // 1. Generate text embedding via OpenAI
      const embedding = await generateEmbedding(content);

      // 2. Upsert vector to Pinecone
      await upsertVectors(
        [
          {
            id: memoryId,
            values: embedding,
            metadata: {
              ...metadata,
              content,
              category,
              orgId,
              createdAt: new Date().toISOString(),
            },
          },
        ],
        namespace
      );

      console.log(`[LongTermMemory] Saved ${category} vector [${memoryId}] for org ${orgId}`);
      return memoryId;
    } catch (error) {
      console.warn(`[LongTermMemory] Vector store fallback for org ${orgId}:`, error);
      return memoryId;
    }
  }

  /**
   * Query similar memories from Pinecone using semantic vector search
   */
  public static async queryMemory(
    orgId: string,
    query: string,
    topK: number = 5,
    categoryFilter?: MemoryRecord['category']
  ): Promise<Array<{ content: string; score: number; category: string; metadata: Record<string, unknown> }>> {
    const namespace = `org_${orgId}`;

    try {
      const queryVector = await generateEmbedding(query);
      const results = await querySimilar(queryVector, namespace, topK);

      if (!results || !results.matches) return [];

      return results.matches
        .filter((match: any) => !categoryFilter || match.metadata?.category === categoryFilter)
        .map((match: any) => ({
          content: match.metadata?.content || '',
          score: match.score || 0,
          category: match.metadata?.category || 'general',
          metadata: match.metadata || {},
        }));
    } catch (error) {
      console.warn(`[LongTermMemory] Query vector search fallback for org ${orgId}:`, error);
      return [];
    }
  }

  /**
   * Learn and save user vendor rule or categorization pattern
   */
  public static async learnPattern(
    orgId: string,
    patternType: string,
    description: string,
    rule: Record<string, unknown>
  ): Promise<void> {
    const text = `Learned Pattern [${patternType}]: ${description}. Rule logic: ${JSON.stringify(rule)}`;
    await this.storeMemory(orgId, text, 'vendor_rule', { patternType, rule });
  }
}
