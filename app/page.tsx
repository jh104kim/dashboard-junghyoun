import Link from "next/link";
import {
  CompactBarChart,
  HealthTrendChart,
  ScoreGaugeChart,
  SparklineChart,
  WealthCompositionChart,
} from "@/components/DashboardCharts";
import { getDashboardData } from "@/lib/dashboard-data";
import { getLifeSourceSummary } from "@/lib/life-source";

export const dynamic = "force-dynamic";

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

function Kpi({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="kpi-label">{label}</div>
      <div className={`mt-1 truncate text-xl font-semibold leading-none ${tone}`}>{value}</div>
    </div>
  );
}

function DomainLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded border border-white/10 bg-white/[.035] px-2.5 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--cyan)]/50 hover:text-[var(--cyan)]"
    >
      {label}
    </Link>
  );
}

function ActionItem({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="action-item grid min-h-[44px] grid-cols-[88px_1fr] items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2">
      <span className="truncate text-xs font-semibold text-[var(--cyan)]">{label}</span>
      <span className="min-w-0 truncate text-sm text-[var(--text)]">{detail}</span>
    </div>
  );
}

export default async function Home() {
  const [data, lifeSummary] = await Promise.all([getDashboardData(), getLifeSourceSummary()]);
  const today = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const compactToday = today.replace(/\s/g, "").replace(/\.$/, "");

  const healthSparkline =
    data.health.series
      .find((series) => series.id === "bmi")
      ?.values.map((item) => ({ x: item.year, y: item.value })) ?? [];
  const taxSparkline = data.tax.map((item) => ({ x: item.year, y: Math.round(item.amount / 1000000) }));
  const pensionBars = data.pension.slice(0, 14).map((item) => ({
    label: item.year,
    value: Math.round(item.amount / 1000),
  }));
  const topHolding = data.investment[0];
  const healthPriority = data.health.priorities[0];
  const target57Progress = Math.min(Math.round((data.finance.netWorth / 5000000000) * 100), 100);
  const dataTrustScore = data.source === "supabase" ? 78 : data.source === "csv" ? 58 : 10;

  return (
    <main className="life-shell subtle-grid p-3">
      <section className="landing-grid mx-auto grid h-full max-w-[1920px] grid-rows-[72px_1fr_120px] gap-3">
        <header className="landing-header metric-panel grid grid-cols-[1.05fr_1.2fr_1.1fr] items-center gap-4 px-4">
          <div className="landing-meta flex min-w-0 items-center gap-5">
            <Kpi label="Today" value={compactToday} />
            <Kpi label="Profile" value="52 · Galaxy" />
            <Kpi label="Sync" value={sourceLabel(data.source)} tone="text-[var(--green)]" />
          </div>
          <div className="grid min-w-0 grid-cols-3 gap-3">
            <div className="rounded-md border border-white/10 bg-white/[.035] px-3 py-2">
              <Kpi label="Life Score" value={String(data.scores.life)} tone="text-[var(--green)]" />
            </div>
            <div className="rounded-md border border-white/10 bg-white/[.035] px-3 py-2">
              <Kpi label="Health" value={String(data.scores.health)} tone="text-[var(--amber)]" />
            </div>
            <div className="rounded-md border border-white/10 bg-white/[.035] px-3 py-2">
              <Kpi label="Finance" value={String(data.scores.finance)} tone="text-[var(--cyan)]" />
            </div>
          </div>
          <nav className="flex min-w-0 flex-wrap justify-end gap-2">
            <DomainLink href="/finance" label="Finance" />
            <DomainLink href="/health" label="Health" />
            <DomainLink href="/activity" label="Activity" />
            <DomainLink href="/travel" label="Travel" />
            <DomainLink href="/learning" label="Learning" />
            <DomainLink href="/data-center" label="Data" />
          </nav>
        </header>

        <section className="landing-main grid min-h-0 grid-cols-[1.1fr_.95fr_.95fr] grid-rows-[1fr_1fr] gap-3">
          <article className="metric-panel grid min-h-0 grid-rows-[44px_1fr] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Life Cockpit</h2>
                <p className="text-xs text-[var(--muted)]">대표 지표와 오늘의 운영 판단</p>
              </div>
              <span className="rounded border border-[var(--amber)]/40 bg-[var(--amber)]/10 px-2 py-1 text-xs font-semibold text-[var(--amber)]">
                Risk: {data.scores.risk}
              </span>
            </div>
            <div className="grid min-h-0 grid-cols-[150px_1fr] gap-3">
              <div className="chart-box min-h-0">
                <ScoreGaugeChart value={data.scores.life} />
              </div>
              <div className="grid min-h-0 content-start gap-2">
                <ActionItem label="Finance" detail={`${krw(data.finance.netWorth)} / 57세 목표 ${target57Progress}%`} />
                <ActionItem label="Health" detail={`BMI ${data.health.latest.bmi}, 혈당 ${data.health.latest.fasting_glucose}`} />
                <ActionItem label="Action" detail={healthPriority?.item ?? "관리 액션 확인 필요"} />
              </div>
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[44px_1fr] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Finance</h2>
                <p className="text-xs text-[var(--muted)]">자산, 부채, 연금 목표</p>
              </div>
              <Link href="/finance" className="text-xs font-semibold text-[var(--cyan)]">
                Open
              </Link>
            </div>
            <div className="grid min-h-0 grid-cols-[1fr_1fr] gap-3">
              <div className="chart-box min-h-0">
                <WealthCompositionChart data={data.finance.assetComposition} />
              </div>
              <div className="grid content-start gap-3">
                <Kpi label="Net Worth" value={krw(data.finance.netWorth)} tone="text-[var(--green)]" />
                <Kpi label="Debt Ratio" value={pct(data.finance.debtRatio)} />
                <Kpi label="10M Gap" value={`${Math.round(data.finance.monthlyIncomeGap / 10000).toLocaleString()}만`} tone="text-[var(--amber)]" />
              </div>
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[44px_1fr] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Health</h2>
                <p className="text-xs text-[var(--muted)]">위험 지표와 관리 우선순위</p>
              </div>
              <Link href="/health" className="text-xs font-semibold text-[var(--cyan)]">
                Open
              </Link>
            </div>
            <div className="grid min-h-0 grid-rows-[1fr_44px] gap-2">
              <div className="chart-box min-h-0 rounded-md border border-white/10 bg-black/20 p-2">
                <HealthTrendChart series={data.health.series} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Kpi label="BMI" value={String(data.health.latest.bmi)} tone="text-[var(--amber)]" />
                <Kpi label="Glucose" value={String(data.health.latest.fasting_glucose)} />
                <Kpi label="BP" value={`${data.health.latest.systolic_bp}/${data.health.latest.diastolic_bp}`} />
                <Kpi label="Actions" value={String(data.health.actions.length)} tone="text-[var(--red)]" />
              </div>
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[44px_1fr] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Retirement</h2>
                <p className="text-xs text-[var(--muted)]">나이별 연금 현금흐름</p>
              </div>
              <Link href="/retirement" className="text-xs font-semibold text-[var(--cyan)]">
                Open
              </Link>
            </div>
            <div className="chart-box min-h-0 rounded-md border border-white/10 bg-black/20 p-2">
              <CompactBarChart data={pensionBars} />
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[44px_1fr] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Activity & Travel</h2>
                <p className="text-xs text-[var(--muted)]">등산, 여행, 운동 데이터 후보</p>
              </div>
              <div className="flex gap-2">
                <Link href="/activity" className="text-xs font-semibold text-[var(--cyan)]">
                  Activity
                </Link>
                <Link href="/travel" className="text-xs font-semibold text-[var(--cyan)]">
                  Travel
                </Link>
              </div>
            </div>
            <div className="grid content-start gap-2">
                <ActionItem
                  label="Hiking"
                  detail={`방문 ${lifeSummary.activity.visitedMountains} / 후보 ${lifeSummary.activity.wishlistMountains}`}
                />
                <ActionItem label="Altitude" detail={`1,000m+ 산 ${lifeSummary.activity.highAltitudeMountains}개`} />
                <ActionItem label="Travel" detail={`오제 ${lifeSummary.travel.tripDays}일 / 준비물 ${lifeSummary.travel.packingItems}개`} />
            </div>
          </article>

          <article className="metric-panel grid min-h-0 grid-rows-[44px_1fr] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Signals & Trust</h2>
                <p className="text-xs text-[var(--muted)]">데이터 신뢰도와 학습 신호</p>
              </div>
              <Link href="/learning" className="text-xs font-semibold text-[var(--cyan)]">
                Open
              </Link>
            </div>
            <div className="grid min-h-0 grid-cols-[1fr_120px] gap-3">
              <div className="grid content-start gap-2">
                <ActionItem label="Data" detail={`Trust ${dataTrustScore} / ${sourceLabel(data.source)}`} />
                <ActionItem label="Learning" detail={`Pick ${lifeSummary.learning.finalPicks} / 후보 ${lifeSummary.learning.matchedCandidates}`} />
                <ActionItem label="Tax" detail={`최근 세금 추세 ${taxSparkline.at(-1)?.y ?? 0}백만`} />
              </div>
              <div className="grid min-h-0 grid-rows-2 gap-2">
                <div className="chart-box min-h-0 rounded-md border border-white/10 bg-black/20 p-1">
                  <SparklineChart data={healthSparkline} color="#18d690" />
                </div>
                <div className="chart-box min-h-0 rounded-md border border-white/10 bg-black/20 p-1">
                  <SparklineChart data={taxSparkline} color="#ffbf45" />
                </div>
              </div>
            </div>
          </article>
        </section>

        <footer className="landing-footer metric-panel grid grid-cols-[1.3fr_1fr_1fr] gap-3 p-3">
          <div className="min-w-0">
            <div className="kpi-label">Executive Summary</div>
            <p className="mt-2 line-clamp-2 text-[16px] font-semibold leading-snug">
              순자산은 {krw(data.finance.netWorth)}, 57세 목표 달성률은 {target57Progress}%입니다. 건강은 BMI {data.health.latest.bmi},
              공복혈당 {data.health.latest.fasting_glucose} 기준으로 우선 관리가 필요합니다.
            </p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="kpi-label">Top Holding</div>
            <div className="mt-2 grid grid-cols-[1fr_72px_48px] gap-2 text-sm">
              <span className="truncate">{topHolding?.name ?? "No holding"}</span>
              <span className="text-right text-[var(--cyan)]">{Math.round((topHolding?.value ?? 0) / 10000).toLocaleString()}만</span>
              <span className="text-right text-[var(--green)]">{topHolding?.returnPct ?? 0}%</span>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="kpi-label">Next Build</div>
            <div className="mt-2 truncate text-sm text-[var(--muted)]">Finance/Health deep pages, Activity/Travel/Learning dashboards</div>
          </div>
        </footer>
      </section>
    </main>
  );
}
