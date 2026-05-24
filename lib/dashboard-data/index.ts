import { getCsvDashboardData } from "@/lib/dashboard-data/csv-source";
import { createEmptyDashboardData } from "@/lib/dashboard-data/empty";
import { getSupabaseDashboardData } from "@/lib/dashboard-data/supabase-source";
import type { DashboardData } from "@/lib/dashboard-data/types";

export type { DashboardData } from "@/lib/dashboard-data/types";

export async function getDashboardData(): Promise<DashboardData> {
  const supabaseResult = await getSupabaseDashboardData();
  if (supabaseResult.ok && supabaseResult.data) {
    return supabaseResult.data;
  }

  const csvResult = await getCsvDashboardData();
  if (csvResult.data) {
    return {
      ...csvResult.data,
      warnings: [...(supabaseResult.warnings ?? []), ...(csvResult.data.warnings ?? [])],
    };
  }

  return createEmptyDashboardData("empty", [
    ...(supabaseResult.warnings ?? []),
    ...(csvResult.warnings ?? []),
    "No dashboard data source is currently available.",
  ]);
}
