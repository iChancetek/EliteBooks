/**
 * EliteBooks — Agent API Route
 * Receives user intent and routes through the Orchestrator Agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeAgent } from '@/agents/orchestrator';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Extract authenticated orgId from Firebase token (preferred) or fall back to body
    let orgId = body.orgId || 'default';
    let userId = body.userId || 'anonymous';
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        orgId = decoded.uid;
        userId = decoded.uid;
      } catch (e) {
        console.warn('[Agent API] Auth token verification failed, using fallback orgId');
      }
    }

    // Log the request for audit trail
    console.log(`[Agent Request] User: ${userId}, Org: ${orgId}, Session: ${sessionId}, Message: "${message}"`);

    const result = await executeAgent(
      message,
      orgId,
      userId,
      sessionId || `sess_${Date.now()}`
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

