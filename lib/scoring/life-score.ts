import type { DashboardScores, FinanceSnapshot } from "@/lib/dashboard-data/types";

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function calculateHealthScore(latestHealth: Record<string, number>): number {
  const bmi = latestHealth.bmi || 0;
  const glucose = latestHealth.fasting_glucose || 0;

  if (bmi <= 0 && glucose <= 0) return 0;

  const bmiPenalty = bmi > 0 ? Math.max(0, bmi - 23) * 4 : 0;
  const glucosePenalty = glucose > 0 ? Math.max(0, glucose - 95) * 0.9 : 0;

  return clamp(Math.round(100 - bmiPenalty - glucosePenalty), 0, 100);
}

export function calculateFinanceScore(finance: Pick<FinanceSnapshot, "netWorthGrowth" | "debtRatio">): number {
  if (!Number.isFinite(finance.netWorthGrowth) && !Number.isFinite(finance.debtRatio)) return 0;
  return clamp(Math.round(88 + finance.netWorthGrowth * 80 - finance.debtRatio * 120), 0, 99);
}

export function calculateLifeScore(healthScore: number, financeScore: number): number {
  if (healthScore <= 0 && financeScore <= 0) return 0;
  return clamp(Math.round(healthScore * 0.45 + financeScore * 0.55), 0, 100);
}

export function calculateDashboardScores(input: {
  latestHealth: Record<string, number>;
  finance: Pick<FinanceSnapshot, "netWorthGrowth" | "debtRatio">;
}): DashboardScores {
  const health = calculateHealthScore(input.latestHealth);
  const finance = calculateFinanceScore(input.finance);
  const life = calculateLifeScore(health, finance);

  return {
    life,
    health,
    finance,
    risk: health < 60 ? "High" : health < 75 ? "Watch" : "Low",
  };
}
