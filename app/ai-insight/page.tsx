import { DomainShell } from "@/components/DomainShell";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function AiInsightPage() {
  const data = await getDashboardData();

  return (
    <DomainShell
      title="AI Insight"
      subtitle="민감 원본 대신 파생 지표만 사용해 요약과 이상 신호 설명을 만드는 영역"
      kpis={[
        { label: "Life Score", value: String(data.scores.life), tone: "text-[var(--green)]" },
        { label: "Health Score", value: String(data.scores.health), tone: "text-[var(--amber)]" },
        { label: "Asset Score", value: String(data.scores.finance), tone: "text-[var(--cyan)]" },
        { label: "Privacy", value: "Derived", tone: "text-[var(--green)]" },
      ]}
      sections={[
        { title: "Deterministic Insight", items: [`순자산과 연금 흐름은 안정적이나 건강 리스크가 Life Score의 우선 관리 항목입니다.`] },
        { title: "Prompt Boundary", items: ["send derived metrics only", "require approval for sensitive raw data", "persist generated insight history"] },
        { title: "Next Build", items: ["server-only OpenAI client", "weekly/monthly insight generator", "anomaly explanation route"] },
      ]}
    />
  );
}
