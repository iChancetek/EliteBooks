/**
 * EliteBooks — MCP HTTP API Route Endpoint
 * Handles JSON-RPC 2.0 requests for MCP tool execution, resource reading, and tool listing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { mcpServer } from '@/mcp/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jsonrpc, method, params, id } = body;

    if (jsonrpc !== '2.0') {
      return NextResponse.json(
        { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request: Must be JSON-RPC 2.0' }, id },
        { status: 400 }
      );
    }

    switch (method) {
      case 'tools/list': {
        const tools = mcpServer.listTools();
        return NextResponse.json({ jsonrpc: '2.0', result: { tools }, id });
      }

      case 'tools/call': {
        const { name, arguments: toolArgs } = params || {};
        const result = await mcpServer.callTool(name, toolArgs || {});
        return NextResponse.json({ jsonrpc: '2.0', result, id });
      }

      case 'resources/list': {
        const resources = mcpServer.listResources();
        return NextResponse.json({ jsonrpc: '2.0', result: { resources }, id });
      }

      case 'resources/read': {
        const { uri } = params || {};
        const result = await mcpServer.readResource(uri);
        return NextResponse.json({ jsonrpc: '2.0', result, id });
      }

      case 'prompts/list': {
        const prompts = mcpServer.listPrompts();
        return NextResponse.json({ jsonrpc: '2.0', result: { prompts }, id });
      }

      default:
        return NextResponse.json(
          { jsonrpc: '2.0', error: { code: -32601, message: `Method not found: ${method}` }, id },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('[MCP API Route Error]:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal RPC Error',
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'EliteBooks Model Context Protocol (MCP) Server',
    version: '1.0.0',
    protocolVersion: '2024-11-05',
    status: 'online',
    endpoints: {
      jsonrpc: '/api/mcp',
    },
  });
}
