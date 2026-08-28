"use client";

import { useReveal } from "@/hooks/useReveal";

const steps = [
  {
    n: "01",
    label: "You submit a product",
    body: "Paste a product URL or describe what you want to sell. Email only — no account setup required for free validations.",
  },
  {
    n: "02",
    label: "Nexora researches in parallel",
    body: "We pull Reddit/Quora/web signals (Exa), Google Trends, and Meta Ad Library activity, then synthesize with Claude — usually in under 90 seconds.",
  },
  {
    n: "03",
    label: "You get a verdict + full report",
    body: "A plain-English Opportunity / Wait / Crowded answer with confidence and best-fit market — plus an openable report you can verify yourself.",
  },
];

export function Solution() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section solution" id="how-it-works" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">How Nexora works</span>
          <h2>
            Scan.
            <br />
            Verdict.
            <br />
            Report you can trust.
          </h2>
          <p>Built for testing dropshippers who need a go / wait / no decision before ad spend.</p>
        </div>

        <ol className="steps">
          {steps.map((step, i) => (
            <li key={step.n} className={`step reveal reveal-delay-${i + 1}`}>
              <span className="step-n">{step.n}</span>
              <div>
                <h3>{step.label}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
