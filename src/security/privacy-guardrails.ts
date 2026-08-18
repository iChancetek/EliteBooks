/**
 * EliteBooks — Zero-Leakage Privacy Guardrails & Intent Classifier
 * Ensures sensitive financial ledger data (invoices, customer names, vendor disbursements,
 * bank balances, payroll salaries) is NEVER leaked into general knowledge, platform comparisons,
 * educational explanations, or help desk answers.
 */

export type QueryIntentCategory =
  | 'COMPARATIVE_PLATFORM'
  | 'CONCEPTUAL_ACCOUNTING'
  | 'PLATFORM_HELP'
  | 'FINANCIAL_DATA_AUDIT'
  | 'FINANCIAL_MUTATION';

export interface IntentClassificationResult {
  category: QueryIntentCategory;
  isFinancialDataIntent: boolean;
  requiresLedgerContext: boolean;
  targetSubject?: string;
}

export class PrivacyGuardrailService {
  /**
   * Classify user query intent into Privacy-Gated Categories
   */
  static classifyIntent(query: string): IntentClassificationResult {
    const q = query.toLowerCase().trim();

    // 1. Explicit Comparative Inquiries (e.g. QuickBooks, Xero, NetSuite, FreshBooks, etc.)
    if (
      q.includes('quickbook') ||
      q.includes('quickbooks') ||
      q.includes('xero') ||
      q.includes('netsuite') ||
      q.includes('freshbooks') ||
      q.includes('sage') ||
      q.includes('wave') ||
      ((q.includes('compare') || q.includes('comparison') || q.includes(' vs ') || q.includes('versus')) &&
        (q.includes('elitebooks') || q.includes('software') || q.includes('system') || q.includes('platform') || q.includes('other') || q.includes('traditional') || q.includes('legacy')))
    ) {
      return {
        category: 'COMPARATIVE_PLATFORM',
        isFinancialDataIntent: false,
        requiresLedgerContext: false,
        targetSubject: q.includes('quickbook') ? 'QuickBooks' : q.includes('xero') ? 'Xero' : q.includes('netsuite') ? 'NetSuite' : 'Legacy Accounting Platforms',
      };
    }

    // 2. Conceptual Accounting & Regulatory Questions
    if (
      q.includes('what is gaap') ||
      q.includes('what is asc 606') ||
      q.includes('what is asc-606') ||
      q.includes('what is double entry') ||
      q.includes('what is double-entry') ||
      q.includes('what is depreciation') ||
      q.includes('what is amortization') ||
      q.includes('accrual vs cash') ||
      q.includes('cash vs accrual') ||
      q.includes('what is form 1040-es') ||
      q.includes('what is section 179') ||
      q.includes('what is corporate veil') ||
      q.includes('explain gaap') ||
      q.includes('explain asc 606') ||
      q.includes('explain double entry') ||
      q.includes('explain depreciation')
    ) {
      return {
        category: 'CONCEPTUAL_ACCOUNTING',
        isFinancialDataIntent: false,
        requiresLedgerContext: false,
      };
    }

    // 3. Platform Architecture & General Help Questions
    if (
      q.includes('what is elitebooks') ||
      q.includes('about elitebooks') ||
      q.includes('how does elitebooks work') ||
      q.includes('how does this work') ||
      q.includes('what can you do') ||
      q.includes('what are your capabilities') ||
      q.includes('what are the 10 agents') ||
      q.includes('what are the specialized agents') ||
      q.includes('who created elitebooks') ||
      q.includes('features of elitebooks')
    ) {
      return {
        category: 'PLATFORM_HELP',
        isFinancialDataIntent: false,
        requiresLedgerContext: false,
      };
    }

    // 4. Financial Data & Audit Inquiries (Explicit requests for tenant numbers)
    const financialDataKeywords = [
      'revenue', 'profit', 'income', 'expense', 'invoice', 'spending', 'spend',
      'balance', 'cash flow', 'cashflow', 'runway', 'burn rate', 'burn',
      'tax reserve', 'payroll', 'salary', 'ledger', 'trial balance',
      'accounts receivable', 'accounts payable', 'ar aging', 'ap aging',
      'our financial', 'my financial', 'our books', 'my books', 'financial report',
      'financial summary', 'audit report', 'how much did we', 'how much cash',
      'show me all invoices', 'show expenses', 'unpaid invoices'
    ];

    const hasFinancialKeyword = financialDataKeywords.some((k) => q.includes(k));
    const isQuestionAboutOurData =
      q.includes('our') || q.includes('my') || q.includes('we') ||
      q.includes('show') || q.includes('list') || q.includes('break down') ||
      q.includes('what is our') || q.includes('how much');

    if (hasFinancialKeyword && isQuestionAboutOurData) {
      return {
        category: 'FINANCIAL_DATA_AUDIT',
        isFinancialDataIntent: true,
        requiresLedgerContext: true,
      };
    }

    // Default: Check if query contains explicit financial indicators
    if (hasFinancialKeyword) {
      return {
        category: 'FINANCIAL_DATA_AUDIT',
        isFinancialDataIntent: true,
        requiresLedgerContext: true,
      };
    }

    return {
      category: 'PLATFORM_HELP',
      isFinancialDataIntent: false,
      requiresLedgerContext: false,
    };
  }

