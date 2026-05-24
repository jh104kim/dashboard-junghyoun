import {
  HealthTrendChart,
  InvestmentTreemap,
  PensionBarChart,
  TaxLineChart,
} from "@/components/DashboardCharts";
import { getDashboardData } from "@/lib/dashboard-data";

function krw(value: number) {
  return `${(value / 100000000).toFixed(1)}억`;
}

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function MiniKpi({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="kpi-label">{label}</div>
      <div className={`mt-1 truncate text-[18px] font-semibold leading-none ${tone}`}>{value}</div>
    </div>
  );
}

export default async function Home() {
  const data = await getDashboardData();
  const today = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date());

  const topHoldings = data.investment.slice(0, 4);

  return (
    <main className="life-shell subtle-grid p-3">
      <section className="grid h-full grid-rows-[72px_1fr_104px] gap-3">
        <header className="metric-panel grid grid-cols-[1.1fr_1.4fr_1fr] items-center gap-3 px-4">
          <div className="flex items-center gap-5">
            <div>
              <div className="kpi-label">Today</div>
              <div className="mt-1 text-lg font-semibold">{today}</div>
            </div>
            <div>
              <div className="kpi-label">Profile</div>
              <div className="mt-1 text-lg font-semibold">Age 52 · Galaxy</div>
            </div>
            <div>
              <div className="kpi-label">Sync</div>
              <div className="mt-1 text-lg font-semibold text-[var(--green)]">CSV · 3m ago</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-white/10 bg-white/[.035] px-3 py-2">
              <div className="kpi-label">Life Score</div>
              <div className="mt-1 text-3xl font-bold text-[var(--green)]">{data.scores.life}</div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[.035] px-3 py-2">
              <div className="kpi-label">Health</div>
              <div className="mt-1 text-3xl font-bold text-[var(--amber)]">{data.scores.health}</div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[.035] px-3 py-2">
              <div className="kpi-label">Finance</div>
              <div className="mt-1 text-3xl font-bold text-[var(--cyan)]">{data.scores.finance}</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="rounded-md border border-[var(--amber)]/40 bg-[var(--amber)]/10 px-3 py-2 text-sm font-semibold text-[var(--amber)]">
              Alert: Health Watch
            </div>
            <div className="rounded-md border border-[var(--green)]/40 bg-[var(--green)]/10 px-3 py-2 text-sm font-semibold text-[var(--green)]">
              Risk: {data.scores.risk}
            </div>
          </div>
        </header>

        <section className="grid min-h-0 grid-cols-2 grid-rows-2 gap-3">
          <article className="metric-panel grid min-h-0 grid-rows-[46px_1fr] p-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Health Zone</h2>
                <p className="text-xs text-[var(--muted)]">2016-2026 핵심 건강 장기 추세</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-right">
                <MiniKpi label="BMI" value={String(data.health.latest.bmi)} tone="text-[var(--amber)]" />
                <MiniKpi label="Glucose" value={`${data.health.latest.fasting_glucose}`} />
                <MiniKpi label="BP" value={`${data.health.latest.systolic_bp}/${data.health.latest.diastolic_bp}`} />
                <MiniKpi label="Actions" value={`${data.health.actions.length}`} tone="text-[var(--red)]" />
              </div>
            </div>
            <div className="chart-box min-h-0">
              <HealthTrendChart series={data.health.series} />
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[46px_1fr] p-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Finance & Investment Zone</h2>
                <p className="text-xs text-[var(--muted)]">순자산, 부채 비율, 보유종목 평가</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-right">
                <MiniKpi label="Net Worth" value={krw(data.finance.netWorth)} tone="text-[var(--green)]" />
                <MiniKpi label="Debt" value={krw(data.finance.debt)} />
                <MiniKpi label="Growth" value={pct(data.finance.netWorthGrowth)} tone="text-[var(--cyan)]" />
              </div>
            </div>
            <div className="chart-box min-h-0">
              <InvestmentTreemap data={data.investment} />
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[46px_1fr] p-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Spending & Risk Zone</h2>
                <p className="text-xs text-[var(--muted)]">소비 원장은 다음 ingestion 대상, 현재는 위험 액션 우선 표시</p>
              </div>
              <MiniKpi label="Risk Driver" value="Health" tone="text-[var(--amber)]" />
            </div>
            <div className="grid min-h-0 grid-cols-[1fr_1.2fr] gap-3">
              <div className="rounded-md border border-white/10 bg-black/20 p-3">
                <div className="kpi-label">Priority Actions</div>
                <div className="mt-3 space-y-2">
                  {data.health.actions.slice(0, 2).map((item) => (
                    <div key={item.item} className="rounded border border-white/10 bg-white/[.03] p-2">
                      <div className="truncate text-sm font-semibold">{item.item}</div>
                      <div className="mt-1 truncate text-xs text-[var(--muted)]">{item.dashboard_note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-3">
                <div className="kpi-label">Top Holdings</div>
                <div className="mt-3 space-y-2">
                  {topHoldings.map((item) => (
                    <div key={item.name} className="grid grid-cols-[1fr_76px_54px] gap-2 text-sm">
                      <span className="truncate">{item.name}</span>
                      <span className="text-right text-[var(--cyan)]">{Math.round(item.value / 10000).toLocaleString()}만</span>
                      <span className={item.returnPct >= 0 ? "text-right text-[var(--green)]" : "text-right text-[var(--red)]"}>
                        {item.returnPct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[46px_1fr] p-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Retirement & Tax Zone</h2>
                <p className="text-xs text-[var(--muted)]">연금 현금흐름과 세금 장기 타임라인</p>
              </div>
              <MiniKpi label="Pension Start" value="2028 · Age 55" tone="text-[var(--cyan)]" />
            </div>
            <div className="grid min-h-0 grid-cols-2 gap-3">
              <PensionBarChart data={data.pension} />
              <TaxLineChart data={data.tax} />
            </div>
          </article>
        </section>

        <footer className="metric-panel grid grid-cols-[1.35fr_.9fr_.9fr] gap-3 p-3">
          <div>
            <div className="kpi-label">AI Executive Summary</div>
            <p className="mt-2 text-[17px] font-semibold leading-snug">
              순자산은 {krw(data.finance.netWorth)}으로 안정적이나 BMI {data.health.latest.bmi}, 공복혈당{" "}
              {data.health.latest.fasting_glucose} 기준 건강 리스크 관리가 우선입니다.
            </p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center justify-between">
              <div className="kpi-label">Data Center Status</div>
              <span className="text-xs font-semibold text-[var(--amber)]">Ledger Pending</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <span className="text-[var(--muted)]">Health CSV</span>
              <span className="text-right text-[var(--green)]">Loaded</span>
              <span className="text-[var(--muted)]">Finance CSV</span>
              <span className="text-right text-[var(--green)]">Loaded</span>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="kpi-label">Next Actions</div>
            <div className="mt-2 text-sm leading-5 text-[var(--muted)]">
              CSV upload schema, Supabase RLS, Samsung Health sync adapter, family RBAC toggle.
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
