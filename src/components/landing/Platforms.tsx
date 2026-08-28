"use client";
import { useReveal } from "@/hooks/useReveal";

const platforms = [
  "Search trends",
  "Short video",
  "Paid ads",
  "Social media",
  "Community forums",
  "Global marketplaces",
  "Wholesale suppliers",
  "Discount platforms",
  "Q&A communities",
  "Video reviews",
  "Real-time chatter",
  "Visual shopping",
  "Regional marketplaces",
  "News & blogs",
  "Creator stores",
  "Independent stores",
];

export function Platforms() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section platforms" ref={ref}>
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Every signal. One place.</span>
          <h2>
            We read the internet
            <br />
            so you don't have to.
          </h2>
          <p>
            Most product research tools check 3–4 data sources. Nexora checks 16
            — including the ones where real buyers actually talk.
          </p>
        </div>

        <div className="pill-cloud reveal">
          {platforms.map((p, i) => (
            <span
              key={p}
              className="pill"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {p}
            </span>
          ))}
        </div>

        <div className="platform-stat reveal">
          <p className="stat-bold">16 internet sources scanned in parallel</p>
          <p>Results in under 40 seconds</p>
        </div>
      </div>
    </section>
  );
}
