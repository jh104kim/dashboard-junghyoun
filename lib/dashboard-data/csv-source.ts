import { readCsv, toNumber } from "@/lib/csv";
import { calculateDashboardScores } from "@/lib/scoring/life-score";
import { createEmptyDashboardData } from "@/lib/dashboard-data/empty";
import type { DashboardData, DashboardSourceResult } from "@/lib/dashboard-data/types";

type HealthMetricRow = {
  year: string;
  metric_id: string;
  metric_label: string;
  value_text: string;
  value_numeric: string;
  unit: string;
};

type HealthActionRow = {
  item: string;
  status_or_value: string;
  dashboard_note: string;
};

type NetWorthRow = {
  metric: string;
  date_or_scenario: string;
  value_krw: string;
  value_text: string;
};

type HoldingRow = {
  instrument: string;
  market_value_krw: string;
  gain_loss_krw: string;
  return_pct: string;
};

type PensionRow = {
  year: string;
  age: string;
  category: string;
  annual_amount_thousand_krw: string;
};

type TaxRow = {
  tax_year: string;
  tax_type: string;
  amount_krw: string;
};

export async function getCsvDashboardData(): Promise<DashboardSourceResult> {
  const [healthRows, actions, netWorthRows, holdings, pensionRows, taxRows] = await Promise.all([
    readCsv<HealthMetricRow>("health_key_yearly_metrics.csv"),
    readCsv<HealthActionRow>("health_findings_actions.csv"),
    readCsv<NetWorthRow>("finance_net_worth_snapshot.csv"),
    readCsv<HoldingRow>("finance_investment_holdings.csv"),
    readCsv<PensionRow>("finance_pension_cashflow_by_year.csv"),
    readCsv<TaxRow>("finance_tax_by_year_type.csv"),
  ]);

  const rowCount =
    healthRows.length + actions.length + netWorthRows.length + holdings.length + pensionRows.length + taxRows.length;

  if (rowCount === 0) {
    return {
      ok: false,
      source: "empty",
      reason: "No local CSV dashboard data found.",
      data: createEmptyDashboardData("empty", ["No local CSV dashboard data found."]),
    };
  }

  return {
    ok: true,
    source: "csv",
    data: buildDashboardData({
      healthRows,
      actions,
      netWorthRows,
      holdings,
      pensionRows,
      taxRows,
      source: "csv",
      warnings: [],
    }),
  };
}

