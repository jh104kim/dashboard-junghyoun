import { DomainShell } from "@/components/DomainShell";

export default function TravelPage() {
  return (
    <DomainShell
      title="Travel Dashboard"
      subtitle="가족여행, 트레킹, 일정, 비용, 준비물 상태를 관리하는 영역"
      kpis={[
        { label: "Oze Trekking", value: "Ready", tone: "text-[var(--green)]" },
        { label: "Packing Data", value: "CSV", tone: "text-[var(--cyan)]" },
        { label: "Family Trip", value: "XLSX", tone: "text-[var(--amber)]" },
        { label: "Cost Plan", value: "Pending" },
      ]}
      sections={[
        {
          title: "Dashboard Candidates",
          items: ["타임라인: 여행 일정 day-by-day", "100% 누적 막대: 준비물 상태", "도넛: 비용 구성", "지도/지역 카드: 여행지와 이동 구간"],
        },
        {
          title: "Sources",
          items: [
            "wiki/life/travel/sources/2026_Oze_Trekking/02_itinerary-db.csv",
            "wiki/life/travel/sources/2026_Oze_Trekking/03_packing-list.csv",
            "wiki/life/travel/sources/가족여행 일정·비용 정리.md",
            "raw/processed/life/travel/가족여행.xlsx",
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
