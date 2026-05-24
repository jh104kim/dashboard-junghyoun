import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TABLES = ["health_key_metrics", "networth_snapshot", "investment_holdings", "ai_insights"] as const;

export async function GET() {
  const projectConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  if (!projectConfigured) {
    return NextResponse.json({
      ok: false,
      projectConfigured,
      tables: Object.fromEntries(TABLES.map((table) => [table, false])),
    });
  }

  try {
    const supabase = createAdminClient();
    const checks = await Promise.all(
      TABLES.map(async (table) => {
        const { error } = await supabase.from(table).select("id").limit(1);
        return [table, !error] as const;
      }),
    );

    const tables = Object.fromEntries(checks);
    const ok = Object.values(tables).every(Boolean);

    return NextResponse.json({
      ok,
      projectConfigured,
      tables,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        projectConfigured,
        tables: Object.fromEntries(TABLES.map((table) => [table, false])),
      },
      { status: 500 },
    );
  }
}
