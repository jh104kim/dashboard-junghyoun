import { DomainShell } from "@/components/DomainShell";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function HealthPage() {
  const data = await getDashboardData();

  return (
    <DomainShell
      title="Health Drilldown"
      subtitle="건강검진, 장기 추세, 관리 우선순위, 모니터링 액션을 확장하는 영역"
      kpis={[
        { label: "BMI", value: String(data.health.latest.bmi), tone: "text-[var(--amber)]" },
        { label: "Glucose", value: String(data.health.latest.fasting_glucose) },
        { label: "Blood Pressure", value: `${data.health.latest.systolic_bp}/${data.health.latest.diastolic_bp}` },
        { label: "Actions", value: String(data.health.actions.length), tone: "text-[var(--red)]" },
      ]}
      sections={[
        { title: "Priority Tracking", items: data.health.priorities.map((item) => `${item.item}: ${item.dashboard_note}`) },
        { title: "Anomaly Markers", items: data.health.anomalies },
        { title: "Monitoring Cadence", items: data.health.monitoring },
      ]}
    />
  );
}
