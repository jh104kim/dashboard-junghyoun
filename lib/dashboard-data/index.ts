import { getCsvDashboardData, getCsvSupplementalData } from "@/lib/dashboard-data/csv-source";
import { createEmptyDashboardData } from "@/lib/dashboard-data/empty";
import { getSupabaseDashboardData } from "@/lib/dashboard-data/supabase-source";
import type { DashboardData } from "@/lib/dashboard-data/types";

export type { DashboardData } from "@/lib/dashboard-data/types";

export async function getDashboardData(): Promise<DashboardData> {
  const supabaseResult = await getSupabaseDashboardData();
  if (supabaseResult.ok && supabaseResult.data) {
    const supplemental = await getCsvSupplementalData();
    return {
      ...supabaseResult.data,
      finance: {
        ...supabaseResult.data.finance,
        pensionProducts: supplemental.pensionProducts.map((row) => ({
          category: row.category,
          institution: row.institution,
          product: row.product,
          startAge: Number(row.start_age) || 0,
          valuation: (Number(row.valuation_thousand_krw) || 0) * 1000,
          taxRate: Number(row.tax_rate) || 0,
        })),
        salaryTax: supplemental.salaryTaxRows.map((row) => ({
          year: Number(row.year) || 0,
          grossPay: Number(row.gross_pay_krw) || 0,
          incomeTax: Number(row.determined_income_tax_krw) || 0,
          localIncomeTax: Number(row.determined_local_income_tax_krw) || 0,
          effectiveTaxRate: Number(row.effective_tax_rate_pct) || 0,
        })),
        takehomeScenarios: supplemental.takehomeScenarios.map((row) => ({
          annualSalary: Number(row.annual_salary_krw) || 0,
          monthlyTakehome: Number(row.monthly_takehome_krw) || 0,
          monthlyDeductions: Number(row.monthly_deductions_krw) || 0,
        })),
        taxPayments: supplemental.taxPayments.map((row) => ({
          taxYear: Number(row.tax_year) || 0,
          paymentDate: row.payment_date,
          taxType: row.tax_type,
          amount: Number(row.amount_krw) || 0,
          jurisdiction: row.jurisdiction,
        })),
        debtLoan: supplemental.debtLoanRows.map((row) => ({
          label: row.label,
          amount: Number(row.amount_krw) || 0,
          rate: Number(row.rate) || 0,
          monthlyInterest: Number(row.monthly_interest_krw) || 0,
          note: row.note,
        })),
      },
      health: {
        ...supabaseResult.data.health,
        detailSummary: summarizeHealthDetails(supplemental.healthDetailRows),
      },
    };
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

function summarizeHealthDetails(rows: Array<{ category: string; value_numeric: string }>) {
  const categories = new Map<string, number>();
  let numericRows = 0;
  for (const row of rows) {
    const category = row.category || "미분류";
    categories.set(category, (categories.get(category) ?? 0) + 1);
    if (row.value_numeric && Number.isFinite(Number(row.value_numeric))) numericRows += 1;
  }
  return {
    totalRows: rows.length,
    categories: Array.from(categories.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    numericRows,
    textRows: Math.max(rows.length - numericRows, 0),
  };
}
