import { DomainShell } from "@/components/DomainShell";

export default function AnalyticsPage() {
  return (
    <DomainShell
      title="Analytics"
      subtitle="건강, 자산, 세금, 은퇴 이벤트를 하나의 Life Risk Timeline으로 연결하는 영역"
      kpis={[
        { label: "Mode", value: "Timeline", tone: "text-[var(--cyan)]" },
        { label: "Scenario", value: "Planned" },
        { label: "Trust", value: "Building", tone: "text-[var(--amber)]" },
        { label: "Cadence", value: "Monthly" },
      ]}
      sections={[
        { title: "Timeline Signals", items: ["health anomalies", "net worth milestones", "tax spikes", "retirement cashflow shifts"] },
        { title: "Scenario Ideas", items: ["health improvement", "conservative retirement", "aggressive investment", "reduced spending"] },
        { title: "Next Build", items: ["cross-domain event model", "scenario assumptions", "Data Trust Score"] },
      ]}
    />
  );
}
