import {
  HealthTrendChart,
  InvestmentTreemap,
  PensionBarChart,
  TaxLineChart,
  WealthCompositionChart,
} from "@/components/DashboardCharts";
import { getDashboardData } from "@/lib/dashboard-data";

function krw(value: number) {
  return `${(value / 100000000).toFixed(1)}억`;
}

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function sourceLabel(source: string) {
  if (source === "supabase") return "Supabase";
  if (source === "csv") return "CSV";
  return "No Data";
}

function MiniKpi({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="kpi-label">{label}</div>
      <div className={`mt-1 truncate text-[18px] font-semibold leading-none ${tone}`}>{value}</div>
    </div>
  );
}

function StaticTabs({ items, active }: { items: string[]; active: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded border px-2 py-1 text-[11px] leading-none ${
            item === active
              ? "border-[var(--cyan)]/50 bg-[var(--cyan)]/12 text-[var(--cyan)]"
              : "border-white/10 bg-white/[.03] text-[var(--muted)]"
          }`}
        >
          {item}
        </span>
      ))}
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

  const topHoldings = data.investment.slice(0, 5);
  const healthPriority = data.health.priorities.slice(0, 3);
  const strongestAsset = data.finance.assetComposition[0]?.label ?? "자산";

  return (
    <main className="life-shell subtle-grid p-3">
      <section className="grid h-full grid-rows-[72px_1fr_108px] gap-3">
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
              <div className="mt-1 text-lg font-semibold text-[var(--green)]">{sourceLabel(data.source)} · 3m ago</div>
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
              <div className="kpi-label">Asset</div>
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

        <section className="grid min-h-0 grid-cols-[1.25fr_.95fr] gap-3">
          <article className="metric-panel grid min-h-0 grid-rows-[56px_1fr_154px] p-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Asset Zone</h2>
                <p className="text-xs text-[var(--muted)]">전재산 구성, 투자, 연금, 세금, 월 1천만원 목표</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-right">
                <MiniKpi label="Net Worth" value={krw(data.finance.netWorth)} tone="text-[var(--green)]" />
                <MiniKpi label="Debt" value={krw(data.finance.debt)} />
                <MiniKpi label="Growth" value={pct(data.finance.netWorthGrowth)} tone="text-[var(--cyan)]" />
                <MiniKpi label="Gap/mo" value={`${Math.round(data.finance.monthlyIncomeGap / 10000).toLocaleString()}만`} tone="text-[var(--amber)]" />
              </div>
            </div>
            <div className="grid min-h-0 grid-cols-[.78fr_1.22fr] gap-3">
              <div className="grid min-h-0 grid-rows-[28px_1fr] rounded-md border border-white/10 bg-black/20 p-3">
                <StaticTabs items={["Summary", "Real Estate", "Pension", "Investment", "Debt", "Tax", "Scenario"]} active="Summary" />
                <div className="chart-box min-h-0">
                  <WealthCompositionChart data={data.finance.assetComposition} />
                </div>
              </div>
              <div className="grid min-h-0 grid-rows-[1fr_1fr] gap-3">
                <div className="grid min-h-0 grid-rows-[24px_1fr] rounded-md border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between">
                    <div className="kpi-label">Investment Allocation</div>
                    <span className="text-xs text-[var(--muted)]">Top {topHoldings.length}</span>
                  </div>
                  <InvestmentTreemap data={data.investment} />
                </div>
                <div className="grid min-h-0 grid-cols-[1.1fr_.9fr] gap-3">
                  <div className="grid min-h-0 grid-rows-[22px_1fr] rounded-md border border-white/10 bg-black/20 p-3">
                    <div className="kpi-label">Pension Timeline By Age</div>
                    <PensionBarChart data={data.pension} />
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/20 p-3">
                    <div className="kpi-label">Tax & Income Actions</div>
                    <div className="mt-3 space-y-2 text-xs leading-4 text-[var(--muted)]">
                      {data.finance.taxSuggestions.map((item) => (
                        <div key={item} className="rounded border border-white/10 bg-white/[.03] p-2">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid min-h-0 grid-cols-[1fr_1fr_1fr] gap-3">
              <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
                <div className="kpi-label">Asset Reading</div>
                <p className="mt-2 text-sm leading-5">
                  핵심 축은 {strongestAsset}이고, 부채비율은 {pct(data.finance.debtRatio)}입니다.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
                <div className="kpi-label">Monthly 10M Target</div>
                <p className="mt-2 text-sm leading-5">
                  예상 연금 월 {Math.round(data.finance.projectedMonthlyPension / 10000).toLocaleString()}만, 부족분{" "}
                  {Math.round(data.finance.monthlyIncomeGap / 10000).toLocaleString()}만입니다.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
                <div className="kpi-label">Holdings Watch</div>
                <div className="mt-2 space-y-1">
                  {topHoldings.map((item) => (
                    <div key={item.name} className="grid grid-cols-[1fr_72px_46px] gap-2 text-xs">
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

          <article className="metric-panel grid min-h-0 grid-rows-[56px_1fr_154px] p-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Health Zone</h2>
                <p className="text-xs text-[var(--muted)]">현재 상태, 관리 우선순위, 이상 신호, 유지 모니터링</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-right">
                <MiniKpi label="BMI" value={String(data.health.latest.bmi)} tone="text-[var(--amber)]" />
                <MiniKpi label="Glucose" value={`${data.health.latest.fasting_glucose}`} />
                <MiniKpi label="BP" value={`${data.health.latest.systolic_bp}/${data.health.latest.diastolic_bp}`} />
                <MiniKpi label="Actions" value={`${data.health.actions.length}`} tone="text-[var(--red)]" />
              </div>
            </div>
            <div className="grid min-h-0 grid-rows-[28px_1fr_128px] gap-3">
              <StaticTabs items={["Summary", "Metabolic", "Cardio", "Liver", "Weight", "Checkups", "Actions"]} active="Summary" />
              <div className="chart-box min-h-0 rounded-md border border-white/10 bg-black/20 p-3">
                <HealthTrendChart series={data.health.series} />
              </div>
              <div className="grid min-h-0 grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-black/20 p-3">
                  <div className="kpi-label">Priority Tracking</div>
                  <div className="mt-2 space-y-2">
                    {healthPriority.map((item) => (
                      <div key={item.item} className="rounded border border-white/10 bg-white/[.03] p-2">
                        <div className="truncate text-sm font-semibold">{item.item}</div>
                        <div className="mt-1 truncate text-xs text-[var(--muted)]">{item.dashboard_note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-white/10 bg-black/20 p-3">
                  <div className="kpi-label">Anomalies & Monitoring</div>
                  <div className="mt-2 space-y-2 text-xs leading-4 text-[var(--muted)]">
                    {[...data.health.anomalies, ...data.health.monitoring].slice(0, 4).map((item) => (
                      <div key={item} className="truncate rounded border border-white/10 bg-white/[.03] p-2">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid min-h-0 grid-cols-[1fr_.9fr] gap-3">
              <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
                <div className="kpi-label">Care Guidance</div>
                <p className="mt-2 text-sm leading-5">
                  혈당과 BMI를 같은 주간 리듬으로 보면서 수면, 식사, 운동 변화가 수치에 미치는 영향을 계속 추적합니다.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
                <div className="kpi-label">Tax Timeline</div>
                <TaxLineChart data={data.tax} />
              </div>
            </div>
          </article>
        </section>

        <footer className="metric-panel grid grid-cols-[1.35fr_.9fr_.9fr] gap-3 p-3">
          <div>
              <div className="kpi-label">AI Executive Summary</div>
              <p className="mt-2 text-[17px] font-semibold leading-snug">
              순자산은 {krw(data.finance.netWorth)}이고 월 1천만원 목표 부족분은{" "}
              {Math.round(data.finance.monthlyIncomeGap / 10000).toLocaleString()}만원입니다. BMI {data.health.latest.bmi}, 공복혈당{" "}
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