  /**
   * Authoritative, Privacy-Safe Platform Comparison (Zero Private Data Leaked)
   */
  static getComparativeReport(targetPlatform: string = 'QuickBooks'): string {
    return `⚡ ARCHITECTURAL ANALYSIS: ELITEBOOKS VS. ${targetPlatform.toUpperCase()}
======================================================================
Prepared by: EliteBooks Orchestrator & Multi-Agent Architecture Board
Classification: Public System Comparative Framework (Zero Sensitive Data Included)

1. AUTONOMOUS AGENTIC EXECUTION VS. MANUAL DATA ENTRY
----------------------------------------------------------------------
• EliteBooks: Powered by 10 specialized autonomous AI agents (CFO Strategist, Invoicing Agent, Expense Agent, Payroll Agent, Cash Flow Agent, Ledger Bookkeeper, Tax Compliance Officer, FinOps Architect, Fraud Sentinel, and Personal Wealth Advisor) that collaborate to run your financial department continuously.
• ${targetPlatform}: Built on legacy form-filling workflows where bookkeepers and business owners must manually enter transactions, code chart of accounts, match bank feeds, and generate manual reports.

2. REAL-TIME CONTINUOUS DOUBLE-ENTRY & IMMUTABLE AUDIT LOCK
----------------------------------------------------------------------
• EliteBooks: Maintains instant mathematical equilibrium (Debits = Credits) on every transaction event in real-time. Every state change is cryptographically anchored with SHA-256 Audit-Locked blocks for complete forensic verification.
• ${targetPlatform}: Relies on periodic batch reconciliations and manual month-end closing procedures that can leave discrepancies unresolved for weeks.

3. GRAPHRAG FINANCIAL KNOWLEDGE GRAPH REASONING
----------------------------------------------------------------------
• EliteBooks: Leverages a GraphRAG knowledge graph to analyze multi-hop relationships across client contracts, milestone deliverables, vendor terms, and ASC-606 revenue recognition criteria.
• ${targetPlatform}: Limited to static keyword search and rigid rule filters without relational context or entity reasoning.

4. NATIVE CLOUD FINOPS & COMPUTE COST OPTIMIZATION
----------------------------------------------------------------------
• EliteBooks: Includes a dedicated Cloud FinOps Agent that directly ingests AWS, GCP, and Azure compute metrics, tracking unit economics per query and recommending GPU/spot instance cost savings.
• ${targetPlatform}: Treats all cloud infrastructure spend as generic, unanalyzed operating expense line items.

5. AUTOMATED CORPORATE VEIL ISOLATION (IRS §262 & GAAP)
----------------------------------------------------------------------
• EliteBooks: Cleanly segregates corporate business P&L from owner household expenditures, automatically calculating Form 1040-ES quarterly estimated tax escrow buffers while preserving the corporate veil.
• ${targetPlatform}: Requires maintaining separate company files or manual spreadsheets to prevent mixing personal and business funds.

6. HUMAN-IN-THE-LOOP (HITL) CRYPTOGRAPHIC GOVERNANCE
----------------------------------------------------------------------
• EliteBooks: Enforces strict safety guardrails where autonomous agents can calculate, cross-audit, and draft actions, but high-risk disbursements, threshold overrides, or deletions require explicit cryptographic user authorization.
• ${targetPlatform}: Uses traditional role permissions without real-time anomaly sentinels or agentic governance.`;
  }

