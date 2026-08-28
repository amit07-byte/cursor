"use client";
import { useReveal } from "@/hooks/useReveal";

const features = [
  {
    title: "Validation history",
    body: "Every scan saved. Re-run any product with one click and see exactly what changed since your last check — trend up, competition rising, demand confirmed.",
  },
  {
    title: "Daily product alerts",
    body: "Every morning, 5 AI-curated trending products in your niche land in your inbox. Each with a score, supplier link, and one-click validate button.",
  },
  {
    title: "AI ad copy generator",
    body: "Nexora reads real buyer conversations from across the internet to write your first three ad hooks in the exact language your customers use.",
  },
  {
    title: "Image input",
    body: "Don't know the product name? Upload a photo. AI identifies the product and validates it automatically.",
  },
  {
    title: "URL input",
    body: "Paste any product URL from any major marketplace or store. AI extracts the product details and runs the full scan.",
  },
  {
    title: "Agency & team mode",
    body: "Manage validations for multiple clients. White-label PDF reports with your branding. Up to 5 team seats on Agency plan.",
  },
];

export function Features() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section features" id="features" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Everything you need</span>
          <h2>
            Built for sellers
            <br />
            who move fast.
          </h2>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <article key={f.title} className={`feature-cell reveal reveal-delay-${(i % 3) + 1}`}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
