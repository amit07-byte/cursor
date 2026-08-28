"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StatusPayload = {
  id: string;
  status: "pending" | "complete" | "failed";
  errorMessage?: string | null;
  productUrl?: string | null;
  productDescription?: string | null;
  verdict?: {
    label: string;
    confidence: string;
    confidenceScore: number;
    bestFitMarket: string;
    summary: string;
  } | null;
};

const STEPS = [
  "Checking Reddit & community chatter",
  "Pulling Google Trends & regional interest",
  "Scanning Meta Ad Library activity",
  "Synthesizing Quick Verdict",
];

export function RequestStatusClient({
  id,
  initial,
}: {
  id: string;
  initial: StatusPayload;
}) {
  const [data, setData] = useState<StatusPayload>(initial);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (data.status !== "pending") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/request-status/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setError("Request not found");
          return;
        }
        const json = (await res.json()) as StatusPayload;
        if (cancelled) return;
        setData(json);
        if (json.status === "pending") {
          timer = setTimeout(poll, 1200);
        }
      } catch {
        if (!cancelled) setError("Could not load status");
      }
    }

    timer = setTimeout(poll, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, data.status]);

  useEffect(() => {
    if (data.status !== "pending") return;
    const t = setInterval(() => setTick((n) => n + 1), 1600);
    return () => clearInterval(t);
  }, [data.status]);

  if (error) {
    return (
      <div className="status-panel">
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <Link className="btn" href="/validate">
          Try again
        </Link>
      </div>
    );
  }

  if (data.status === "pending") {
    return (
      <div className="status-panel researching">
        <p className="eyebrow">Researching…</p>
        <h1>Scanning the market for your product</h1>
        <p className="lead">
          We’re checking Reddit, Google Trends, and ad activity — this usually takes about a
          minute.
        </p>
        <ul className="research-steps">
          {STEPS.map((step, i) => (
            <li key={step} className={i <= tick % STEPS.length ? "is-active" : ""}>
              {step}
            </li>
          ))}
        </ul>
        <div className="research-bar" aria-hidden>
          <span />
        </div>
        <p className="product-chip">
          {data.productDescription || data.productUrl || "Your product"}
        </p>
      </div>
    );
  }

  if (data.status === "failed") {
    return (
      <div className="status-panel">
        <p className="eyebrow">Request failed</p>
        <h1>We couldn’t finish this run</h1>
        <p className="lead">
          {data.errorMessage ||
            "Something went wrong on our side. Your credit was restored — please resubmit."}
        </p>
        <Link className="btn" href="/validate">
          Resubmit at no cost →
        </Link>
      </div>
    );
  }

  const verdict = data.verdict!;
  const tone =
    verdict.label === "Opportunity" ? "win" : verdict.label === "Wait" ? "wait" : "skip";

  return (
    <div className="status-panel verdict-ready">
      <p className="eyebrow">Quick Verdict</p>
      <div className={`verdict-pill tone-${tone}`}>{verdict.label}</div>
      <h1>
        {verdict.confidence} confidence · Best-fit market: {verdict.bestFitMarket}
      </h1>
      <p className="lead">{verdict.summary}</p>
      <p className="meta">Confidence score: {verdict.confidenceScore}/100</p>
      <div className="cta-row">
        <Link className="btn btn-lg" href={`/report/${id}`}>
          Open full report →
        </Link>
        <Link className="link-quiet" href="/validate">
          Validate another product
        </Link>
      </div>
    </div>
  );
}