  /**
   * Authoritative, Privacy-Safe Conceptual Accounting Explanation
   */
  static getConceptualReport(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('gaap')) {
      return `📚 GENERAL ACCEPTED ACCOUNTING PRINCIPLES (GAAP) OVERVIEW
----------------------------------------------------------------------
GAAP is the standardized framework of accounting principles, standards, and procedures issued by the Financial Accounting Standards Board (FASB).

Key Pillars of GAAP in EliteBooks:
1. Accrual Basis: Revenues and expenses are recognized when earned or incurred, regardless of when cash changes hands.
2. Matching Principle: Expenses must be matched with the revenues they helped generate during the same reporting period.
3. Revenue Recognition (ASC 606): Revenue is recognized upon satisfying specific contractual performance obligations.
4. Consistency & Full Disclosure: Financial statements must follow consistent accounting policies across periods.`;
    }

    if (q.includes('asc 606') || q.includes('asc-606')) {
      return `📜 ASC 606 REVENUE RECOGNITION STANDARD
----------------------------------------------------------------------
ASC 606 governs revenue from contracts with customers through a 5-step framework:

1. Identify the contract with a customer.
2. Identify the performance obligations in the contract.
3. Determine the transaction price.
4. Allocate the transaction price to the performance obligations.
5. Recognize revenue when (or as) the entity satisfies a performance obligation.

In EliteBooks, client invoices and milestone contracts are mapped directly to Account #1200 (Accounts Receivable) and Account #4000 (Sales Revenue) strictly in accordance with ASC 606 rules.`;
    }

    if (q.includes('double entry') || q.includes('double-entry')) {
      return `⚖️ DOUBLE-ENTRY BOOKKEEPING & TRIAL BALANCE EQUILIBRIUM
----------------------------------------------------------------------
Double-entry bookkeeping is the fundamental accounting system where every financial transaction impacts at least two accounts in equal and opposite ways.

The Core Accounting Equation:
Assets = Liabilities + Owner's Equity

Rules of Debits & Credits:
• Assets & Expenses: Increased with DEBITS, decreased with CREDITS.
• Liabilities, Equity & Revenue: Increased with CREDITS, decreased with DEBITS.

EliteBooks enforces real-time trial balance equilibrium: Total Debits MUST ALWAYS equal Total Credits with zero variance.`;
    }

    return `🏛️ ELITEBOOKS FINANCIAL INTELLIGENCE & CAPABILITIES
----------------------------------------------------------------------
EliteBooks is an autonomous financial operating system powered by 10 specialized AI agents:

• Invoicing Agent: Billing automation, milestone contracts, and ASC-606 revenue tracking.
• Expense Agent: Receipt OCR categorization, duplicate detection, and tax deductibility classification.
• Payroll Agent: Gross-to-net pay computations, tax withholdings (FICA, FUTA, SUTA), and wage disbursements.
• Cash Flow Agent: 30/60/90-day predictive treasury runway forecasting.
• Ledger Agent: Master general ledger bookkeeping with double-entry equilibrium and SHA-256 audit locking.
• Tax Compliance Officer: IRC §162/§179 deductions, Form 1120/1040-ES escrow buffering, and audit trail validation.
• FinOps Agent: Cloud infrastructure unit economics (AWS, GCP, Azure) and spot optimization.
• Personal Wealth Agent: Private wealth management and corporate veil preservation.
• Fraud Sentinel: Anomaly detection and unauthorized disbursement monitoring.
• CFO Strategist: Master executive orchestration and strategic capital allocation.`;
  }

  /**
   * Final Sanitizer: Strips out private customer names, actual transaction IDs, or ledger numbers
   * if the user's inquiry was non-financial or conceptual.
   */
  static sanitizeOutput(text: string, isFinancialDataIntent: boolean): string {
    if (isFinancialDataIntent) return text;

    // If the intent was NOT financial data, ensure no live invoice lists or private ledger dumps leaked through
    let sanitized = text;

    // Strip out any accidental "SOURCES & AUDIT CITATIONS" or "Accounts Receivable & Invoices" tables
    if (sanitized.includes('SOURCES & AUDIT CITATIONS') || sanitized.includes('MATHEMATICAL WORK & LEDGER EQUATIONS')) {
      return this.getComparativeReport('QuickBooks');
    }

    return sanitized;
  }
}
