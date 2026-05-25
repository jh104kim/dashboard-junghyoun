import { DomainShell } from "@/components/DomainShell";

export default function ActivityPage() {
  return (
    <DomainShell
      title="Activity Dashboard"
      subtitle="등산, 운동, 골프, 산행 일정과 방문/미방문 장소를 분석하는 영역"
      kpis={[
        { label: "Visited Mountains", value: "99", tone: "text-[var(--green)]" },
        { label: "Wishlist", value: "184", tone: "text-[var(--amber)]" },
        { label: "Total Places", value: "283", tone: "text-[var(--cyan)]" },
        { label: "2026 Schedule", value: "120+", tone: "text-white" },
      ]}
      sections={[
        {
          title: "Dashboard Candidates",
          items: ["도넛: 다녀온 산 vs 안 다녀온 산", "히스토그램: 고도 분포", "산점도: 고도 vs 방문 여부", "지역 heatmap: 산/장소 지역 분포"],
        },
        {
          title: "Sources",
          items: [
            "wiki/life/hiking/sources/등산 방문 목록 정리.md",
            "wiki/life/hiking/sources/등산 일정/2026년 산악 동호회 산행 일정 요약.md",
            "raw/processed/life/등산_List.json",
            "raw/processed/life/26년 일정.xlsx",
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
