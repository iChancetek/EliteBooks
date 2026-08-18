/**
 * EliteBooks Intelligence — Dimensions Service (Unlimited Classes & Locations)
 * Manages multidimensional financial reporting across departments, service lines, programs,
 * physical offices, and construction job sites.
 */

import { FinancialClass, FinancialLocation } from './types';

export class DimensionsService {
  private static defaultClasses: FinancialClass[] = [
    {
      id: 'cls_commercial_const',
      name: 'Commercial Construction',
      code: 'CLS-100',
      description: 'Commercial tenant buildout, structural renovation, and MEP engineering',
      isActive: true,
      totalRevenue: 288000,
      totalExpenses: 124500,
      netProfit: 163500,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'cls_digital_infra',
      name: 'Digital Infrastructure',
      code: 'CLS-200',
      description: 'Studio engineering, audiovisual systems, and low-voltage digital networks',
      isActive: true,
      totalRevenue: 216000,
      totalExpenses: 98400,
      netProfit: 117600,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'cls_cloud_eng',
      name: 'Cloud & AI Consulting',
      code: 'CLS-300',
      description: 'Enterprise AI architecture, Kubernetes migrations, and FinOps advisory',
      isActive: true,
      totalRevenue: 110000,
      totalExpenses: 48200,
      netProfit: 61800,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'cls_corp_overhead',
      name: 'General Corporate Overhead',
      code: 'CLS-900',
      description: 'Administrative, legal, SaaS subscriptions, and corporate compliance',
      isActive: true,
      totalRevenue: 0,
      totalExpenses: 5337.18,
      netProfit: -5337.18,
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  private static defaultLocations: FinancialLocation[] = [
    {
      id: 'loc_nyc_hq',
      name: 'New York Headquarters',
      code: 'LOC-NY-01',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      type: 'office',
      isActive: true,
      totalRevenue: 347400,
      totalExpenses: 142000,
      netProfit: 205400,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'loc_chicago_studio',
      name: 'Chicago Media Studio',
      code: 'LOC-IL-02',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      type: 'job_site',
      isActive: true,
      totalRevenue: 216000,
      totalExpenses: 98400,
      netProfit: 117600,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'loc_london_branch',
      name: 'London Advisory Branch',
      code: 'LOC-UK-03',
      city: 'London',
      country: 'UK',
      type: 'office',
      isActive: true,
      totalRevenue: 110000,
      totalExpenses: 48200,
      netProfit: 61800,
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  public static getClasses(): FinancialClass[] {
    return JSON.parse(JSON.stringify(this.defaultClasses));
  }

  public static getLocations(): FinancialLocation[] {
    return JSON.parse(JSON.stringify(this.defaultLocations));
  }

  public static addClass(newClass: Omit<FinancialClass, 'id' | 'createdAt'>): FinancialClass {
    const cls: FinancialClass = {
      ...newClass,
      id: `cls_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.defaultClasses.push(cls);
    return cls;
  }

  public static addLocation(newLoc: Omit<FinancialLocation, 'id' | 'createdAt'>): FinancialLocation {
    const loc: FinancialLocation = {
      ...newLoc,
      id: `loc_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.defaultLocations.push(loc);
    return loc;
  }
}
