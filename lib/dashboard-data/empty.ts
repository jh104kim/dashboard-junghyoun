import type { DashboardData, DashboardSource } from "@/lib/dashboard-data/types";

export function createEmptyDashboardData(source: DashboardSource = "empty", warnings: string[] = []): DashboardData {
  return {
    generatedAt: new Date().toISOString(),
    source,
    warnings,
    scores: {
      life: 0,
      health: 0,
      finance: 0,
      risk: "Watch",
    },
    health: {
      latest: {},
      series: [],
      actions: [],
      priorities: [],
      monitoring: [],
      anomalies: [],
    },
    finance: {
      netWorth: 0,
      projected: 0,
      assets: 0,
      debt: 0,
      debtRatio: 0,
      netWorthGrowth: 0,
      assetComposition: [],
      targetMonthlyIncome: 10000000,
      projectedMonthlyPension: 0,
      monthlyIncomeGap: 10000000,
      taxSuggestions: [],
    },
    investment: [],
    pension: [],
    tax: [],
  };
}