export function buildDashboardData(input: {
  healthRows: HealthMetricRow[];
  actions: HealthActionRow[];
  netWorthRows: NetWorthRow[];
  holdings: HoldingRow[];
  pensionRows: PensionRow[];
  taxRows: TaxRow[];
  source: "csv" | "supabase";
  warnings: string[];
}): DashboardData {
  const healthSeries = ["bmi", "fasting_glucose", "systolic_bp", "diastolic_bp"].map((metricId) => {
    const metricRows = input.healthRows
      .filter((row) => row.metric_id === metricId)
      .sort((a, b) => toNumber(a.year) - toNumber(b.year));
    return {
      id: metricId,
      label: metricRows[0]?.metric_label ?? metricId,
      unit: metricRows[0]?.unit ?? "",
      values: metricRows.map((row) => ({
        year: toNumber(row.year),
        value: toNumber(row.value_numeric),
      })),
    };
  });

  const latestHealth = Object.fromEntries(
    healthSeries.map((series) => [series.id, series.values.at(-1)?.value ?? 0]),
  );

  const currentNetWorth = input.netWorthRows.find(
    (row) => row.metric === "순자산 (Net Worth)" && row.date_or_scenario.includes("current"),
  );
  const projectedNetWorth = input.netWorthRows.find(
    (row) => row.metric === "순자산 (Net Worth)" && row.date_or_scenario.includes("projected"),
  );
  const currentAssets = input.netWorthRows.find(
    (row) => row.metric === "자산 총계" && row.date_or_scenario.includes("current"),
  );
  const currentDebt = input.netWorthRows.find(
    (row) => row.metric.includes("부채") && row.date_or_scenario.includes("current"),
  );

  const investment = input.holdings
    .map((row) => ({
      name: row.instrument,
      value: toNumber(row.market_value_krw),
      gain: toNumber(row.gain_loss_krw),
      returnPct: toNumber(row.return_pct),
    }))
    .sort((a, b) => b.value - a.value);

  const pensionByYear = new Map<number, number>();
  for (const row of input.pensionRows) {
    const year = toNumber(row.year);
    pensionByYear.set(year, (pensionByYear.get(year) ?? 0) + toNumber(row.annual_amount_thousand_krw));
  }

  const taxByYear = new Map<number, number>();
  for (const row of input.taxRows) {
    const year = toNumber(row.tax_year);
    taxByYear.set(year, (taxByYear.get(year) ?? 0) + toNumber(row.amount_krw));
  }

  const netWorth = toNumber(currentNetWorth?.value_krw);
  const projected = toNumber(projectedNetWorth?.value_krw);
  const debt = toNumber(currentDebt?.value_krw);
  const assets = toNumber(currentAssets?.value_krw);
  const debtRatio = assets > 0 ? debt / assets : 0;
  const netWorthGrowth = netWorth > 0 ? (projected - netWorth) / netWorth : 0;
  const assetComposition = input.netWorthRows
    .filter(
      (row) =>
        row.date_or_scenario.includes("current") &&
        !row.metric.includes("순자산") &&
        !row.metric.includes("총계") &&
        !row.metric.includes("부채"),
    )
    .map((row) => ({
      label: row.metric,
      value: toNumber(row.value_krw),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
  const targetMonthlyIncome = 10000000;
  const projectedMonthlyPension = Math.max(...Array.from(pensionByYear.values()), 0) * 1000 / 12;
  const monthlyIncomeGap = Math.max(targetMonthlyIncome - projectedMonthlyPension, 0);

  const finance = {
    netWorth,
    projected,
    assets,
    debt,
    debtRatio,
    netWorthGrowth,
    assetComposition,
    targetMonthlyIncome,
    projectedMonthlyPension,
    monthlyIncomeGap,
    taxSuggestions: [
      "연금저축/IRP 납입 한도와 세액공제 여력을 분기별로 점검",
      "금융소득과 양도/배당 이벤트가 큰 해는 세금 납부 현금흐름을 선반영",
      "월 1천만원 목표는 연금 확정 현금흐름과 투자 인출률을 분리해 관리",
    ],
  };
  const priorities = input.actions.filter((item) => item.dashboard_note || item.status_or_value).slice(0, 4);
  const anomalies = [
    latestHealth.bmi >= 25 ? `BMI ${latestHealth.bmi}: 체중/대사 리스크 관리 필요` : "",
    latestHealth.fasting_glucose >= 100 ? `공복혈당 ${latestHealth.fasting_glucose}: 혈당 추세 관찰 필요` : "",
    latestHealth.systolic_bp >= 120 ? `수축기혈압 ${latestHealth.systolic_bp}: 혈압 모니터링 유지` : "",
  ].filter(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    source: input.source,
    warnings: input.warnings,
    scores: calculateDashboardScores({ latestHealth, finance }),
    health: {
      latest: latestHealth,
      series: healthSeries,
      actions: input.actions.slice(0, 5),
      priorities,
      monitoring: [
        "체중, 허리둘레, 혈압은 주간 추세로 확인",
        "공복혈당은 식사/수면/운동 기록과 함께 월간 비교",
        "건강검진 지적사항은 완료/관찰/예약 상태로 관리",
      ],
      anomalies,
    },
    finance,
    investment,
    pension: Array.from(pensionByYear.entries())
      .sort(([a], [b]) => a - b)
      .slice(0, 18)
      .map(([year, amount]) => ({ year, amount })),
    tax: Array.from(taxByYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, amount]) => ({ year, amount })),
  };
}
