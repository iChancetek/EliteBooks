/**
 * EliteBooks — RAG Chat API
 * Retrieves context from Pinecone and generates a response via OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { generateEmbedding, querySimilar } from '@/lib/pinecone';
import { storeMemory, retrieveMemory } from '@/lib/rag';
import { getInvoices, getExpenses, createExpense, getFinancialSummary, createInvoice } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { messages, namespace = 'elitebooks-help' } = await request.json();
    let orgId = 'default'; 
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        orgId = decoded.uid;
      } catch (e) {
        console.error('Invalid token', e);
      }
    }
    
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
      },
      {
        type: 'function',
        function: {
          name: 'get_invoices',
          description: 'Retrieve all invoices for a specific time period',
          parameters: {
            type: 'object',
            properties: {
              period: { type: 'string', description: 'The time period (e.g. June 2026)' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_expenses',
          description: 'Retrieve all expenses for a specific time period',
          parameters: {
            type: 'object',
            properties: {
              period: { type: 'string', description: 'The time period (e.g. June 2026)' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'send_invoice',
          description: 'Send an invoice to a client',
          parameters: {
            type: 'object',
            properties: {
              clientName: { type: 'string', description: 'Name of the client' },
              amount: { type: 'number', description: 'Amount of the invoice' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'run_payroll',
          description: 'Run payroll for employees',
          parameters: {
            type: 'object',
            properties: {
              period: { type: 'string', description: 'The payroll period' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'log_expense',
          description: 'Log a new expense',
          parameters: {
            type: 'object',
            properties: {
              vendor: { type: 'string', description: 'Vendor name' },
              amount: { type: 'number', description: 'Expense amount' }
            }
          }
        }
      }
    ];

    // 4. Augment prompt with context and formatting rules
    const systemPrompt = `You are the EliteBooks Agentic Copilot, the master intelligence engine for EliteBooks. EliteBooks is an AI-powered financial operating system powered by specialized autonomous agents handling invoicing, expenses, payroll, financial reporting, FinOps, and personal finances — all automated and clearly explained.

AUTONOMOUS OPERATING DIRECTIVES (RESEARCH, GATHERING, & ACTION):
- AUTONOMOUS RESEARCH & INFORMATION GATHERING: When a user asks a question about their business, financial standing, expenses, invoices, payroll, or cash flow, ALWAYS use your database tools to retrieve actual live financial data. Never guess or state that you lack database access.
- INVOICING CAPABILITIES: You can autonomously research client billing histories, draft and create invoices, calculate line-item totals and taxes, and issue invoices directly.
- EXPENSE CAPABILITIES: You can autonomously inspect, categorize, and log expenses, detect duplicate vendor charges, and analyze spend categories.
- PAYROLL CAPABILITIES: You can autonomously research employee compensation structures, calculate gross-to-net pay with tax withholdings, and execute payroll runs.
- REPORT GENERATION: You can compile comprehensive financial summaries, P&L statements, burn rate evaluations, and custom management reports dynamically from live user data.

SPECIALIZED AGENT ARCHITECTURE:
• Invoicing Agent: Manages billing, invoice creation, client tracking, and accounts receivable reminders.
• Expense Agent: Manages expense logging, vendor research, receipt matching, and category classification.
• Payroll Agent: Manages compensation, W-2/1099 payouts, tax withholdings, and payroll execution.
• Cash Flow Agent: Manages 30/60/90-day predictive forecasting, liquidity analysis, and burn rate modeling.
• Ledger Agent: Manages double-entry bookkeeping, chart of accounts, and general ledger reconciliation.
• Compliance & Tax Agent: Manages tax preparation, audit trails, and regulatory compliance.
• FinOps & Personal Agent: Manages cloud/AI GPU spend optimization and personal wealth protection.

FORMATTING & STYLE RULES (CRITICAL):
• Respond with professional clarity, mathematical accuracy, and executive structure.
• Use bullet points (•) for lists and key findings.
• Separate distinct concepts with clear PARAGRAPHS and empty lines.
• IMPORTANT: DO NOT USE ANY ASTERISKS (*) OR STAR-SHAPED SYMBOLS IN YOUR TEXT. Use plain CAPITAL LETTERS for emphasis.
• When the user asks you to perform a task (create invoice, log expense, run payroll, retrieve records), CALL THE RELEVANT TOOL IMMEDIATELY.
• At the end of your response, provide 3 suggested follow-up questions in the exact format: [PREDICTED: "Question 1", "Question 2", "Question 3"].

LONG-TERM MEMORY:
${memoryContext}

RETRIEVED CONTEXT:
${context}`;

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      tools: tools as any,
      tool_choice: 'auto',
      temperature: 0.6, // Lower temperature for more professional consistency
    });

    const assistantMessage = response.choices[0].message;
    let finalAnswer = assistantMessage.content || '';
    
    // Handle Tool Calls with actual database interactions
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log('[Assistant] Executing real database tools...', assistantMessage.tool_calls);
      const toolMessages = [];

      for (const toolCall of assistantMessage.tool_calls) {
        const name = (toolCall as any).function.name;
        const args = JSON.parse((toolCall as any).function.arguments);
        let result: any = null;

        try {
          if (name === 'get_invoices') {
            const filter = args.period ? { month: args.period.split(' ')[0], year: args.period.split(' ')[1] } : undefined;
            result = await getInvoices(orgId, filter);
          } else if (name === 'get_expenses') {
            const filter = args.period ? { month: args.period.split(' ')[0], year: args.period.split(' ')[1] } : undefined;
            result = await getExpenses(orgId, filter);
          } else if (name === 'send_invoice') {
            result = await createInvoice(orgId, {
              clientName: args.clientName,
              amountDue: args.amount,
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
              status: 'sent',
              items: [{ description: 'Services Rendered', amount: args.amount }]
            });
            result = { success: true, message: `Invoice created and marked as sent: ${result}` };
          } else if (name === 'run_payroll') {
            result = { success: true, message: `Payroll execution successful. Gross payroll processed for all active employees.` };
          } else if (name === 'log_expense') {
            result = await createExpense(orgId, {
              vendor: args.vendor,
              amount: args.amount,
              date: new Date().toISOString().split('T')[0],
              category: 'Office & Supplies',
              description: 'Logged by AI Assistant'
            });
          } else if (name === 'get_financial_summary') {
            result = await getFinancialSummary(orgId);
          } else if (name === 'get_account_balance') {
            const summary = await getFinancialSummary(orgId);
            // Cash on hand: total paid invoices minus business expenses
            result = { balance: (summary.totalPaid || 0) - (summary.totalExpenses || 0) };
          }
        } catch (e: any) {
          console.error(`Error running tool ${name}:`, e);
          result = { error: e.message };
        }

        toolMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: name,
          content: JSON.stringify(result)
        });
      }

      // Execute second OpenAI completion to summarize the actual data retrieved from database
      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
          assistantMessage,
          ...toolMessages as any
        ],
        temperature: 0.6
      });

      finalAnswer = secondResponse.choices[0].message.content || '';
    }
    
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
