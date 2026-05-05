/**
 * EliteBooks — Ingestion Script
 * Run this to populate Pinecone with documentation
 */

import { ingestContent } from '../lib/rag';

const FEATURES_CONTENT = `
EliteBooks Features Overview:
EliteBooks is an AI-native autonomous accounting platform. It uses 7 specialized AI agents to run your business finances.

1. Smart Invoicing & Billing:
EliteBooks automatically drafts invoices based on your contracts and past billing history. It sends smart reminders to clients before due dates and handles payment processing instantly via credit card, ACH, or wire transfer.
- Automated recurring billing
- Customizable invoice templates
- Smart follow-up sequences
- Multi-currency support
Powered by: Invoice Agent

2. Automated Expense Tracking:
Connect your bank accounts and let EliteBooks do the rest. Our AI scans receipts via OCR, matches them to bank transactions, and automatically categorizes them according to IRS tax codes.
- Plaid bank synchronization
- Receipt OCR & email parsing
- Automatic tax categorization
- Duplicate charge detection
Powered by: Expense Agent

3. Real-Time Financial Reports:
Generate accurate Profit & Loss statements, Balance Sheets, and Cash Flow statements instantly. Use Natural Language Processing to ask questions like "What was my margin on software last month?".
- Interactive P&L & Balance Sheets
- NLP report generation
- Visual charting & forecasting
- One-click export for CPAs
Powered by: Cash Flow Agent

4. Autonomous Payroll:
Manage W-2 employees and 1099 contractors. The system calculates taxes, handles direct deposits, and files compliance forms automatically.
- Automated tax withholdings
- Contractor & Employee support
- Direct deposit integration
- Automated W-2/1099 generation
Powered by: Payroll Agent

5. Intelligent Inventory:
Track stock levels across multiple locations. Calculates COGS dynamically and uses predictive AI for reorder alerts.
- Multi-location tracking
- Predictive reorder alerts
- Dynamic COGS calculation
- Supplier performance tracking
Powered by: Ledger Agent

6. Tax & Compliance:
Monitors transactions against tax laws. Flags missing documents and prepares quarterly filings.
- Quarterly tax estimations
- Compliance document monitoring
- Immutable audit trails
- Instant CPA access
Powered by: Compliance Agent

7. Autonomous Orchestrator:
The master brain coordinating your team. Plans workflows, delegates tasks, and ensures system synchronization.
- Cross-agent coordination
- Automated task delegation
- Conflict resolution
- Continuous system monitoring
Powered by: Orchestrator Agent

8. Professional Bookkeeping:
Full double-entry bookkeeping, trial balances, and journal entries.
- Double-entry ledger system
- Automated journal entries
- Precise trial balances
- GAAP/IFRS compliance support
Powered by: Ledger Agent

9. Bank Reconciliation:
Automatically compares bank statements with internal ledger.
- Automated bank matching
- Discrepancy detection
- Balance verification
- Multi-account support
Powered by: Ledger Agent

10. Voice Intelligence:
Talk to your books in any language. STT and TTS technology for natural interaction.
- Multi-lingual support
- Natural language queries
- Voice-to-action commands
- Premium AI voices
Powered by: Orchestrator Agent
`;

export async function runIngestion() {
  console.log('Starting ingestion...');
  try {
    await ingestContent(FEATURES_CONTENT, 'EliteBooks Features', 'features-page');
    console.log('Ingestion completed successfully!');
  } catch (error) {
    console.error('Ingestion failed:', error);
  }
}

// If running directly
if (require.main === module) {
  runIngestion();
}
