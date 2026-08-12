/**
 * EliteBooks — GraphRAG Engine (Financial Knowledge Graph + Vector Fusion)
 * Extracts entities & relationships, manages multi-hop graph traversals, and combines Graph RAG with Vector RAG.
 */

import { generateEmbedding } from '@/lib/pinecone';

export type EntityType =
  | 'Vendor'
  | 'Client'
  | 'Transaction'
  | 'Account'
  | 'TaxCategory'
  | 'Contract'
  | 'CloudAsset'
  | 'Employee';

export type RelationType =
  | 'PAID_TO'
  | 'BILL_ISSUED_TO'
  | 'CATEGORIZED_AS'
  | 'SUBJECT_TO_TAX'
  | 'SUB_CONTRACTOR_OF'
  | 'OWES_BALANCE'
  | 'EXCEEDED_THRESHOLD'
  | 'PARENT_ACCOUNT_OF';

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  orgId: string;
  properties: Record<string, unknown>;
  createdAt: string;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: RelationType;
  orgId: string;
  properties: Record<string, unknown>;
  createdAt: string;
}

export interface KnowledgeGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
}

// Global In-Memory Graph Index per Tenant Organization
const graphStoreByOrg = new Map<string, KnowledgeGraph>();

function getOrgGraph(orgId: string): KnowledgeGraph {
  if (!graphStoreByOrg.has(orgId)) {
    graphStoreByOrg.set(orgId, {
      nodes: new Map(),
      edges: new Map(),
    });
  }
  return graphStoreByOrg.get(orgId)!;
}

export class GraphRAGManager {
  /**
   * Add or update an entity node in the Knowledge Graph
   */
  public static async addEntity(
    orgId: string,
    label: string,
    type: EntityType,
    properties: Record<string, unknown> = {}
  ): Promise<GraphNode> {
    const graph = getOrgGraph(orgId);
    const id = `node_${type.toLowerCase()}_${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const existing = graph.nodes.get(id);
    const node: GraphNode = {
      id,
      label,
      type,
      orgId,
      properties: existing ? { ...existing.properties, ...properties } : properties,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
    };

    graph.nodes.set(id, node);
    return node;
  }

  /**
   * Add a directed relationship edge between two entities
   */
  public static async addRelation(
    orgId: string,
    sourceId: string,
    targetId: string,
    relation: RelationType,
    properties: Record<string, unknown> = {}
  ): Promise<GraphEdge> {
    const graph = getOrgGraph(orgId);
    const id = `edge_${sourceId}_${relation}_${targetId}`;

    const edge: GraphEdge = {
      id,
      sourceId,
      targetId,
      relation,
      orgId,
      properties,
      createdAt: new Date().toISOString(),
    };

    graph.edges.set(id, edge);
    return edge;
  }

  /**
   * Perform multi-hop graph traversal starting from a set of target entity IDs
   */
  public static async traverseGraph(
    orgId: string,
    startEntityIds: string[],
    maxDepth: number = 2
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const graph = getOrgGraph(orgId);
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const queue: Array<{ node: string; depth: number }> = startEntityIds.map((id) => ({
      node: id,
      depth: 0,
    }));

    while (queue.length > 0) {
      const { node: currentId, depth } = queue.shift()!;
      if (visitedNodes.has(currentId) || depth > maxDepth) continue;

      visitedNodes.add(currentId);

      // Traversal edges connected to currentId
      for (const [edgeId, edge] of graph.edges.entries()) {
        if (edge.sourceId === currentId || edge.targetId === currentId) {
          visitedEdges.add(edgeId);

          const neighborId = edge.sourceId === currentId ? edge.targetId : edge.sourceId;
          if (!visitedNodes.has(neighborId) && depth + 1 <= maxDepth) {
            queue.push({ node: neighborId, depth: depth + 1 });
          }
        }
      }
    }

    const resultNodes = Array.from(visitedNodes)
      .map((id) => graph.nodes.get(id))
      .filter((n): n is GraphNode => Boolean(n));

    const resultEdges = Array.from(visitedEdges)
      .map((id) => graph.edges.get(id))
      .filter((e): e is GraphEdge => Boolean(e));

    return { nodes: resultNodes, edges: resultEdges };
  }

  /**
   * Extract financial entities and relationships from query string using financial heuristics & LLM parsing
   */
  public static async extractGraphEntities(
    orgId: string,
    text: string
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const extractedNodes: GraphNode[] = [];
    const extractedEdges: GraphEdge[] = [];

    // Simple heuristic parser for financial entities (can be augmented by LLM)
    const vendorMatches = text.match(/(AWS|Google Cloud|Stripe|Microsoft|Adobe|Slack|Zoom|Office Depot|Uber)/gi);
    if (vendorMatches) {
      for (const vendorName of vendorMatches) {
        const vendorNode = await this.addEntity(orgId, vendorName, 'Vendor', { textSource: text });
        extractedNodes.push(vendorNode);
      }
    }

    const invoiceMatches = text.match(/invoice\s*#?\s*([a-z0-9-]+)/gi);
    if (invoiceMatches) {
      for (const inv of invoiceMatches) {
        const invNode = await this.addEntity(orgId, inv, 'Transaction', { textSource: text });
        extractedNodes.push(invNode);
      }
    }

    // Link extracted vendors to transactions if both exist
    if (extractedNodes.length >= 2) {
      const vendorNode = extractedNodes.find((n) => n.type === 'Vendor');
      const invNode = extractedNodes.find((n) => n.type === 'Transaction');
      if (vendorNode && invNode) {
        const edge = await this.addRelation(orgId, invNode.id, vendorNode.id, 'PAID_TO');
        extractedEdges.push(edge);
      }
    }

    return { nodes: extractedNodes, edges: extractedEdges };
  }

  /**
   * Graph-Vector Fusion RAG: Combines Pinecone Vector retrieval with Graph Traversal context
   */
  public static async fusionSearch(
    orgId: string,
    query: string,
    topK: number = 3
  ): Promise<string> {
    const { LongTermMemoryManager } = await import('./long-term-memory');

    // 1. Vector Search from Pinecone
    const vectorMemories = await LongTermMemoryManager.queryMemory(orgId, query, topK);

    // 2. Knowledge Graph Entity Extraction & Traversal
    const { nodes: queryNodes } = await this.extractGraphEntities(orgId, query);
    const startEntityIds = queryNodes.map((n) => n.id);
    const graphSubgraph = await this.traverseGraph(orgId, startEntityIds, 2);

    // 3. Synthesize Fusion Context
    let fusionContext = '--- GraphRAG Knowledge Graph Subgraph ---\n';

    if (graphSubgraph.nodes.length > 0) {
      fusionContext += 'Entities:\n';
      graphSubgraph.nodes.forEach((n) => {
        fusionContext += `- [${n.type}] ${n.label} (ID: ${n.id})\n`;
      });
      fusionContext += 'Relationships:\n';
      graphSubgraph.edges.forEach((e) => {
        fusionContext += `- ${e.sourceId} --[${e.relation}]--> ${e.targetId}\n`;
      });
    } else {
      fusionContext += 'No direct graph relationships matching entity query.\n';
    }

    fusionContext += '\n--- Vector RAG Memories ---\n';
    if (vectorMemories.length > 0) {
      vectorMemories.forEach((mem, idx) => {
        fusionContext += `${idx + 1}. [Score: ${mem.score.toFixed(2)}] (${mem.category}) ${mem.content}\n`;
      });
    } else {
      fusionContext += 'No vector memory matches found.\n';
    }

    return fusionContext;
  }
}
