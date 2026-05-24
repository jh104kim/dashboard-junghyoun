import type { SupabaseClient } from "@supabase/supabase-js";
import { toNumber } from "@/lib/csv";
import type { ImportFileDefinition, ImportValidationIssue } from "@/lib/import/types";

type CsvRow = Record<string, string>;

function text(value: string | undefined) {
  return value?.trim() ?? "";
}

function issue(fileName: string, rowNumber: number, message: string): ImportValidationIssue {
  return { fileName, rowNumber, message };
}

export function validateRows(definition: ImportFileDefinition, rows: CsvRow[]) {
  const issues: ImportValidationIssue[] = [];
  rows.forEach((row, index) => {
    for (const column of definition.requiredColumns) {
      if (!text(row[column])) {
        issues.push(issue(definition.fileName, index + 1, `Missing required column value: ${column}`));
      }
    }
  });
  return issues;
}

export async function upsertDomainRows(input: {
  supabase: SupabaseClient;
  definition: ImportFileDefinition;
  batchId: string;
  rows: CsvRow[];
}) {
  const { supabase, definition, batchId, rows } = input;

  if (rows.length === 0) return 0;

  if (definition.kind === "health_key_metrics") {
    const records = rows.map((row) => ({
      owner_scope: definition.ownerScope,
      year: toNumber(row.year),
      metric_id: text(row.metric_id),
      metric_label: text(row.metric_label),
      value_text: text(row.value_text),
      value_numeric: toNumber(row.value_numeric),
      unit: text(row.unit),
      source: text(row.source),
      note: text(row.note),
      batch_id: batchId,
    }));
    return upsert(supabase, "health_key_metrics", records, "owner_scope,year,metric_id");
  }

  if (definition.kind === "health_checkup_metrics") {
    const records = rows.map((row) => ({
      owner_scope: definition.ownerScope,
      category: text(row.category),
      metric_id: text(row.metric_id),
      metric_label: text(row.metric_label),
      measured_date: text(row.date) || null,
      year: toNumber(row.year),
      value_text: text(row.value_text),
      value_numeric: text(row.value_numeric) ? toNumber(row.value_numeric) : null,
      reference_range: text(row.reference_range),
      source: text(row.source),
      batch_id: batchId,
    }));
    return upsert(supabase, "health_checkup_metrics", records, "owner_scope,year,metric_id,measured_date");
  }

  if (definition.kind === "health_findings_actions") {
    const records = rows.map((row) => ({
      owner_scope: definition.ownerScope,
      year: toNumber(row.year),
      category: text(row.category),
      item: text(row.item),
      status_or_value: text(row.status_or_value),
      dashboard_note: text(row.dashboard_note),
      source: text(row.source),
      batch_id: batchId,
    }));
    return upsert(supabase, "health_findings_actions", records, "owner_scope,year,category,item");
  }

  if (definition.kind === "networth_snapshot") {
    const records = rows.map((row) => ({
      owner_scope: definition.ownerScope,
      metric: text(row.metric),
      date_or_scenario: text(row.date_or_scenario),
      value_krw: toNumber(row.value_krw),
      value_text: text(row.value_text),
      source: text(row.source),
      batch_id: batchId,
    }));
    return upsert(supabase, "networth_snapshot", records, "owner_scope,metric,date_or_scenario");
  }

  if (definition.kind === "investment_holdings") {
    const records = rows.map((row) => ({
      owner_scope: definition.ownerScope,
      account: text(row.account),
      instrument: text(row.instrument),
      cost_krw: toNumber(row.cost_krw),
      market_value_krw: toNumber(row.market_value_krw),
      gain_loss_krw: toNumber(row.gain_loss_krw),
      return_pct: toNumber(row.return_pct),
      source: text(row.source),
      batch_id: batchId,
    }));
    return upsert(supabase, "investment_holdings", records, "owner_scope,account,instrument,batch_id");
  }

  if (definition.kind === "pension_cashflow") {
    const records = rows.map((row) => ({
      owner_scope: definition.ownerScope,
      year: toNumber(row.year),
      age: toNumber(row.age),
      category: text(row.category),
      institution: text(row.institution),
      product: text(row.product),
      annual_amount_thousand_krw: toNumber(row.annual_amount_thousand_krw),
      source: text(row.source),
      batch_id: batchId,
    }));
    return upsert(supabase, "pension_cashflow", records, "owner_scope,year,category,institution,product");
  }

  const records = rows.map((row) => ({
    owner_scope: definition.ownerScope,
    tax_year: toNumber(row.tax_year),
    tax_type: text(row.tax_type),
    amount_krw: toNumber(row.amount_krw),
    source: text(row.source),
    batch_id: batchId,
  }));
  return upsert(supabase, "tax_history", records, "owner_scope,tax_year,tax_type");
}

async function upsert(supabase: SupabaseClient, table: string, records: Record<string, unknown>[], onConflict: string) {
  const { data, error } = await supabase.from(table).upsert(records, { onConflict }).select("id");

  if (error) {
    throw new Error(`${table} upsert failed: ${error.message}`);
  }

  return data?.length ?? 0;
}
