import { DomainShell } from "@/components/DomainShell";

export default function SpendingPage() {
  return (
    <DomainShell
      title="Spending Drilldown"
      subtitle="카드/현금 소비 원장과 위험 소비 패턴을 확장하는 영역"
      kpis={[
        { label: "Ledger", value: "Pending", tone: "text-[var(--amber)]" },
        { label: "Import", value: "Planned" },
        { label: "Risk", value: "Watch", tone: "text-[var(--amber)]" },
        { label: "Scope", value: "Family" },
      ]}
      sections={[
        { title: "Planned Data", items: ["transaction_at", "category", "amount_krw", "approval_no"] },
        { title: "Risk Checks", items: ["fixed cost trend", "medical/health spending", "large recurring payments"] },
        { title: "Next Build", items: ["manual ledger template", "transaction hash idempotency", "monthly close dashboard"] },
      ]}
    />
  );
}
