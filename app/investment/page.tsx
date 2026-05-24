import { DomainShell } from "@/components/DomainShell";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function InvestmentPage() {
  const data = await getDashboardData();

  return (
    <DomainShell
      title="Investment Drilldown"
      subtitle="보유종목, 수익률, 집중도, 리밸런싱 후보를 확장하는 영역"
      kpis={[
        { label: "Holdings", value: String(data.investment.length), tone: "text-[var(--cyan)]" },
        { label: "Top Value", value: `${Math.round((data.investment[0]?.value ?? 0) / 10000).toLocaleString()}만` },
        { label: "Best Return", value: `${Math.max(...data.investment.map((item) => item.returnPct), 0)}%`, tone: "text-[var(--green)]" },
        { label: "Watch", value: "Concentration", tone: "text-[var(--amber)]" },
      ]}
      sections={[
        {
          title: "Top Holdings",
          items: data.investment.slice(0, 8).map((item) => `${item.name}: ${Math.round(item.value / 10000).toLocaleString()}만 / ${item.returnPct}%`),
        },
        { title: "Risk Checks", items: ["single ETF concentration", "currency exposure", "taxable event timing"] },
        { title: "Next Build", items: ["allocation by account", "target allocation", "rebalance simulator"] },
      ]}
    />
  );
}
