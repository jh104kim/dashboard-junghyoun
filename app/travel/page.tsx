import { DomainShell } from "@/components/DomainShell";
import { getLifeSourceSummary } from "@/lib/life-source";

export const dynamic = "force-dynamic";

export default async function TravelPage() {
  const summary = await getLifeSourceSummary();
  const transport = summary.travel.transportModes.map((item) => `${item.mode}: ${item.count}회`);

  return (
    <DomainShell
      title="Travel Dashboard"
      subtitle="가족여행, 트레킹, 일정, 비용, 준비물 상태를 관리하는 영역"
      kpis={[
        { label: "Itinerary Rows", value: summary.travel.itineraryRows.toLocaleString(), tone: "text-[var(--green)]" },
        { label: "Trip Days", value: summary.travel.tripDays.toLocaleString(), tone: "text-[var(--cyan)]" },
        { label: "Confirm Needed", value: summary.travel.confirmNeeded.toLocaleString(), tone: "text-[var(--amber)]" },
        { label: "Packing Items", value: summary.travel.packingItems.toLocaleString() },
      ]}
      sections={[
        {
          title: "Live Source Summary",
          items: [
            `오제 트레킹 일정 ${summary.travel.itineraryRows.toLocaleString()}개 row, ${summary.travel.tripDays.toLocaleString()}일차 구성`,
            `확인 필요 일정 ${summary.travel.confirmNeeded.toLocaleString()}개, 필수 준비물 ${summary.travel.requiredItems.toLocaleString()}개`,
            `체크 완료 준비물 ${summary.travel.checkedItems.toLocaleString()}개`,
            transport.length > 0 ? `교통 수단: ${transport.join(", ")}` : "교통 수단 데이터는 로컬 CSV 연결 시 표시",
          ],
        },
        {
          title: "Dashboard Candidates",
          items: ["타임라인: 여행 일정 day-by-day", "100% 누적 막대: 준비물 상태", "도넛: 비용 구성", "지도/지역 카드: 여행지와 이동 구간"],
        },
        {
          title: "Loaded Sources",
          items: [
            ...summary.sourceStatus.loadedFiles.filter((item) => item.includes("travel")),
            summary.sourceStatus.obsidianAvailable ? "Obsidian local bridge active" : "Obsidian local bridge unavailable in this runtime",
          ],
        },
        {
          title: "Next Build",
          items: ["travel import schema", "준비물 status parser", "비용 항목 정규화", "일정 route table"],
        },
      ]}
    />
  );
}
