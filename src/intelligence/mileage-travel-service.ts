/**
 * EliteBooks Intelligence — Mileage & Business Travel Tracking Service
 * Tracks business vehicle trips, calculates IRS standard mileage deductions ($0.67/mile),
 * and strictly isolates business travel from personal household travel.
 */

import { MileageTripLog } from './types';

export class MileageTravelService {
  public static readonly IRS_RATE_2026 = 0.67; // $0.67 per business mile

  private static defaultTrips: MileageTripLog[] = [
    {
      id: 'trip_001',
      date: '2026-03-12',
      origin: 'New York HQ (Manhattan)',
      destination: 'Hudson Commercial Site (Hudson Yards)',
      distanceMiles: 14.5,
      businessPurpose: 'On-site engineering inspection and contractor alignment',
      isBusiness: true,
      ratePerMile: MileageTravelService.IRS_RATE_2026,
      totalDeductionAmount: 14.5 * MileageTravelService.IRS_RATE_2026,
      projectId: 'proj_hudson_reno',
      classId: 'cls_commercial_const',
      locationId: 'loc_nyc_hq',
      status: 'logged',
      createdAt: '2026-03-12T17:00:00Z',
    },
    {
      id: 'trip_002',
      date: '2026-03-15',
      origin: 'Chicago Studio',
      destination: 'O\'Hare International Airport',
      distanceMiles: 28.0,
      businessPurpose: 'Client travel for Apex Global executive review',
      isBusiness: true,
      ratePerMile: MileageTravelService.IRS_RATE_2026,
      totalDeductionAmount: 28.0 * MileageTravelService.IRS_RATE_2026,
      projectId: 'proj_apex_cloud',
      classId: 'cls_cloud_eng',
      locationId: 'loc_chicago_studio',
      status: 'reconciled_as_expense',
      createdAt: '2026-03-15T10:00:00Z',
    },
  ];

  public static getTrips(): MileageTripLog[] {
    return JSON.parse(JSON.stringify(this.defaultTrips));
  }

  public static logTrip(trip: Omit<MileageTripLog, 'id' | 'ratePerMile' | 'totalDeductionAmount' | 'createdAt'>): MileageTripLog {
    const rate = MileageTravelService.IRS_RATE_2026;
    const deduction = trip.isBusiness ? parseFloat((trip.distanceMiles * rate).toFixed(2)) : 0;

    const newTrip: MileageTripLog = {
      ...trip,
      id: `trip_${Date.now()}`,
      ratePerMile: rate,
      totalDeductionAmount: deduction,
      createdAt: new Date().toISOString(),
    };

    this.defaultTrips.unshift(newTrip);
    return newTrip;
  }
}
