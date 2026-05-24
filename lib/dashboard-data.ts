import { readCsv, toNumber } from "@/lib/csv";

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

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export async function getDashboardData() {
  const [healthRows, actions, netWorthRows, holdings, pensionRows, taxRows] = await Promise.all([
    readCsv<HealthMetricRow>("health_key_yearly_metrics.csv"),
    readCsv<HealthActionRow>("health_findings_actions.csv"),
    readCsv<NetWorthRow>("finance_net_worth_snapshot.csv"),
    readCsv<HoldingRow>("finance_investment_holdings.csv"),
    readCsv<PensionRow>("finance_pension_cashflow_by_year.csv"),
    readCsv<TaxRow>("finance_tax_by_year_type.csv"),
  ]);

  const healthSeries = ["bmi", "fasting_glucose", "systolic_bp", "diastolic_bp"].map((metricId) => {
    const metricRows = healthRows
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

  const currentNetWorth = netWorthRows.find(
    (row) => row.metric === "순자산 (Net Worth)" && row.date_or_scenario.includes("current"),
  );
  const projectedNetWorth = netWorthRows.find(
    (row) => row.metric === "순자산 (Net Worth)" && row.date_or_scenario.includes("projected"),
  );
  const currentAssets = netWorthRows.find(
    (row) => row.metric === "자산 총계" && row.date_or_scenario.includes("current"),
  );
  const currentDebt = netWorthRows.find(
    (row) => row.metric.includes("부채") && row.date_or_scenario.includes("current"),
  );

  const investment = holdings
    .map((row) => ({
      name: row.instrument,
      value: toNumber(row.market_value_krw),
      gain: toNumber(row.gain_loss_krw),
      returnPct: toNumber(row.return_pct),
    }))
    .sort((a, b) => b.value - a.value);

  const pensionByYear = new Map<number, number>();
  for (const row of pensionRows) {
    const year = toNumber(row.year);
    pensionByYear.set(year, (pensionByYear.get(year) ?? 0) + toNumber(row.annual_amount_thousand_krw));
  }

  const taxByYear = new Map<number, number>();
  for (const row of taxRows) {
    const year = toNumber(row.tax_year);
    taxByYear.set(year, (taxByYear.get(year) ?? 0) + toNumber(row.amount_krw));
  }

  const netWorth = toNumber(currentNetWorth?.value_krw);
  const projected = toNumber(projectedNetWorth?.value_krw);
  const debt = toNumber(currentDebt?.value_krw);
  const assets = toNumber(currentAssets?.value_krw);
  const debtRatio = assets > 0 ? debt / assets : 0;
  const netWorthGrowth = projected > 0 ? (projected - netWorth) / netWorth : 0;

  const healthScore = Math.max(
    0,
    Math.round(100 - (latestHealth.bmi - 23) * 4 - Math.max(0, latestHealth.fasting_glucose - 95) * 0.9),
  );
  const financeScore = Math.min(99, Math.round(88 + netWorthGrowth * 80 - debtRatio * 120));
  const lifeScore = Math.round(healthScore * 0.45 + financeScore * 0.55);

  return {
    generatedAt: new Date().toISOString(),
    scores: {
      life: lifeScore,
      health: healthScore,
      finance: financeScore,
      risk: healthScore < 75 ? "Watch" : "Low",
    },
    health: {
      latest: latestHealth,
      series: healthSeries,
      actions: actions.slice(0, 5),
    },
    finance: {
      netWorth,
      projected,
      assets,
      debt,
      debtRatio,
      netWorthGrowth,
    },
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
