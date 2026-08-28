"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";
import { IconCheck } from "@/components/ui/Icons";

const tiers = [
  {
    name: "Free",
    price: "$0",
    label: "Try before you buy",
    popular: false,
    cta: "Validate a product",
    href: "/validate",
    features: [
      "3 lifetime free validations",
      "Quick Verdict + Full Report",
      "Reddit, Trends & Ad signals",
      "Email magic-link access (coming)",
      "No credit card required",
    ],
  },
  {
    name: "Concierge pack",
    price: "$29",
    label: "For sellers validating before a launch",
    popular: true,
    cta: "View payment options",
    href: "/pricing",
    features: [
      "10 additional validations",
      "Everything in Free",
      "Roadmap next steps on every report",
      "Priority processing",
      "PayPal / Payoneer checkout",
    ],
  },
  {
    name: "Pro monthly",
    price: "$79",
    label: "For sellers who validate weekly",
    popular: false,
    cta: "View payment options",
    href: "/pricing",
    features: [
      "Unlimited validations*",
      "Full report history",
      "Rate-limit exemptions for fair use",
      "India Razorpay option (later)",
      "Email support",
    ],
  },
];

export function Pricing() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section pricing" id="pricing" ref={ref}>
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Simple pricing</span>
          <h2>
            Start free.
            <br />
            Upgrade only when
            <br />
            credits run out.
          </h2>
          <p>No aggressive upsells mid-report. Payment only after free validations are used.</p>
        </div>

        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <article
              key={tier.name}
              className={`price-card ${tier.popular ? "is-popular" : ""} reveal reveal-delay-${i + 1}`}
            >
              {tier.popular && <span className="popular-badge">Most useful next</span>}
              <h3>{tier.name}</h3>
              <p className="price">
                {tier.price} {tier.price !== "$0" && <span>/ pack</span>}
              </p>
              <p className="price-label">{tier.label}</p>
              <ul>
                {tier.features.map((f) => (
                  <li key={f}>
                    <IconCheck className="price-check" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link className="btn" href={tier.href}>
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="pricing-note reveal">
          *Fair-use rate limits apply. Checkout is hosted on PayPal / Payoneer — Nexora never
          stores card numbers.
        </p>
      </div>
    </section>
  );
}
