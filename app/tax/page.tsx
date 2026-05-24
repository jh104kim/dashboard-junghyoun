import { DomainShell } from "@/components/DomainShell";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function TaxPage() {
  const data = await getDashboardData();
  const maxTax = Math.max(...data.tax.map((item) => item.amount), 0);

  return (
    <DomainShell
      title="Tax Drilldown"
      subtitle="연도별 세금 추세, 납부 이벤트, 절세 액션을 확장하는 영역"
      kpis={[
        { label: "Years", value: String(data.tax.length), tone: "text-[var(--cyan)]" },
        { label: "Peak Tax", value: `${Math.round(maxTax / 1000000).toLocaleString()}백만`, tone: "text-[var(--amber)]" },
        { label: "Actions", value: String(data.finance.taxSuggestions.length) },
        { label: "Mode", value: "Planning", tone: "text-[var(--green)]" },
      ]}
      sections={[
        { title: "Recent Tax Timeline", items: data.tax.slice(-8).map((item) => `${item.year}: ${Math.round(item.amount / 1000000).toLocaleString()}백만`) },
        { title: "Tax Actions", items: data.finance.taxSuggestions },
        { title: "Next Build", items: ["tax payment import", "salary/tax yearly transform", "deduction calendar"] },
      ]}
    />
  );
}
