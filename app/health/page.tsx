import Link from "next/link";
import { HealthTrendChart, ScoreGaugeChart, SparklineChart } from "@/components/DashboardCharts";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="metric-panel min-w-0 p-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function HealthPage() {
  const data = await getDashboardData();
  const bmiSparkline =
    data.health.series.find((series) => series.id === "bmi")?.values.map((item) => ({ x: item.year, y: item.value })) ?? [];
  const glucoseSparkline =
    data.health.series.find((series) => series.id === "fasting_glucose")?.values.map((item) => ({ x: item.year, y: item.value })) ?? [];

  return (
    <main className="min-h-screen subtle-grid bg-[var(--bg)] p-4 text-[var(--text)]">
      <div className="mx-auto grid max-w-7xl gap-4">
        <nav className="flex flex-wrap gap-2">
          {["/", "/finance", "/activity", "/travel", "/learning", "/data-center"].map((href) => (
            <Link key={href} href={href} className="rounded border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-[var(--muted)]">
              {href === "/" ? "Overview" : href.slice(1)}
            </Link>
          ))}
        </nav>

        <header className="metric-panel p-4">
          <div className="kpi-label">Health Dashboard</div>
          <h1 className="mt-2 text-2xl font-semibold">건강검진, 대사 리스크, 관리 액션</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">수치를 억지로 작게 넣지 않고, chart와 action list를 읽을 수 있는 크기로 배치합니다.</p>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            ["BMI", String(data.health.latest.bmi), "text-[var(--amber)]"],
            ["Glucose", String(data.health.latest.fasting_glucose), "text-white"],
            ["BP", `${data.health.latest.systolic_bp}/${data.health.latest.diastolic_bp}`, "text-white"],
            ["Actions", String(data.health.actions.length), "text-[var(--red)]"],
          ].map(([label, value, tone]) => (
            <div key={label} className="metric-panel p-4">
              <div className="kpi-label">{label}</div>
              <div className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_.8fr]">
          <Section title="Long-Term Health Trend">
            <div className="h-[360px] rounded border border-white/10 bg-black/20 p-3">
              <HealthTrendChart series={data.health.series} />
            </div>
          </Section>

          <Section title="Health Score">
            <div className="grid min-h-[360px] grid-rows-[180px_1fr] gap-3">
              <ScoreGaugeChart value={data.scores.health} color="#ffbf45" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded border border-white/10 bg-black/20 p-2">
                  <div className="kpi-label">BMI Sparkline</div>
                  <div className="h-[82px]">
                    <SparklineChart data={bmiSparkline} color="#18d690" />
                  </div>
                </div>
                <div className="rounded border border-white/10 bg-black/20 p-2">
                  <div className="kpi-label">Glucose Sparkline</div>
                  <div className="h-[82px]">
                    <SparklineChart data={glucoseSparkline} color="#3bc7ff" />
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Section title="Priority Tracking">
            <div className="space-y-2">
              {data.health.priorities.map((item) => (
                <div key={item.item} className="rounded border border-white/10 bg-black/20 p-3">
                  <div className="text-sm font-semibold">{item.item}</div>
                  <div className="mt-1 text-sm leading-5 text-[var(--muted)]">{item.dashboard_note}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Anomaly Markers">
            <div className="space-y-2">
              {data.health.anomalies.map((item) => (
                <div key={item} className="rounded border border-[var(--amber)]/30 bg-[var(--amber)]/10 p-3 text-sm text-[var(--amber)]">
                  {item}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Monitoring Cadence">
            <div className="space-y-2">
              {data.health.monitoring.map((item) => (
                <div key={item} className="rounded border border-white/10 bg-black/20 p-3 text-sm leading-5 text-[var(--muted)]">
                  {item}
                </div>
              ))}
              <div className="rounded border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 p-3 text-sm text-[var(--cyan)]">
                다음 phase: 398개 검진 상세 항목을 category matrix와 risk histogram으로 확장
              </div>
            </div>
          </Section>
        </section>
      </div>
    </main>
  );
}
