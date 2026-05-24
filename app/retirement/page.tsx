import { DomainShell } from "@/components/DomainShell";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function RetirementPage() {
  const data = await getDashboardData();
  const peak = Math.max(...data.pension.map((item) => item.amount), 0);

  return (
    <DomainShell
      title="Retirement Drilldown"
      subtitle="나이별 연금 타임라인, 상품별 현금흐름, 월 1천만원 목표 갭을 확장하는 영역"
      kpis={[
        { label: "Timeline Years", value: String(data.pension.length), tone: "text-[var(--cyan)]" },
        { label: "Peak Annual", value: `${Math.round(peak / 1000).toLocaleString()}백만` },
        { label: "Monthly Target", value: "1,000만", tone: "text-[var(--green)]" },
        { label: "Gap", value: `${Math.round(data.finance.monthlyIncomeGap / 10000).toLocaleString()}만`, tone: "text-[var(--amber)]" },
      ]}
      sections={[
        { title: "Timeline Sample", items: data.pension.slice(0, 8).map((item) => `${item.year}: ${Math.round(item.amount / 1000).toLocaleString()}백만`) },
        { title: "Planning Checks", items: ["public/private pension separation", "taxable withdrawal timing", "bridge income before age 65"] },
        { title: "Next Build", items: ["product-level pension table", "scenario mode", "after-tax monthly cashflow"] },
      ]}
    />
  );
}
