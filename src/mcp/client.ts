/**
 * EliteBooks — Model Context Protocol (MCP) Client
 * Client implementation for connecting to local/remote MCP servers, listing tools, reading resources, and executing tool calls.
 */

import { mcpServer } from './server';

export interface MCPClientConfig {
  serverUrl?: string;
}

export class EliteBooksMCPClient {
  private serverUrl: string;

  constructor(config: MCPClientConfig = {}) {
    this.serverUrl = config.serverUrl || 'http://localhost:3000/api/mcp';
  }

  /**
   * List available tools from the target MCP Server
   */
  public async listTools() {
    try {
      // Direct local execution shortcut or RPC fetch
      return mcpServer.listTools();
    } catch (error) {
      console.warn('[MCP Client] Fallback listTools:', error);
      return [];
    }
  }

  /**
   * Invoke a tool on the target MCP Server
   */
  public async callTool(toolName: string, args: Record<string, unknown>) {
    try {
      return await mcpServer.callTool(toolName, args);
    } catch (error) {
      console.error(`[MCP Client] Call tool error for "${toolName}":`, error);
      throw error;
    }
  }

  /**
   * Read resource from target MCP Server
   */
  public async readResource(uri: string) {
    try {
      return await mcpServer.readResource(uri);
    } catch (error) {
      console.error(`[MCP Client] Read resource error for "${uri}":`, error);
      throw error;
    }
  }
}

export const mcpClient = new EliteBooksMCPClient();
