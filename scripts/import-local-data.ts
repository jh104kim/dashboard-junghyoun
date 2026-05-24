import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import type { WebSocketLikeConstructor } from "@supabase/realtime-js";
import WebSocket from "ws";
import { IMPORT_FILES } from "../lib/import/schemas";
import { addFileReport, createImportReport, toSafeConsoleSummary } from "../lib/import/report";
import { stableHash, upsertRawBatch, upsertRawRows } from "../lib/import/raw-batch";
import { upsertDomainRows, validateRows } from "../lib/import/transformers";

type CsvRow = Record<string, string>;

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function readCsv(fileName: string) {
  const filePath = path.join(process.cwd(), "data", fileName);
  if (!fs.existsSync(filePath)) return { rows: [] as CsvRow[], sourceHash: "missing" };

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse<CsvRow>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parse failed for ${fileName}: ${parsed.errors[0].message}`);
  }

  return {
    rows: parsed.data,
    sourceHash: stableHash(raw),
  };
}

async function main() {
  loadDotEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase URL or service role key is missing.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: WebSocket as unknown as WebSocketLikeConstructor,
    },
  });

  const report = createImportReport();

  for (const definition of IMPORT_FILES) {
    const { rows, sourceHash } = readCsv(definition.fileName);
    const issues = validateRows(definition, rows);
    const batchId = await upsertRawBatch({
      supabase,
      definition,
      sourceHash,
      rowCount: rows.length,
      errorCount: issues.length,
    });
    const rawRowsInserted = await upsertRawRows({ supabase, batchId, rows, issues });
    const validRows = rows.filter((_, index) => !issues.some((item) => item.rowNumber === index + 1));
    const domainRows = await upsertDomainRows({ supabase, definition, batchId, rows: validRows });

    addFileReport(
      report,
      {
        fileName: definition.fileName,
        kind: definition.kind,
        rawRows: rows.length,
        rawRowsInserted,
        domainRows,
        validationErrors: issues.length,
      },
      issues,
    );
  }

  console.log(JSON.stringify(toSafeConsoleSummary(report), null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown import error");
  process.exit(1);
});
