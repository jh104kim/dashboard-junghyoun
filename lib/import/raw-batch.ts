import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImportFileDefinition, ImportValidationIssue } from "@/lib/import/types";

export function stableHash(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export async function upsertRawBatch(input: {
  supabase: SupabaseClient;
  definition: ImportFileDefinition;
  sourceHash: string;
  rowCount: number;
  errorCount: number;
}) {
  const { data, error } = await input.supabase
    .from("raw_import_batches")
    .upsert(
      {
        source_name: input.definition.sourceName,
        source_kind: "local_csv",
        source_file_name: input.definition.fileName,
        source_hash: input.sourceHash,
        status: input.errorCount > 0 ? "validated" : "imported",
        row_count: input.rowCount,
        error_count: input.errorCount,
        metadata: {
          import_kind: input.definition.kind,
        },
      },
      { onConflict: "source_name,source_hash" },
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(`raw_import_batches upsert failed for ${input.definition.fileName}: ${error.message}`);
  }

  return data.id as string;
}

export async function upsertRawRows(input: {
  supabase: SupabaseClient;
  batchId: string;
  rows: Array<Record<string, string>>;
  issues: ImportValidationIssue[];
}) {
  if (input.rows.length === 0) return 0;

  const issuesByRow = new Map<number, string[]>();
  for (const issue of input.issues) {
    const current = issuesByRow.get(issue.rowNumber) ?? [];
    current.push(issue.message);
    issuesByRow.set(issue.rowNumber, current);
  }

  const records = input.rows.map((row, index) => ({
    batch_id: input.batchId,
    row_number: index + 1,
    row_data: row,
    row_hash: stableHash(row),
    validation_errors: issuesByRow.get(index + 1) ?? [],
  }));

  const { data, error } = await input.supabase
    .from("raw_import_rows")
    .upsert(records, { onConflict: "batch_id,row_hash", ignoreDuplicates: true })
    .select("id");

  if (error) {
    throw new Error(`raw_import_rows upsert failed: ${error.message}`);
  }

  return data?.length ?? 0;
}
