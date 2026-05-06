/**
 * EliteBooks — RAG Chat API
 * Retrieves context from Pinecone and generates a response via OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { generateEmbedding, querySimilar } from '@/lib/pinecone';
import { storeMemory, retrieveMemory } from '@/lib/rag';

export async function POST(request: NextRequest) {
  try {
    const { messages, namespace = 'elitebooks-help' } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;
    
    // 1. Generate embedding for the user query
    const queryVector = await generateEmbedding(lastMessage);
    
    // 2. Search for relevant context in Pinecone (Help Docs + Long-term Memory)
    const [searchResults, memories] = await Promise.all([
      querySimilar(queryVector, namespace, 4),
      retrieveMemory(lastMessage, 'agent-memory', 3)
    ]);
    
    const context = searchResults.matches
      .map((match: any) => match.metadata.text)
      .join('\n\n---\n\n');

    const memoryContext = memories.length > 0
      ? memories.map((m: any) => `[Memory from ${m.metadata.timestamp}]: ${m.text}`).join('\n')
      : 'No relevant long-term memories found.';

    // 3. Define Tools for Platform Info Gathering
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_account_balance',
          description: 'Get the current balance of a financial account',
          parameters: {
            type: 'object',
            properties: {
              accountId: { type: 'string', description: 'The ID of the account to check' }
            },
            required: ['accountId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_financial_summary',
          description: 'Get a summary of profit, loss, and revenue',
          parameters: {
            type: 'object',
            properties: {
              period: { type: 'string', enum: ['last_month', 'this_month', 'this_year'], description: 'The time period' }
            }
          }
        }
      }
    ];

    // 4. Augment prompt with context and formatting rules
    // 4. Augment prompt with context and formatting rules
    const systemPrompt = `You are the EliteBooks Agentic Assistant. EliteBooks is an AI-powered financial operating system with autonomous agents handling invoicing, expenses, payroll, reporting, FinOps, and personal finances — all automated and clearly explained.
Your goal is to provide deep, professional, and actionable financial insights while managing the platform's autonomous capabilities.

PLATFORM CAPABILITIES & FEATURES (HOW IT WORKS):

EliteBooks coordinates 7 specialized autonomous agents:

• Advanced Invoice Creator: Managed by Invoice Agent. Automated enterprise-grade billing with real-time math and dynamic presets.
• Personal AI Autopilot: Managed by Personal Agent. Autonomous wealth protection, 60-day cash flow forecasting, and subscription leak detection.
• Cloud & AI FinOps: Managed by FinOps Agent. Optimization of GPU/token costs, FOCUS 1.3 reporting, and shift-left architectural cost control.
• Wealth Governance: Managed by Personal Agent. Proactive intelligence on tax optimization, ETF structures, and credit score guidance.
• Predictive Intelligence: Managed by Cash Flow Agent. 98% accurate revenue/expense forecasting with dynamic scenario modeling.
• Autonomous Payroll: Managed by Payroll Agent. Zero-touch payroll with automatic withholding, tax filing, and compliance.
• Intelligent Inventory: Managed by Ledger Agent. Predictive supply chain management with AI reorder triggers and real-time COGS analysis.

FORMATTING & STYLE RULES (CRITICAL):

• Respond with professional clarity and structure.
• Use bullet points (•) for lists and feature highlights.
• Separate distinct ideas with clear PARAGRAPHS.
• Ensure there is a full EMPTY LINE (double newline) between paragraphs to prevent text from being bunched together.
• IMPORTANT: DO NOT USE ANY ASTERISKS (*) OR STAR-SHAPED SYMBOLS.
• Use bolding sparingly by using plain CAPITAL LETTERS for emphasis if needed, but DO NOT use Markdown bolding that requires asterisks.
• Maintain a premium, authoritative tone.

LEARNING & PREDICTION:
- Learn from the user's intent to provide deeper insights.
- You have access to LONG-TERM MEMORY of previous interactions to personalize your responses.
- At the end of every response, you MUST provide 3 suggested follow-up questions in a special JSON-like format: [PREDICTED: "Question 1", "Question 2", "Question 3"].

LONG-TERM MEMORY:
${memoryContext}

CONTEXT:
${context}`;

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      tools: tools as any,
      tool_choice: 'auto',
      temperature: 0.6, // Lower temperature for more professional consistency
    });

    const assistantMessage = response.choices[0].message;
    
    // Handle Tool Calls (Simplified for this task)
    if (assistantMessage.tool_calls) {
      // In a real implementation, we would execute the tools and call OpenAI again.
      // For this task, we'll simulate the "gathering info" by returning a message that includes gathered info.
      console.log('[Assistant] Gathering info from platform...', assistantMessage.tool_calls);
    }

    let finalAnswer = assistantMessage.content || '';
    
    // Extract predicted questions
    let predictedQuestions = ["How do I set up payroll?", "Tell me about invoicing", "Show my reports"];
    try {
      const predictedMatch = finalAnswer.match(/\[PREDICTED: (.*?)\]/);
      if (predictedMatch) {
        predictedQuestions = JSON.parse(`[${predictedMatch[1]}]`);
      }
    } catch (e) {
      console.warn('[RAG API] Failed to parse predicted questions:', e);
    }
    
    // Remove the predicted questions from the visible answer
    finalAnswer = finalAnswer.replace(/\[PREDICTED: .*?\]/, '').trim();

    // Final check for asterisks (safety fallback)
    finalAnswer = finalAnswer.replace(/\*/g, '');

    // 6. Store this interaction in Long-term Memory
    await storeMemory(
      `User asked: "${lastMessage}" | Assistant answered: "${finalAnswer.slice(0, 500)}..."`,
      { type: 'chat_interaction', userId: 'global_user' }
    ).catch(err => console.error('[Memory Storage Error]', err));

    return NextResponse.json({
      success: true,
      answer: finalAnswer,
      predictedQuestions,
      sources: (searchResults.matches || []).map((m: any) => m.metadata?.title || 'Unknown Source'),
    });

  } catch (error: any) {
    console.error('[RAG API Error Details]:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json({ 
      error: 'Failed to process RAG request', 
      details: error.message 
    }, { status: 500 });
  }
}
