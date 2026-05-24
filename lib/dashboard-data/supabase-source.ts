import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { buildDashboardData } from "@/lib/dashboard-data/csv-source";
import type { DashboardSourceResult } from "@/lib/dashboard-data/types";

function toText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export async function getSupabaseDashboardData(): Promise<DashboardSourceResult> {
  try {
    const supabase = createAdminClient();

    const [health, actions, netWorth, holdings, pension, tax] = await Promise.all([
      supabase.from("health_key_metrics").select("year, metric_id, metric_label, value_text, value_numeric, unit"),
      supabase.from("health_findings_actions").select("item, status_or_value, dashboard_note"),
      supabase.from("networth_snapshot").select("metric, date_or_scenario, value_krw, value_text"),
      supabase.from("investment_holdings").select("instrument, market_value_krw, gain_loss_krw, return_pct"),
      supabase.from("pension_cashflow").select("year, age, category, annual_amount_thousand_krw"),
      supabase.from("tax_history").select("tax_year, tax_type, amount_krw"),
    ]);

    const errors = [health.error, actions.error, netWorth.error, holdings.error, pension.error, tax.error].filter(Boolean);
    if (errors.length > 0) {
      return {
        ok: false,
        source: "supabase",
        reason: "Supabase dashboard query failed.",
        warnings: errors.map((error) => error?.message ?? "Unknown Supabase error"),
      };
    }

    const rowCount =
      (health.data?.length ?? 0) +
      (actions.data?.length ?? 0) +
      (netWorth.data?.length ?? 0) +
      (holdings.data?.length ?? 0) +
      (pension.data?.length ?? 0) +
      (tax.data?.length ?? 0);

    if (rowCount === 0) {
      return {
        ok: false,
        source: "supabase",
        reason: "Supabase dashboard tables are empty.",
        warnings: ["Supabase dashboard tables are empty; falling back to CSV source."],
      };
    }

    return {
      ok: true,
      source: "supabase",
      data: buildDashboardData({
        healthRows: (health.data ?? []).map((row) => ({
          year: toText(row.year),
          metric_id: toText(row.metric_id),
          metric_label: toText(row.metric_label),
          value_text: toText(row.value_text),
          value_numeric: toText(row.value_numeric),
          unit: toText(row.unit),
        })),
        actions: (actions.data ?? []).map((row) => ({
          item: toText(row.item),
          status_or_value: toText(row.status_or_value),
          dashboard_note: toText(row.dashboard_note),
        })),
        netWorthRows: (netWorth.data ?? []).map((row) => ({
          metric: toText(row.metric),
          date_or_scenario: toText(row.date_or_scenario),
          value_krw: toText(row.value_krw),
          value_text: toText(row.value_text),
        })),
        holdings: (holdings.data ?? []).map((row) => ({
          instrument: toText(row.instrument),
          market_value_krw: toText(row.market_value_krw),
          gain_loss_krw: toText(row.gain_loss_krw),
          return_pct: toText(row.return_pct),
        })),
        pensionRows: (pension.data ?? []).map((row) => ({
          year: toText(row.year),
          age: toText(row.age),
          category: toText(row.category),
          annual_amount_thousand_krw: toText(row.annual_amount_thousand_krw),
        })),
        taxRows: (tax.data ?? []).map((row) => ({
          tax_year: toText(row.tax_year),
          tax_type: toText(row.tax_type),
          amount_krw: toText(row.amount_krw),
        })),
        source: "supabase",
        warnings: [],
      }),
    };
  } catch (error) {
    return {
      ok: false,
      source: "supabase",
      reason: "Supabase dashboard source is unavailable.",
      warnings: [error instanceof Error ? error.message : "Unknown Supabase source error"],
    };
  }
}
