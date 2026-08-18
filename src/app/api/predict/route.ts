/**
 * EliteBooks — AI Question Prediction API
 * Generates relevant follow-up questions based on the assistant's previous answer
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const context = (body.context || '').toLowerCase();

    let questions = [
      'Explain this in detail',
      'Show ledger balance impact',
      'Forecast 90-day cash flow',
    ];

    if (context.includes('invoice') || context.includes('bill') || context.includes('receivable')) {
      questions = [
        'Show outstanding invoices',
        'Send payment reminder',
        'Check accounts receivable aging',
      ];
    } else if (context.includes('expense') || context.includes('spend') || context.includes('receipt')) {
      questions = [
        'Break down expenses by category',
        'Show top vendor expenses',
        'Log a new expense',
      ];
    } else if (context.includes('personal') || context.includes('household') || context.includes('groceries')) {
      questions = [
        'Show personal spending summary',
        'Add a personal transaction',
        'Check monthly budget status',
      ];
    } else if (context.includes('payroll') || context.includes('salary') || context.includes('employee')) {
      questions = [
        'Show employee payroll summary',
        'Run payroll for this period',
        'Check tax withholding estimates',
      ];
    } else if (context.includes('tax') || context.includes('compliance') || context.includes('1040')) {
      questions = [
        'Check estimated tax reserves',
        'Review 1040-ES requirements',
        'Run compliance audit',
      ];
    }

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      questions: [
        'Explain this in detail',
        'Show ledger balance impact',
        'Forecast 90-day cash flow',
      ],
    });
  }
}
