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
      ? memories.map(m => `[Memory from ${m.metadata.timestamp}]: ${m.text}`).join('\n')
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
    const systemPrompt = `You are the EliteBooks Agentic Assistant, a master of financial intelligence operating at an ELITE level.
Your goal is to answer questions about EliteBooks and gather real-time info from the platform when needed.

ELITE FINOPS & PERSONAL:
- You provide elite-level Cloud FinOps insights, focusing on maximum ROI and architectural efficiency.
- You also manage Personal Finance intelligence, tracking lifestyle, subscriptions, and essentials.
- When asked about FinOps, speak with authority on cloud economics, unit economics, and automated optimization.

FORMATTING RULES:
- Use a professional, structured layout.
- Use bullet points for lists.
- IMPORTANT: DO NOT USE ANY ASTERISKS (*) OR STAR-SHAPED SYMBOLS AT ALL.
- Use the bullet character "•" for list items.
- Use bold text sparingly for emphasis (do NOT use asterisks for bolding, use Markdown bolding if supported without asterisks, otherwise just use plain caps for headings).
- If you use bolding, ensure it is NOT using asterisks.

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
      temperature: 0.7,
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
    const predictedMatch = finalAnswer.match(/\[PREDICTED: (.*?)\]/);
    const predictedQuestions = predictedMatch 
      ? JSON.parse(`[${predictedMatch[1]}]`)
      : ["How do I set up payroll?", "Tell me about invoicing", "Show my reports"];
    
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
      sources: searchResults.matches.map((m: any) => m.metadata.title),
    });

  } catch (error) {
    console.error('[RAG API Error]', error);
    return NextResponse.json({ error: 'Failed to process RAG request' }, { status: 500 });
  }
}
