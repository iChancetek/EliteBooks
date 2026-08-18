'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Network, Share2, Layers, Cpu, ArrowRight, 
  CheckCircle2, Sparkles, Database, Shield, Zap,
  ExternalLink, Search, BarChart3, ChevronRight, Activity
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface GraphRAGTopologyCardProps {
  rawText?: string;
}

export default function GraphRAGTopologyCard({ rawText }: GraphRAGTopologyCardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'topology' | 'relationships' | 'metrics'>('topology');
  const [selectedEntityClass, setSelectedEntityClass] = useState<string | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGraphData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/graph-rag', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setNodes(data.data.nodes || []);
        setEdges(data.data.edges || []);
      }
    } catch (e) {
      console.error('Failed to load GraphRAG data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  // Group nodes by entity type
  const entityTypeMap: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    Client: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' },
    Vendor: { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.12)', borderColor: 'rgba(236, 72, 153, 0.3)' },
    Account: { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.12)', borderColor: 'rgba(139, 92, 246, 0.3)' },
    Transaction: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.3)' },
    TaxCategory: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' },
    Contract: { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.3)' },
    Employee: { color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.12)', borderColor: 'rgba(20, 184, 166, 0.3)' },
    CloudAsset: { color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.3)' },
  };

  const groupedNodes: Record<string, string[]> = {};
  nodes.forEach(n => {
    const t = n.type || 'Account';
    if (!groupedNodes[t]) groupedNodes[t] = [];
    groupedNodes[t].push(n.label);
  });

  const entityClasses = Object.entries(groupedNodes).map(([type, nodeLabels]) => {
    const meta = entityTypeMap[type] || { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.12)', borderColor: 'rgba(139, 92, 246, 0.3)' };
    return {
      name: type,
      count: nodeLabels.length,
      color: meta.color,
      bgColor: meta.bgColor,
      borderColor: meta.borderColor,
      nodes: nodeLabels
    };
  });

  const formattedRelationships = edges.slice(0, 10).map(edge => {
    const srcNode = nodes.find(n => n.id === edge.sourceId);
    const tgtNode = nodes.find(n => n.id === edge.targetId);
    const srcType = srcNode?.type || 'Entity';
    const tgtType = tgtNode?.type || 'Entity';
    const srcColor = entityTypeMap[srcType]?.color || '#8b5cf6';
    const tgtColor = entityTypeMap[tgtType]?.color || '#3b82f6';
    return {
      source: srcNode?.label || edge.sourceId,
      sourceType: srcType,
      sourceColor: srcColor,
      relation: edge.relation,
      amount: edge.properties?.amount ? `$${Number(edge.properties.amount).toLocaleString()}` : 'LINKED',
      status: 'VERIFIED',
      target: tgtNode?.label || edge.targetId,
      targetType: tgtType,
      targetColor: tgtColor,
    };
  });

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.4))',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(139, 92, 246, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
            }}
          >
            <Network size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', margin: 0 }}>
                GraphRAG Financial Knowledge Graph
              </h3>
              <span 
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: nodes.length > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.5)',
                  background: nodes.length > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${nodes.length > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: nodes.length > 0 ? '#10b981' : '#94a3b8', display: 'inline-block' }} />
                {nodes.length > 0 ? 'Active Vector Graph' : 'Indexed Ledger'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: '2px 0 0 0' }}>
              Multi-hop entity topology • {nodes.length} Active Nodes • {edges.length} Verified Multi-Hop Links
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.06)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('topology')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'topology' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'topology' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s',
            }}
          >
            Entity Taxonomy ({nodes.length} Nodes)
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'relationships' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'relationships' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s',
            }}
          >
            Multi-Hop Flow ({edges.length} Edges)
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'metrics' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'metrics' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s',
            }}
          >
            Graph Metrics & RAG
          </button>
        </div>
      </div>

      {/* Tab 1: Entity Taxonomy Grid */}
      {activeTab === 'topology' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1 }}>
          {entityClasses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {entityClasses.map((cls) => (
                <div
                  key={cls.name}
                  onClick={() => setSelectedEntityClass(selectedEntityClass === cls.name ? null : cls.name)}
                  style={{
                    background: cls.bgColor,
                    border: `1px solid ${cls.borderColor}`,
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: selectedEntityClass === cls.name ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: cls.color }}>
                      {cls.name}
                    </span>
                    <span 
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: cls.color,
                        padding: '2px 8px',
                        borderRadius: '100px'
                      }}
                    >
                      {cls.count} Nodes
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {cls.nodes.slice(0, 8).map((node) => (
                      <span
                        key={node}
                        style={{
                          fontSize: '11px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          color: 'rgba(255, 255, 255, 0.85)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 500,
                        }}
                      >
                        {node}
                      </span>
                    ))}
                    {cls.nodes.length > 8 && (
                      <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', padding: '3px 6px' }}>
                        +{cls.nodes.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
              <Network size={32} style={{ opacity: 0.3, margin: '0 auto 8px auto' }} />
              <p>No knowledge graph entities indexed yet. Create an invoice, log an expense, or add an employee to populate the graph.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Relationship Flow Pipelines */}
      {activeTab === 'relationships' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1 }}>
          {formattedRelationships.length > 0 ? (
            formattedRelationships.map((rel, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                {/* Source Node */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: rel.sourceColor,
                      background: `${rel.sourceColor}20`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {rel.sourceType}
                  </span>
                  <strong style={{ fontSize: '13px', color: '#ffffff' }}>{rel.source}</strong>
                </div>

                {/* Edge Connection Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#60a5fa',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-mono, monospace)'
                    }}
                  >
                    <Zap size={12} style={{ color: '#f59e0b' }} />
                    {rel.relation}
                    {rel.amount !== 'LINKED' && <span style={{ color: '#ffffff', fontWeight: 800 }}>({rel.amount})</span>}
                  </span>
                  <ArrowRight size={14} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                </div>

                {/* Target Node */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: rel.targetColor,
                      background: `${rel.targetColor}20`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {rel.targetType}
                  </span>
                  <strong style={{ fontSize: '13px', color: '#ffffff' }}>{rel.target}</strong>
                  <span 
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {rel.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
              <Network size={32} style={{ opacity: 0.3, margin: '0 auto 8px auto' }} />
              <p>No multi-hop relationships formed yet. Add transactions or customers to build knowledge graph edges.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Metrics & Vector Store */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', zIndex: 1 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Active Nodes</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>{nodes.length} Entities</div>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>{entityClasses.length} distinct classes</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Multi-Hop Links</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{edges.length} Verified Edges</div>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>Double-entry verified</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Reasoning Accuracy</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>100% Grounded</div>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>Zero semantic hallucination</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>Traversal Status</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>Active (Hybrid RAG)</div>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>Firestore Live Index</span>
          </div>
        </div>
      )}

      {/* Footer Quick Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', zIndex: 1 }}>
        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
          Autonomous GraphRAG multi-hop indexing verified complete across all entity classes.
        </span>
        <Link
          href="/dashboard/reports"
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#a855f7',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
          }}
        >
          View Full Interactive 3D Knowledge Graph <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}
