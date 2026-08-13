import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { GraphRAGManager, EntityType, RelationType } from '@/agents/memory/graph-rag';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const orgId = decodedToken.uid;

    // Seed initial graph nodes if empty for demo/user experience
    const node1 = await GraphRAGManager.addEntity(orgId, 'Acme Corp', 'Client', { totalBilled: 17000, status: 'Active VIP' });
    const node2 = await GraphRAGManager.addEntity(orgId, 'Starlight Tech', 'Client', { totalBilled: 8400, status: 'Active' });
    const node3 = await GraphRAGManager.addEntity(orgId, 'Amazon Web Services', 'Vendor', { category: 'Cloud FinOps', monthlySpend: 520 });
    const node4 = await GraphRAGManager.addEntity(orgId, 'INV-2026-0001', 'Transaction', { amount: 8500, status: 'paid' });
    const node5 = await GraphRAGManager.addEntity(orgId, 'INV-2026-0002', 'Transaction', { amount: 4200, status: 'sent' });
    const node6 = await GraphRAGManager.addEntity(orgId, 'Form 1040 Sch C Deductions', 'TaxCategory', { deductibilityRatio: '94.2%' });
    const node7 = await GraphRAGManager.addEntity(orgId, 'GL 1010 - Cash Operating', 'Account', { balance: 13248.81 });

    // Edges
    await GraphRAGManager.addRelation(orgId, node4.id, node1.id, 'BILL_ISSUED_TO');
    await GraphRAGManager.addRelation(orgId, node5.id, node2.id, 'BILL_ISSUED_TO');
    await GraphRAGManager.addRelation(orgId, node4.id, node7.id, 'PAID_TO');
    await GraphRAGManager.addRelation(orgId, node3.id, node6.id, 'SUBJECT_TO_TAX');

    const fullGraph = await GraphRAGManager.getFullGraph(orgId);

    return NextResponse.json({
      success: true,
      data: fullGraph
    });
  } catch (error: any) {
    console.error('GraphRAG GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const orgId = decodedToken.uid;

    const body = await req.json();
    const { action, node, edge } = body;

    if (action === 'create_node' && node) {
      const newNode = await GraphRAGManager.addEntity(
        orgId,
        node.label,
        (node.type || 'Vendor') as EntityType,
        node.properties || {}
      );
      return NextResponse.json({ success: true, data: newNode });
    }

    if (action === 'create_edge' && edge) {
      const newEdge = await GraphRAGManager.addRelation(
        orgId,
        edge.sourceId,
        edge.targetId,
        (edge.relation || 'PAID_TO') as RelationType,
        edge.properties || {}
      );
      return NextResponse.json({ success: true, data: newEdge });
    }

    return NextResponse.json({ error: 'Invalid action payload' }, { status: 400 });
  } catch (error: any) {
    console.error('GraphRAG POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
