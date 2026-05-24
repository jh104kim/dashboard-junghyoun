import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

export async function readCsv<T extends Record<string, string>>(fileName: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), "data", fileName);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
  const parsed = Papa.parse<T>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parse failed for ${fileName}: ${parsed.errors[0].message}`);
  }

  return parsed.data;
}

export function toNumber(value: string | undefined): number {
  if (!value) return 0;
  const normalized = value.replace(/,/g, "").replace(/'/g, "");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}
