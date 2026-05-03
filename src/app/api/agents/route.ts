/**
 * EliteBooks — Agent API Route
 * Receives user intent and routes through the Orchestrator Agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeAgent } from '@/agents/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, orgId, userId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Log the request for audit trail
    console.log(`[Agent Request] User: ${userId}, Org: ${orgId}, Message: "${message}"`);

    const result = await executeAgent(
      message,
      orgId || 'default',
      userId || 'anonymous'
    );

    // Log the result for audit trail
    console.log(`[Agent Response] Agent: ${result.agentUsed}, Success: ${result.success}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Agent API Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred processing your request.',
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
