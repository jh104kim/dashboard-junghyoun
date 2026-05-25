import { DomainShell } from "@/components/DomainShell";
import { getLifeSourceSummary } from "@/lib/life-source";

export const dynamic = "force-dynamic";

export default async function LearningPage() {
  const summary = await getLifeSourceSummary();
  const categories = summary.learning.categories.map((item) => `${item.category}: ${item.count}`);

  return (
    <DomainShell
      title="Learning And Signal Dashboard"
      subtitle="AI 학습, 소셜 피드, 자동화 아이디어, 실행 backlog를 운영하는 영역"
      kpis={[
        { label: "Daily Picks", value: summary.learning.finalPicks.toLocaleString(), tone: "text-[var(--green)]" },
        { label: "Matched", value: summary.learning.matchedCandidates.toLocaleString(), tone: "text-[var(--cyan)]" },
        { label: "Messages", value: summary.learning.messagesInWindow.toLocaleString(), tone: "text-white" },
        { label: "Backlog", value: "Planned", tone: "text-[var(--amber)]" },
      ]}
      sections={[
        {
          title: "Live Source Summary",
          items: [
            `직전 24시간 메시지 ${summary.learning.messagesInWindow.toLocaleString()}개 중 관심 후보 ${summary.learning.matchedCandidates.toLocaleString()}개`,
            `최종 Pick ${summary.learning.finalPicks.toLocaleString()}개를 AI Insight backlog 후보로 연결 가능`,
            categories.length > 0 ? `상위 관심 주제: ${categories.join(", ")}` : "소셜 digest가 없는 환경에서는 fallback 상태로 표시",
          ],
        },
        {
          title: "Dashboard Candidates",
          items: ["막대: 관심 카테고리별 피드 수", "산점도: 실행 영향도 vs 난이도", "도넛: 아이디어 상태", "스파크라인: 주간 실행 cadence"],
        },
        {
          title: "Loaded Sources",
          items: [
            ...summary.sourceStatus.loadedFiles.filter((item) => item.includes("social-feed")),
            summary.sourceStatus.obsidianAvailable ? "Obsidian local bridge active" : "Obsidian local bridge unavailable in this runtime",
          ],
        },
        {
          title: "Next Build",
          items: ["social digest parser", "idea scoring model", "weekly review import", "AI Insight 연결"],
        },
      ]}
    />
  );
}
