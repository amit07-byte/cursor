"use client";

import { useReveal } from "@/hooks/useReveal";

const verdicts = [
  {
    tone: "win",
    headline: "Opportunity — worth testing",
    body: "Demand and conversation signals support a careful launch. Competition is manageable. Confidence and best-fit market are shown up front, with sources in the full report.",
  },
  {
    tone: "wait",
    headline: "Wait — don’t spend yet",
    body: "Signals are early, mixed, or incomplete. Hold ad budget, watch the trend, and re-validate before committing money.",
  },
  {
    tone: "skip",
    headline: "Crowded — protect your budget",
    body: "Saturation, ad density, or fading demand make this a poor bet as-is. The roadmap still gives a next step: differentiate, pivot, or skip.",
  },
];

export function Verdict() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section verdict" id="verdicts" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Three verdicts. Zero black boxes.</span>
          <h2>
            A plain-English answer —
            <br />
            backed by a report you can open.
          </h2>
        </div>

        <div className="verdict-grid">
          {verdicts.map((v, i) => (
            <article
              key={v.tone}
              className={`verdict-card tone-${v.tone} reveal reveal-delay-${i + 1}`}
            >
              <h3>{v.headline}</h3>
              <p>{v.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
