import Link from "next/link";
import { CompactBarChart, SparklineChart, WealthCompositionChart } from "@/components/DashboardCharts";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

function krw(value: number) {
  return `${(value / 100000000).toFixed(1)}억`;
}

function moneyMan(value: number) {
  return `${Math.round(value / 10000).toLocaleString()}만`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="metric-panel min-w-0 p-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function FinancePage() {
  const data = await getDashboardData();
  const target57Progress = Math.min(Math.round((data.finance.netWorth / 5000000000) * 100), 100);
  const pensionBars = data.pension.map((item) => ({ label: item.year, value: Math.round(item.amount / 1000) }));
  const taxSparkline = data.tax.map((item) => ({ x: item.year, y: Math.round(item.amount / 1000000) }));
  const salaryBars = data.finance.salaryTax.map((item) => ({ label: item.year, value: Math.round(item.grossPay / 1000000) }));
  const takehomeBars = data.finance.takehomeScenarios.slice(-10).map((item) => ({
    label: Math.round(item.annualSalary / 10000000),
    value: Math.round(item.monthlyTakehome / 10000),
  }));
  const latestTaxPayments = data.finance.taxPayments.slice(0, 6);
  const largestDebt = [...data.finance.debtLoan].sort((a, b) => b.amount - a.amount)[0];

  return (
    <main className="min-h-screen subtle-grid bg-[var(--bg)] p-4 text-[var(--text)]">
      <div className="mx-auto grid max-w-7xl gap-4">
        <nav className="flex flex-wrap gap-2">
          {["/", "/health", "/activity", "/travel", "/learning", "/data-center"].map((href) => (
            <Link key={href} href={href} className="rounded border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-[var(--muted)]">
              {href === "/" ? "Overview" : href.slice(1)}
            </Link>
          ))}
        </nav>

        <header className="metric-panel p-4">
          <div className="kpi-label">Finance Dashboard</div>
          <h1 className="mt-2 text-2xl font-semibold">자산, 연금, 투자, 세금, 소득 목표</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Landing에서 숨긴 상세 분석을 이 페이지에서 읽을 수 있는 밀도로 표기합니다.</p>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            ["Net Worth", krw(data.finance.netWorth), "text-[var(--green)]"],
            ["57y Target", `${target57Progress}%`, "text-[var(--cyan)]"],
            ["Debt", krw(data.finance.debt || largestDebt?.amount || 0), "text-white"],
            ["10M Gap", moneyMan(data.finance.monthlyIncomeGap), "text-[var(--amber)]"],
          ].map(([label, value, tone]) => (
            <div key={label} className="metric-panel p-4">
              <div className="kpi-label">{label}</div>
              <div className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
          <Section title="Asset Composition">
            <div className="finance-asset-grid grid min-h-[320px] grid-cols-[1fr_.9fr] gap-4">
              <WealthCompositionChart data={data.finance.assetComposition} />
              <div className="space-y-2">
                {data.finance.assetComposition.map((item) => (
                  <div key={item.label} className="grid grid-cols-[1fr_90px] rounded border border-white/10 bg-black/20 p-3 text-sm">
                    <span className="truncate">{item.label}</span>
                    <span className="text-right text-[var(--cyan)]">{krw(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Pension Cashflow">
            <div className="h-[320px]">
              <CompactBarChart data={pensionBars} />
            </div>
          </Section>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Section title="Investment Holdings">
            <div className="space-y-2">
              {data.investment.slice(0, 8).map((item) => (
                <div key={item.name} className="finance-holding-row grid grid-cols-[1fr_86px_58px] gap-3 rounded border border-white/10 bg-black/20 p-3 text-sm">
                  <span className="truncate">{item.name}</span>
                  <span className="text-right text-[var(--cyan)]">{moneyMan(item.value)}</span>
                  <span className={item.returnPct >= 0 ? "text-right text-[var(--green)]" : "text-right text-[var(--red)]"}>{item.returnPct}%</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Tax Trend">
            <div className="h-[170px] rounded border border-white/10 bg-black/20 p-2">
              <SparklineChart data={taxSparkline} color="#ffbf45" />
            </div>
            <div className="mt-3 space-y-2">
              {data.tax.slice(-5).map((item) => (
                <div key={item.year} className="grid grid-cols-[80px_1fr] rounded border border-white/10 bg-black/20 p-2 text-sm">
                  <span>{item.year}</span>
                  <span className="text-right text-[var(--amber)]">{Math.round(item.amount / 1000000).toLocaleString()}백만</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Finance Actions">
            <div className="space-y-2">
              {data.finance.taxSuggestions.map((item) => (
                <div key={item} className="rounded border border-white/10 bg-black/20 p-3 text-sm leading-5 text-[var(--muted)]">
                  {item}
                </div>
              ))}
              <div className="rounded border border-[var(--amber)]/30 bg-[var(--amber)]/10 p-3 text-sm text-[var(--amber)]">
                다음 phase: 급여, 실수령, 대출, 세금 납부 원장을 import에 포함
              </div>
            </div>
          </Section>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Section title="Pension Products">
            <div className="space-y-2">
              {data.finance.pensionProducts.map((item) => (
                <div key={`${item.institution}-${item.product}`} className="grid grid-cols-[1fr_74px_70px] gap-2 rounded border border-white/10 bg-black/20 p-3 text-sm">
                  <span className="truncate">{item.institution} · {item.product}</span>
                  <span className="text-right text-[var(--cyan)]">{moneyMan(item.valuation)}</span>
                  <span className="text-right text-[var(--muted)]">{item.startAge}세</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Salary And Tax">
            <div className="h-[170px] rounded border border-white/10 bg-black/20 p-2">
              <CompactBarChart data={salaryBars} color="#18d690" />
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">2010-2024 gross pay 기준. 다음 단계에서 bonus/tax-rate stacked view로 확장합니다.</div>
          </Section>

          <Section title="Takehome Scenarios">
            <div className="h-[170px] rounded border border-white/10 bg-black/20 p-2">
              <CompactBarChart data={takehomeBars} color="#9b8cff" />
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">연봉 구간별 월 실수령 비교. X축은 천만원 단위입니다.</div>
          </Section>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Section title="Debt And Loan Snapshot">
            <div className="grid gap-2 md:grid-cols-2">
              {data.finance.debtLoan.slice(0, 8).map((item) => (
                <div key={`${item.label}-${item.amount}`} className="rounded border border-white/10 bg-black/20 p-3">
                  <div className="truncate text-sm font-semibold">{item.label}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-[var(--muted)]">Amount</span>
                    <span className="text-right text-[var(--cyan)]">{moneyMan(item.amount)}</span>
                    <span className="text-[var(--muted)]">Monthly Interest</span>
                    <span className="text-right text-[var(--amber)]">{moneyMan(item.monthlyInterest)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Tax Payments Ledger">
            <div className="space-y-2">
              {latestTaxPayments.map((item) => (
                <div key={`${item.paymentDate}-${item.taxType}-${item.amount}`} className="grid grid-cols-[92px_1fr_86px] gap-3 rounded border border-white/10 bg-black/20 p-3 text-sm">
                  <span className="text-[var(--muted)]">{item.paymentDate || item.taxYear}</span>
                  <span className="truncate">{item.taxType || item.jurisdiction}</span>
                  <span className="text-right text-[var(--amber)]">{moneyMan(item.amount)}</span>
                </div>
              ))}
            </div>
          </Section>
        </section>
      </div>
    </main>
  );
}
