import type { ImportFileDefinition } from "@/lib/import/types";

export const IMPORT_FILES: ImportFileDefinition[] = [
  {
    kind: "health_key_metrics",
    fileName: "health_key_yearly_metrics.csv",
    sourceName: "local_csv_health_key_yearly_metrics",
    ownerScope: "USER_JH",
    requiredColumns: ["year", "metric_id", "metric_label", "value_numeric"],
  },
  {
    kind: "health_checkup_metrics",
    fileName: "health_detailed_2024_2026_metrics.csv",
    sourceName: "local_csv_health_detailed_2024_2026_metrics",
    ownerScope: "USER_JH",
    requiredColumns: ["year", "metric_id", "metric_label"],
  },
  {
    kind: "health_findings_actions",
    fileName: "health_findings_actions.csv",
    sourceName: "local_csv_health_findings_actions",
    ownerScope: "USER_JH",
    requiredColumns: ["year", "category", "item", "dashboard_note"],
  },
  {
    kind: "networth_snapshot",
    fileName: "finance_net_worth_snapshot.csv",
    sourceName: "local_csv_finance_net_worth_snapshot",
    ownerScope: "FAMILY_COMBINED",
    requiredColumns: ["metric", "date_or_scenario", "value_krw"],
  },
  {
    kind: "investment_holdings",
    fileName: "finance_investment_holdings.csv",
    sourceName: "local_csv_finance_investment_holdings",
    ownerScope: "FAMILY_COMBINED",
    requiredColumns: ["account", "instrument", "market_value_krw"],
  },
  {
    kind: "pension_cashflow",
    fileName: "finance_pension_cashflow_by_year.csv",
    sourceName: "local_csv_finance_pension_cashflow_by_year",
    ownerScope: "FAMILY_COMBINED",
    requiredColumns: ["year", "product", "annual_amount_thousand_krw"],
  },
  {
    kind: "tax_history",
    fileName: "finance_tax_by_year_type.csv",
    sourceName: "local_csv_finance_tax_by_year_type",
    ownerScope: "FAMILY_COMBINED",
    requiredColumns: ["tax_year", "tax_type", "amount_krw"],
  },
];
