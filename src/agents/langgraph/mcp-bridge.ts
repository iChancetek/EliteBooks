/**
 * EliteBooks — LangGraph MCP & Tavily Tool Bridge
 * Bridges MCP Server/Client tools directly into the LangGraph state machine execution graph.
 */

import { mcpClient } from '@/mcp/client';
import { performTavilySearch } from '@/tools/tavily';

export class MCPToolBridge {
  /**
   * Execute an MCP or Tavily tool directly within a LangGraph node turn
   */
  public static async executeTool(
    toolName: string,
    args: Record<string, any>
  ): Promise<Record<string, unknown>> {
    console.log(`[LangGraph MCP Bridge] Invoking tool "${toolName}"`, args);

    if (toolName === 'tavily_search') {
      const rawQuery = args.query || args.prompt || '';
      const { piiVault } = await import('@/security/pii-vault');
      const sanitizedQuery = piiVault.mask(rawQuery, args.sessionId || 'global_mcp');

      const searchRes = await performTavilySearch(sanitizedQuery, {
        topic: args.topic || 'finance',
      });
      return {
        toolName,
        success: true,
        data: searchRes,
      };
    }


    try {
      const result = await mcpClient.callTool(toolName, args);
      return {
        toolName,
        success: true,
        data: result,
      };
    } catch (error) {
      console.warn(`[MCPToolBridge] Error executing ${toolName}:`, error);
      return {
        toolName,
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed',
      };
    }
  }
}
