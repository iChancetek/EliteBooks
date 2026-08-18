'use client';

import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Upload, Check, AlertCircle } from 'lucide-react';
import { ExcelSyncService } from '../excel-sync-service';
import { ExcelSyncPreview } from '../types';

interface ExcelSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoicesData?: any[];
  expensesData?: any[];
}

export default function ExcelSyncModal({
  isOpen,
  onClose,
  invoicesData = [],
  expensesData = [],
}: ExcelSyncModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [selectedType, setSelectedType] = useState<'invoices' | 'expenses'>('invoices');
  const [importPreview, setImportPreview] = useState<ExcelSyncPreview | null>(null);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const dataToExport = selectedType === 'invoices' ? invoicesData : expensesData;
    const csv = ExcelSyncService.exportToCsv(selectedType, dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EliteBooks_${selectedType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulatedImport = () => {
    const sampleCsv = selectedType === 'invoices'
      ? `Invoice #,Client Name,Issue Date,Due Date,Amount / Total,Project\nINV-9001,Acme Corp,2026-03-01,2026-03-31,14500,PRJ-2026-001\nINV-9002,Starlight Media,2026-03-02,2026-04-01,22000,PRJ-2026-002`
      : `Vendor / Merchant,Date,Amount,Category,Project\nGoogle Workspace,2026-03-01,72.00,Software,PRJ-2026-001\nDelta Airlines,2026-03-02,540.00,Travel,PRJ-2026-002`;

    const preview = ExcelSyncService.parseImportData(selectedType, sampleCsv, `Sample_${selectedType}.csv`);
    setImportPreview(preview);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--color-bg-primary, #0c1220)',
        border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
        borderRadius: '20px',
        maxWidth: '650px',
        width: '100%',
        padding: '28px',
        color: 'var(--color-text-primary, #f1f5f9)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileSpreadsheet size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Excel & CSV Bi-Directional Synchronizer</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Controlled synchronization, field mapping, and preview verification
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'export' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            Export to Excel / CSV
          </button>
          <button
            onClick={() => setActiveTab('import')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'import' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            Import from Spreadsheet
          </button>
        </div>

        {/* Export View */}
        {activeTab === 'export' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Select Dataset to Export</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              >
                <option value="invoices" style={{ background: '#0f172a' }}>Live Invoices ({invoicesData.length} records)</option>
                <option value="expenses" style={{ background: '#0f172a' }}>Live Operating Expenses ({expensesData.length} records)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              style={{
                marginTop: '10px',
                padding: '12px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Download size={16} /> Download {selectedType.toUpperCase()} CSV Export
            </button>
          </div>
        )}

        {/* Import View */}
        {activeTab === 'import' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '2px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, display: 'block' }}>Drop spreadsheet or test sample mapping</span>
              <button
                type="button"
                onClick={handleSimulatedImport}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Load Sample {selectedType.toUpperCase()} Import Preview
              </button>
            </div>

            {importPreview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                  Preview: {importPreview.totalRows} valid records parsed from {importPreview.fileName}
                </span>
                <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {importPreview.parsedRecords.map((rec, rIdx) => (
                    <div key={rIdx} style={{ padding: '6px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '11px' }}>
                      {JSON.stringify(rec)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
