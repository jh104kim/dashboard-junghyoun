export type DashboardSource = "supabase" | "csv" | "empty";

export type HealthSeries = {
  id: string;
  label: string;
  unit: string;
  values: Array<{
    year: number;
    value: number;
  }>;
};

export type HealthAction = {
  item: string;
  status_or_value?: string | null;
  dashboard_note: string;
};

export type FinanceSnapshot = {
  netWorth: number;
  projected: number;
  assets: number;
  debt: number;
  debtRatio: number;
  netWorthGrowth: number;
  assetComposition: Array<{
    label: string;
    value: number;
  }>;
  targetMonthlyIncome: number;
  projectedMonthlyPension: number;
  monthlyIncomeGap: number;
  taxSuggestions: string[];
};

export type InvestmentHolding = {
  name: string;
  value: number;
  gain: number;
  returnPct: number;
};

export type PensionPoint = {
  year: number;
  amount: number;
};

export type TaxPoint = {
  year: number;
  amount: number;
};

export type DashboardScores = {
  life: number;
  health: number;
  finance: number;
  risk: "Low" | "Watch" | "High";
};

export type DashboardData = {
  generatedAt: string;
  source: DashboardSource;
  warnings: string[];
  scores: DashboardScores;
  health: {
    latest: Record<string, number>;
    series: HealthSeries[];
    actions: HealthAction[];
    priorities: HealthAction[];
    monitoring: string[];
    anomalies: string[];
  };
  finance: FinanceSnapshot;
  investment: InvestmentHolding[];
  pension: PensionPoint[];
  tax: TaxPoint[];
};

export type DashboardSourceResult = {
  ok: boolean;
  source: DashboardSource;
  data?: DashboardData;
  reason?: string;
  warnings?: string[];
};
