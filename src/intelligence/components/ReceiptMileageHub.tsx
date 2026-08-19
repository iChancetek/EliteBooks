'use client';

import React, { useState } from 'react';
import { Camera, Car, Upload, Check, Plus, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { ReceiptExtractionResult, MileageTripLog } from '../types';
import { ReceiptIntelligenceService } from '../receipt-intelligence';
import { MileageTravelService } from '../mileage-travel-service';
import { formatCurrency } from '@/lib/utils';

interface ReceiptMileageHubProps {
  onLogExpenseFromReceipt?: (receipt: ReceiptExtractionResult) => void;
  onTripLogged?: (trip: MileageTripLog) => void;
}

export default function ReceiptMileageHub({
  onLogExpenseFromReceipt,
  onTripLogged,
}: ReceiptMileageHubProps) {
  const [activeTab, setActiveTab] = useState<'receipts' | 'mileage'>('receipts');
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [extractedReceipt, setExtractedReceipt] = useState<ReceiptExtractionResult | null>(null);

  // Mileage Form State
  const [trips, setTrips] = useState<MileageTripLog[]>(MileageTravelService.getTrips());
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number>(10);
  const [purpose, setPurpose] = useState('');
  const [isBusiness, setIsBusiness] = useState(true);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingReceipt(true);
    setExtractedReceipt(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const response = await fetch('/api/intelligence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'ocr_receipt',
            payload: {
              fileName: file.name,
              fileDataUri: dataUri,
            },
          }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          setExtractedReceipt(data.data);
        } else {
          // Fallback
          const fallback = await ReceiptIntelligenceService.processReceiptWithVision(file.name, dataUri);
          setExtractedReceipt(fallback);
        }
      } catch (err) {
        console.error('Vision API error, fallback heuristic:', err);
        const fallback = await ReceiptIntelligenceService.processReceiptWithVision(file.name, dataUri);
        setExtractedReceipt(fallback);
      } finally {
        setIsProcessingReceipt(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSimulatedUpload = async (presetFileName: string) => {
    setIsProcessingReceipt(true);
    setExtractedReceipt(null);
    try {
      const res = await ReceiptIntelligenceService.processReceiptWithVision(presetFileName);
      setExtractedReceipt(res);
    } finally {
      setIsProcessingReceipt(false);
    }
  };

  const handleSaveTrip = () => {
    if (!origin.trim() || !destination.trim() || !purpose.trim()) return;
    const newTrip = MileageTravelService.logTrip({
      date: new Date().toISOString().split('T')[0],
      origin,
      destination,
      distanceMiles: distance,
      businessPurpose: purpose,
      isBusiness,
      status: 'logged',
    });
    setTrips([newTrip, ...trips]);
    if (onTripLogged) onTripLogged(newTrip);
    setOrigin('');
    setDestination('');
    setPurpose('');
  };

  const totalMileageDeductions = trips
    .filter((t) => t.isBusiness)
    .reduce((s, t) => s + (t.totalDeductionAmount || 0), 0);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
      border: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.15))',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: 'var(--color-text-primary, #f1f5f9)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)',
          }}>
            <Camera size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>AI Receipts & Business Mileage Hub</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
              Optical document extraction, expense draft generation, and IRS mileage deduction tracking
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('receipts')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'receipts' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            Receipt OCR Pipeline
          </button>
          <button
            onClick={() => setActiveTab('mileage')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'mileage' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            }}
          >
            Mileage Deduction Tracker
          </button>
        </div>
      </div>

      {/* Tab 1: AI Receipts */}
      {activeTab === 'receipts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)', gap: '16px' }}>
          {/* Dropzone & Presets */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '12px',
          }}>
            <input
              type="file"
              accept="image/*,.pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Upload size={24} color="#06b6d4" />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, display: 'block' }}>Upload or Drop Receipt / Invoice</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>PNG, JPG, PDF supported up to 25MB • OpenAI Vision OCR</span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)',
              }}
            >
              Choose Image / Take Photo
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '6px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>OR PROCESS SAMPLE DOCUMENT:</span>
              <button
                type="button"
                onClick={() => handleSimulatedUpload('Home_Depot_Materials_Invoice.pdf')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Scan: Home Depot Materials Invoice ($485.20)
              </button>
              <button
                type="button"
                onClick={() => handleSimulatedUpload('AWS_Cloud_Infrastructure_Bill.pdf')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Scan: AWS Cloud Services Invoice ($1,420.50)
              </button>
            </div>
          </div>

          {/* Extracted Receipt Preview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>Document Intelligence Extraction Output</h4>

            {isProcessingReceipt ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#06b6d4', fontSize: '13px' }}>
                Executing OCR & neural entity extraction...
              </div>
            ) : extractedReceipt ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{extractedReceipt.merchant}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}>
                    {Math.round(extractedReceipt.confidenceScore * 100)}% CONFIDENCE
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
                  <div>• Date: <strong>{extractedReceipt.date}</strong></div>
                  <div>• Total: <strong style={{ color: '#10b981' }}>{formatCurrency(extractedReceipt.totalAmount)}</strong></div>
                  <div>• Tax: <strong>{formatCurrency(extractedReceipt.taxAmount || 0)}</strong></div>
                  <div>• Category: <strong>{extractedReceipt.suggestedCategory}</strong></div>
                </div>

                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  fontSize: '11px',
                  color: '#94a3b8',
                }}>
                  Payment Method: {extractedReceipt.paymentMethodDetected}
                </div>

                <button
                  type="button"
                  onClick={() => onLogExpenseFromReceipt && onLogExpenseFromReceipt(extractedReceipt)}
                  style={{
                    marginTop: '6px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={14} /> Approve & Log as Verified Expense
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '12px' }}>
                Upload or select a sample document to test optical extraction
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Mileage Tracking */}
      {activeTab === 'mileage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)', gap: '16px' }}>
          {/* Mileage Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>Log Business Trip</h4>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8' }}>Origin</label>
              <input
                type="text"
                placeholder="e.g. New York HQ"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8' }}>Destination</label>
              <input
                type="text"
                placeholder="e.g. Hudson Commercial Site"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Distance (Miles)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Deduction ($0.67/mi)</label>
                <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 800, fontSize: '12px' }}>
                  {formatCurrency(distance * MileageTravelService.IRS_RATE_2026)}
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8' }}>Business Purpose</label>
              <input
                type="text"
                placeholder="e.g. On-site engineering audit"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSaveTrip}
              disabled={!origin.trim() || !destination.trim() || !purpose.trim()}
              style={{
                marginTop: '4px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: !origin.trim() || !destination.trim() || !purpose.trim() ? 0.5 : 1,
              }}
            >
              Log Tax-Deductible Trip
            </button>
          </div>

          {/* Trip Log History */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>Recorded Travel Log</h4>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 800 }}>
                Total Tax Deductions: {formatCurrency(totalMileageDeductions)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {trips.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{t.origin} → {t.destination}</div>
                    <div style={{ color: '#94a3b8', marginTop: '2px' }}>{t.businessPurpose} • {t.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#10b981', fontWeight: 800 }}>+{formatCurrency(t.totalDeductionAmount)}</div>
                    <div style={{ color: '#64748b' }}>{t.distanceMiles} mi</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
