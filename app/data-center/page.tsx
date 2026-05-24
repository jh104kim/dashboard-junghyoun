import { DomainShell } from "@/components/DomainShell";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getCounts() {
  const tables = ["raw_import_batches", "raw_import_rows", "health_key_metrics", "health_checkup_metrics"] as const;
  try {
    const supabase = createAdminClient();
    const results = await Promise.all(
      tables.map(async (table) => {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
        return { table, count: count ?? 0 };
      }),
    );
    return results;
  } catch {
    return tables.map((table) => ({ table, count: 0 }));
  }
}

export default async function DataCenterPage() {
  const counts = await getCounts();

  return (
    <DomainShell
      title="Data Center"
      subtitle="데이터 소스, import batch, validation, freshness를 관리하는 영역"
      kpis={counts.map((item) => ({
        label: item.table.replace(/_/g, " "),
        value: item.count.toLocaleString(),
        tone: item.count > 0 ? "text-[var(--green)]" : "text-[var(--amber)]",
      }))}
      sections={[
        { title: "Current Pipeline", items: ["local CSV import", "raw batch preservation", "domain table upsert", "Supabase-first dashboard read"] },
        { title: "Validation", items: ["required column checks", "duplicate-safe raw rows", "safe aggregate console summary"] },
        { title: "Next Build", items: ["upload UI", "persistent validation reports", "Data Trust Score", "source freshness badges"] },
      ]}
    />
  );
}
