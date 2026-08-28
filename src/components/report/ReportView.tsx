import Link from "next/link";
import type { ValidationReport } from "@/lib/types";

type ReportPayload = {
  id: string;
  productUrl: string | null;
  productDescription: string | null;
  report: ValidationReport;
};

export function ReportView({ id, initial }: { id: string; initial: ReportPayload }) {
  const data = initial;
  const r = data.report;
  const tone =
    r.verdict === "Opportunity" ? "win" : r.verdict === "Wait" ? "wait" : "skip";

  return (
    <div className="report-shell">
      <header className="report-hero">
        <p className="eyebrow">Full report</p>
        <div className={`verdict-pill tone-${tone}`}>{r.verdict}</div>
        <h1>
          {r.confidence} confidence · {r.bestFitMarket}
        </h1>
        <p className="lead">{r.summary}</p>
        <p className="product-chip">
          {data.productDescription || data.productUrl || "Submitted product"}
        </p>
      </header>

      <section className="report-grid">
        <article className="report-block">
          <h2>Reddit & community</h2>
          <p>{r.reddit.summary}</p>
          <p className="meta">
            Sentiment: {r.reddit.sentiment} · Mentions sampled: {r.reddit.mentionCount}
          </p>
          <ul className="quote-list">
            {r.reddit.sampleQuotes.map((q) => (
              <li key={q}>“{q}”</li>
            ))}
          </ul>
        </article>

        <article className="report-block">
          <h2>Ad activity</h2>
          <p>{r.ads.summary}</p>
          <p className="meta">
            Advertisers: {r.ads.advertiserCount ?? "n/a"} · Activity: {r.ads.activityLevel} ·
            Entrants: {r.ads.entrantVelocity}
          </p>
        </article>

        <article className="report-block">
          <h2>Search trend</h2>
          <p>{r.trends.summary}</p>
          <p className="meta">Direction: {r.trends.direction}</p>
          <ul className="trend-bars">
            {r.trends.regionalInterest.map((row) => (
              <li key={`${row.country}-${row.score}`}>
                <span>{row.country}</span>
                <i style={{ width: `${row.score}%` }} />
                <em>{row.score}</em>
              </li>
            ))}
          </ul>
        </article>

        <article className="report-block">
          <h2>Web mentions</h2>
          <p>{r.web.summary}</p>
          <p className="meta">Mentions: {r.web.mentionCount}</p>
          <div className="theme-row">
            {r.web.themes.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="report-block roadmap">
        <h2>Roadmap · {r.roadmap.headline}</h2>
        <p className="next-step">{r.roadmap.nextStep}</p>
        <ul>
          {r.roadmap.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="report-block sources">
        <h2>Sources used</h2>
        <ul className="source-list">
          {r.sources.map((s) => (
            <li key={s.name} className={s.available ? "ok" : "miss"}>
              <strong>{s.name}</strong>
              <span>{s.available ? "available" : s.note || "unavailable"}</span>
            </li>
          ))}
        </ul>
        <p className="meta">
          Unavailable sources lower confidence instead of failing the whole request.
        </p>
      </section>

      <div className="cta-row">
        <Link className="btn" href="/validate">
          Validate another product →
        </Link>
        <Link className="link-quiet" href={`/request/${id}`}>
          Back to Quick Verdict
        </Link>
      </div>
    </div>
  );
}
