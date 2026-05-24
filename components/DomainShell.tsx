import Link from "next/link";

type DomainShellProps = {
  title: string;
  subtitle: string;
  kpis: Array<{ label: string; value: string; tone?: string }>;
  sections: Array<{ title: string; items: string[] }>;
};

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/data-center", label: "Data Center" },
  { href: "/assets", label: "Assets" },
  { href: "/health", label: "Health" },
  { href: "/finance", label: "Finance" },
  { href: "/investment", label: "Investment" },
  { href: "/retirement", label: "Retirement" },
  { href: "/tax", label: "Tax" },
  { href: "/ai-insight", label: "AI Insight" },
];

export function DomainShell({ title, subtitle, kpis, sections }: DomainShellProps) {
  return (
    <main className="min-h-screen subtle-grid bg-[var(--bg)] p-4 text-[var(--text)]">
      <div className="mx-auto grid max-w-7xl gap-4">
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-[var(--muted)] hover:border-[var(--cyan)]/50 hover:text-[var(--cyan)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <header className="metric-panel p-4">
          <div className="kpi-label">Life OS Drilldown</div>
          <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {kpis.map((item) => (
            <div key={item.label} className="metric-panel p-4">
              <div className="kpi-label">{item.label}</div>
              <div className={`mt-2 text-2xl font-semibold ${item.tone ?? "text-white"}`}>{item.value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-3 lg:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="metric-panel p-4">
              <h2 className="text-base font-semibold">{section.title}</h2>
              <div className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <div key={item} className="rounded border border-white/10 bg-black/20 p-3 text-sm leading-5 text-[var(--muted)]">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
