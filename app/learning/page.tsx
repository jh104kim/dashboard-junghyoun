import { DomainShell } from "@/components/DomainShell";

export default function LearningPage() {
  return (
    <DomainShell
      title="Learning And Signal Dashboard"
      subtitle="AI 학습, 소셜 피드, 자동화 아이디어, 실행 backlog를 운영하는 영역"
      kpis={[
        { label: "Daily Picks", value: "10", tone: "text-[var(--green)]" },
        { label: "Matched", value: "96", tone: "text-[var(--cyan)]" },
        { label: "Messages", value: "176", tone: "text-white" },
        { label: "Backlog", value: "Planned", tone: "text-[var(--amber)]" },
      ]}
      sections={[
        {
          title: "Dashboard Candidates",
          items: ["막대: 관심 카테고리별 피드 수", "산점도: 실행 영향도 vs 난이도", "도넛: 아이디어 상태", "스파크라인: 주간 실행 cadence"],
        },
        {
          title: "Sources",
          items: ["raw/inbox/20260525-social-feed-digest.md", "raw/inbox/20260525-weekly-review.md", "wiki/ai-ax sources and stacks"],
        },
        {
          title: "Next Build",
          items: ["social digest parser", "idea scoring model", "weekly review import", "AI Insight 연결"],
        },
      ]}
    />
  );
}
