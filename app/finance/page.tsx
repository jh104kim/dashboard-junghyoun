import { DomainShell } from "@/components/DomainShell";
import { getDashboardData } from "@/lib/dashboard-data";

function krw(value: number) {
  return `${(value / 100000000).toFixed(1)}억`;
}

export default async function FinancePage() {
  const data = await getDashboardData();

  return (
    <DomainShell
      title="Finance Drilldown"
      subtitle="순자산, 자산 총계, 부채, 월 현금흐름 목표를 확장하는 영역"
      kpis={[
        { label: "Net Worth", value: krw(data.finance.netWorth), tone: "text-[var(--green)]" },
        { label: "Assets", value: krw(data.finance.assets), tone: "text-[var(--cyan)]" },
        { label: "Debt", value: krw(data.finance.debt) },
        { label: "10M Gap", value: `${Math.round(data.finance.monthlyIncomeGap / 10000).toLocaleString()}만`, tone: "text-[var(--amber)]" },
      ]}
      sections={[
        { title: "Asset Composition", items: data.finance.assetComposition.map((item) => `${item.label}: ${krw(item.value)}`) },
        { title: "Tax & Income Actions", items: data.finance.taxSuggestions },
        { title: "Next Data Needs", items: ["debt/loan snapshot transform", "salary and take-home scenario transform", "manual spending ledger import"] },
      ]}
    />
  );
}
