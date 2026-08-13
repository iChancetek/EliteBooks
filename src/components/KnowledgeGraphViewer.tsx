'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  GitFork, Plus, Search, Filter, Network, RefreshCw, X, Check,
  Share2, ArrowRight, Database, Tag, Shield, Cpu, Sparkles, Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface GraphNodeData {
  id: string;
  label: string;
  type: 'Vendor' | 'Client' | 'Transaction' | 'Account' | 'TaxCategory' | 'Contract' | 'CloudAsset' | 'Employee';
  properties: Record<string, any>;
  x?: number;
  y?: number;
}

export interface GraphEdgeData {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  properties?: Record<string, any>;
}

const entityColors: Record<string, string> = {
  Vendor: '#ec4899',
  Client: '#10b981',
  Transaction: '#3b82f6',
  Account: '#8b5cf6',
  TaxCategory: '#f59e0b',
  Contract: '#06b6d4',
  CloudAsset: '#6366f1',
  Employee: '#14b8a6',
};

export default function KnowledgeGraphViewer() {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<GraphNodeData[]>([]);
  const [edges, setEdges] = useState<GraphEdgeData[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isAddEdgeOpen, setIsAddEdgeOpen] = useState(false);

  // New Node Form
  const [newNode, setNewNode] = useState({
    label: '',
    type: 'Vendor',
    propertyKey: '',
    propertyValue: ''
  });

  // New Edge Form
  const [newEdge, setNewEdge] = useState({
    sourceId: '',
    targetId: '',
    relation: 'PAID_TO'
  });

  const fetchGraphData = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/graph-rag', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        const rawNodes: GraphNodeData[] = data.data.nodes || [];
        const rawEdges: GraphEdgeData[] = data.data.edges || [];

        // Arrange nodes in circular / grid coordinates for SVG rendering
        const radius = 180;
        const centerX = 350;
        const centerY = 240;
        const total = rawNodes.length;

        const positionedNodes = rawNodes.map((n, i) => {
          const angle = (i / Math.max(1, total)) * 2 * Math.PI - Math.PI / 2;
          return {
            ...n,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          };
        });

        setNodes(positionedNodes);
        setEdges(rawEdges);
      }
    } catch (e) {
      console.error('Failed to load knowledge graph:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newNode.label.trim()) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/graph-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_node',
          node: {
            id: `node-${Date.now()}`,
            label: newNode.label,
            type: newNode.type,
            properties: newNode.propertyKey ? { [newNode.propertyKey]: newNode.propertyValue } : {}
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAddNodeOpen(false);
        setNewNode({ label: '', type: 'Vendor', propertyKey: '', propertyValue: '' });
        fetchGraphData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateEdge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEdge.sourceId || !newEdge.targetId) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/graph-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_edge',
          edge: {
            sourceId: newEdge.sourceId,
            targetId: newEdge.targetId,
            relation: newEdge.relation
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAddEdgeOpen(false);
        setNewEdge({ sourceId: '', targetId: '', relation: 'PAID_TO' });
        fetchGraphData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredNodes = nodes.filter(n => {
    const matchSearch = n.label.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || n.type === filterType;
    return matchSearch && matchType;
  });

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
              GraphRAG Financial Knowledge Graph
            </h2>
            <span className="badge badge-accent">
              <Network size={12} /> {nodes.length} Nodes • {edges.length} Edges
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Multi-hop entity relationships connecting Vendors, Clients, Invoices, Accounts, and Tax Rules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button className="btn btn-sm btn-secondary" onClick={() => setIsAddEdgeOpen(true)}>
            <GitFork size={14} /> Connect Edge
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAddNodeOpen(true)}>
            <Plus size={14} /> Add Node
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div className="inv-search" style={{ flex: 1, minWidth: '220px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search graph nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {['All', 'Vendor', 'Client', 'Transaction', 'Account', 'TaxCategory'].map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visual Canvas */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 300px' : '1fr', gap: 'var(--space-5)', minHeight: '480px' }}>
        <div
          style={{
            position: 'relative',
            background: 'rgba(6, 9, 15, 0.85)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-primary)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? (
            <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} className="animate-spin" /> Rendering Knowledge Graph...
            </div>
          ) : (
            <svg width="100%" height="480" viewBox="0 0 700 480" style={{ background: 'transparent' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.4)" />
                </marker>
              </defs>

              {/* Render Edges */}
              {edges.map((e) => {
                const src = nodeMap.get(e.sourceId);
                const tgt = nodeMap.get(e.targetId);
                if (!src || !tgt) return null;

                const sx = src.x || 350;
                const sy = src.y || 240;
                const tx = tgt.x || 350;
                const ty = tgt.y || 240;
                const mx = (sx + tx) / 2;
                const my = (sy + ty) / 2;

                return (
                  <g key={e.id}>
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke="rgba(99, 131, 196, 0.35)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      markerEnd="url(#arrow)"
                    />
                    <rect
                      x={mx - 35}
                      y={my - 10}
                      width="70"
                      height="18"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="rgba(99, 131, 196, 0.2)"
                    />
                    <text
                      x={mx}
                      y={my + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {e.relation}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((n) => {
                const nodeColor = entityColors[n.type] || '#3b82f6';
                const isSelected = selectedNode?.id === n.id;
                const nx = n.x || 350;
                const ny = n.y || 240;

                return (
                  <g
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle
                        cx={nx}
                        cy={ny}
                        r="32"
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        style={{ animation: 'spin 10s linear infinite' }}
                      />
                    )}
                    <circle
                      cx={nx}
                      cy={ny}
                      r="22"
                      fill={nodeColor}
                      opacity={0.2}
                    />
                    <circle
                      cx={nx}
                      cy={ny}
                      r="14"
                      fill={nodeColor}
                      stroke="#06090f"
                      strokeWidth="3"
                      style={{ filter: `drop-shadow(0 0 10px ${nodeColor})` }}
                    />
                    <text
                      x={nx}
                      y={ny + 28}
                      fill="#f1f5f9"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {n.label}
                    </text>
                    <text
                      x={nx}
                      y={ny + 40}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {n.type}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div
            className="glass-card animate-slide-left"
            style={{
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              background: 'var(--color-bg-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                className="badge"
                style={{
                  background: `${entityColors[selectedNode.type] || '#3b82f6'}20`,
                  color: entityColors[selectedNode.type] || '#3b82f6',
                  fontWeight: 700
                }}
              >
                {selectedNode.type}
              </span>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setSelectedNode(null)}>
                <X size={14} />
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
                {selectedNode.label}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                ID: {selectedNode.id}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Properties & Graph Attributes:
              </div>
              {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 ? (
                Object.entries(selectedNode.properties).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', margin: '4px 0' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{k}:</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {String(v)}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                  No extra custom attributes.
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Connected Graph Edges:
              </div>
              {edges.filter(e => e.sourceId === selectedNode.id || e.targetId === selectedNode.id).map(e => {
                const isSource = e.sourceId === selectedNode.id;
                const otherNodeId = isSource ? e.targetId : e.sourceId;
                const otherNode = nodeMap.get(otherNodeId);
                return (
                  <div key={e.id} style={{ fontSize: '11px', padding: '6px', background: 'var(--color-bg-tertiary)', borderRadius: '4px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowRight size={12} style={{ color: 'var(--color-accent-primary)' }} />
                    <span><strong>{e.relation}</strong> {isSource ? '→' : '←'} {otherNode?.label || otherNodeId}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Node Modal */}
      {isAddNodeOpen && (
        <div className="modal-overlay" onClick={() => setIsAddNodeOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2>Add Knowledge Graph Node</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsAddNodeOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateNode} className="modal-form">
              <div className="form-group">
                <label>Node Label / Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. OpenAI API, Stripe Payments"
                  value={newNode.label}
                  onChange={e => setNewNode({...newNode, label: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Entity Type</label>
                <select
                  className="input"
                  value={newNode.type}
                  onChange={e => setNewNode({...newNode, type: e.target.value as any})}
                >
                  <option value="Vendor">Vendor</option>
                  <option value="Client">Client</option>
                  <option value="Transaction">Transaction</option>
                  <option value="Account">Account</option>
                  <option value="TaxCategory">Tax Category</option>
                  <option value="Employee">Employee</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Property Key</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. taxRatio"
                    value={newNode.propertyKey}
                    onChange={e => setNewNode({...newNode, propertyKey: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Property Value</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 100%"
                    value={newNode.propertyValue}
                    onChange={e => setNewNode({...newNode, propertyValue: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddNodeOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Node</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Edge Modal */}
      {isAddEdgeOpen && (
        <div className="modal-overlay" onClick={() => setIsAddEdgeOpen(false)}>
          <div className="modal-content glass-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2>Connect Graph Edge (Relation)</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setIsAddEdgeOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateEdge} className="modal-form">
              <div className="form-group">
                <label>Source Node</label>
                <select
                  className="input"
                  value={newEdge.sourceId}
                  onChange={e => setNewEdge({...newEdge, sourceId: e.target.value})}
                  required
                >
                  <option value="">Select source node...</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label} ({n.type})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Relation Edge Type</label>
                <select
                  className="input"
                  value={newEdge.relation}
                  onChange={e => setNewEdge({...newEdge, relation: e.target.value})}
                >
                  <option value="PAID_TO">PAID_TO</option>
                  <option value="BILL_ISSUED_TO">BILL_ISSUED_TO</option>
                  <option value="CATEGORIZED_AS">CATEGORIZED_AS</option>
                  <option value="SUBJECT_TO_TAX">SUBJECT_TO_TAX</option>
                  <option value="SUB_CONTRACTOR_OF">SUB_CONTRACTOR_OF</option>
                  <option value="OWES_BALANCE">OWES_BALANCE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Node</label>
                <select
                  className="input"
                  value={newEdge.targetId}
                  onChange={e => setNewEdge({...newEdge, targetId: e.target.value})}
                  required
                >
                  <option value="">Select target node...</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label} ({n.type})</option>)}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddEdgeOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Connect Edge</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
