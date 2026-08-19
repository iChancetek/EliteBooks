import { NextRequest, NextResponse } from 'next/server';
import { HRAgentService } from '@/hr/hr-agent-service';

export async function GET(req: NextRequest) {
  try {
    const employees = HRAgentService.getEmployees();
    const ptoRequests = HRAgentService.getPTORequests();
    const timesheets = HRAgentService.getTimesheets();
    const benefitPlans = HRAgentService.getBenefitPlans();
    const metrics = HRAgentService.getWorkforceMetrics();
    const classificationAudits = HRAgentService.auditWorkerClassificationRisk();

    return NextResponse.json({
      success: true,
      data: {
        employees,
        ptoRequests,
        timesheets,
        benefitPlans,
        metrics,
        classificationAudits,
      },
    });
  } catch (error: any) {
    console.error('[HR API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'request_pto') {
      const pto = HRAgentService.requestPTO(payload);
      return NextResponse.json({ success: true, data: pto });
    }

    if (action === 'approve_pto') {
      const result = HRAgentService.approvePTO(payload.requestId, payload.reviewerName);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'log_timesheet') {
      const result = HRAgentService.logTimesheet(payload);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: 'Unknown HR action' }, { status: 400 });
  } catch (error: any) {
    console.error('[HR Action API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
