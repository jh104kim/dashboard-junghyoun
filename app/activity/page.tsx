import { DomainShell } from "@/components/DomainShell";
import { getLifeSourceSummary } from "@/lib/life-source";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const summary = await getLifeSourceSummary();
  const topRegions = summary.activity.topRegions.map((item) => `${item.region}: ${item.count}개`);

  return (
    <DomainShell
      title="Activity Dashboard"
      subtitle="등산, 운동, 골프, 산행 일정과 방문/미방문 장소를 분석하는 영역"
      kpis={[
        { label: "Visited Mountains", value: summary.activity.visitedMountains.toLocaleString(), tone: "text-[var(--green)]" },
        { label: "Wishlist", value: summary.activity.wishlistMountains.toLocaleString(), tone: "text-[var(--amber)]" },
        { label: "Total Places", value: summary.activity.totalMountains.toLocaleString(), tone: "text-[var(--cyan)]" },
        { label: "1,000m+", value: summary.activity.highAltitudeMountains.toLocaleString(), tone: "text-white" },
      ]}
      sections={[
        {
          title: "Live Source Summary",
          items: [
            `방문/미방문 산 ${summary.activity.totalMountains.toLocaleString()}개가 raw JSON에서 집계됨`,
            `고도 1,000m 이상 후보 ${summary.activity.highAltitudeMountains.toLocaleString()}개`,
            topRegions.length > 0 ? `상위 지역: ${topRegions.join(", ")}` : "로컬 Obsidian 자료가 없는 환경에서는 fallback 상태로 표시",
          ],
        },
        {
          title: "Dashboard Candidates",
          items: ["도넛: 다녀온 산 vs 안 다녀온 산", "히스토그램: 고도 분포", "산점도: 고도 vs 방문 여부", "지역 heatmap: 산/장소 지역 분포"],
        },
        {
          title: "Loaded Sources",
          items: [
            ...summary.sourceStatus.loadedFiles.filter((item) => item.includes("등산")),
            summary.sourceStatus.obsidianAvailable ? "Obsidian local bridge active" : "Obsidian local bridge unavailable in this runtime",
          ],
        },
        {
          title: "Next Build",
          items: ["정규화된 activity CSV 생성", "지역/고도 파싱", "일정 캘린더", "Galaxy Health 운동 데이터 연결"],
        },
      ]}
    />
  );
}
