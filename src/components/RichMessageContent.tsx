'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ChevronRight, Layers, FileText } from 'lucide-react';
import styles from './RichMessageContent.module.css';

interface RichMessageContentProps {
  content: string;
}

export const RichMessageContent: React.FC<RichMessageContentProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to format inline bold, codes, and currency pills
  const formatInline = (text: string): React.ReactNode => {
    // Split by inline code `...`
    const codeParts = text.split(/(`[^`]+`)/g);

    return codeParts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={pIdx} className={styles.highlightPill}>
            {part.slice(1, -1)}
          </code>
        );
      }

      // Split by bold **...**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
          const inner = bPart.slice(2, -2);
          return (
            <strong key={`${pIdx}-${bIdx}`} className={styles.strongText}>
              {inner}
            </strong>
          );
        }
        return bPart;
      });
    });
  };

  // Parse lines into structured blocks
  const parseBlocks = () => {
    const lines = (content || '').split('\n');
    const blocks: React.ReactNode[] = [];
    let i = 0;
    let blockKey = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code Block: ```
      if (line.trim().startsWith('```')) {
        const lang = line.trim().replace('```', '') || 'code';
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const fullCode = codeLines.join('\n');
        const currentCodeIdx = blockKey;
        blocks.push(
          <div key={`code-${blockKey++}`} className={styles.codeBlockWrapper}>
            <div className={styles.codeHeader}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Terminal size={12} /> {lang}
              </span>
              <button
                type="button"
                className={styles.copyCodeBtn}
                onClick={() => handleCopyCode(fullCode, currentCodeIdx)}
              >
                {copiedIndex === currentCodeIdx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copiedIndex === currentCodeIdx ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className={styles.codeBlock}>
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // Table: lines starting with |
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        if (tableLines.length >= 2) {
          const headerCells = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
          const isSeparator = tableLines[1].includes('---');
          const rowLines = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

          blocks.push(
            <div key={`table-${blockKey++}`} className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx}>{formatInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowLines.map((r, rIdx) => {
                    const cells = r.split('|').slice(1, -1).map(c => c.trim());
                    return (
                      <tr key={rIdx}>
                        {cells.map((c, cIdx) => (
                          <td key={cIdx}>{formatInline(c)}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Section Headers: #, ##, ###
      if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
        const cleanHeader = line.replace(/^#+\s*/, '');
        blocks.push(
          <div key={`header-${blockKey++}`} className={styles.sectionHeader}>
            <Layers size={14} style={{ color: '#60a5fa' }} />
            <span>{cleanHeader}</span>
          </div>
        );
        i++;
        continue;
      }

      // Unordered Bullet List: - or *
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        blocks.push(
          <ul key={`ul-${blockKey++}`} className={styles.bulletList}>
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                <span>{formatInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Numbered List: 1. , 2. 
      if (/^\d+\.\s+/.test(line.trim())) {
        const numItems: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          numItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        blocks.push(
          <ol key={`ol-${blockKey++}`} className={styles.numList}>
            {numItems.map((item, itemIdx) => (
              <li key={itemIdx} className={styles.numItem}>
                <span className={styles.numBadge}>{itemIdx + 1}</span>
                <span>{formatInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Blockquote / Alert: >
      if (line.trim().startsWith('>')) {
        const quoteText = line.trim().replace(/^>\s*/, '');
        blocks.push(
          <div key={`quote-${blockKey++}`} className={styles.calloutCard}>
            {formatInline(quoteText)}
          </div>
        );
        i++;
        continue;
      }

      // Regular Paragraph line
      if (line.trim().length > 0) {
        blocks.push(
          <p key={`p-${blockKey++}`}>
            {formatInline(line)}
          </p>
        );
      }

      i++;
    }

    return blocks;
  };

  return <div className={styles.richContent}>{parseBlocks()}</div>;
};

export default RichMessageContent;
