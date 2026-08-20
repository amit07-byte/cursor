import { useReveal } from "../hooks/useReveal";
import { IconCheck } from "./Icons";

const tiers = [
  {
    name: "Starter",
    price: "$29",
    label: "For sellers just getting started",
    popular: false,
    features: [
      "60 validations per month",
      "All 16 source scans",
      "Win it / Wait / Skip verdict",
      "Top 3 supplier recommendations",
      "Validation history (90 days)",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    label: "For serious sellers who validate daily",
    popular: true,
    features: [
      "Unlimited validations",
      "Everything in Starter",
      "Full geographic demand map",
      "AI-generated ad copy",
      "Daily product alerts (5 products/day)",
      "Re-validation with change tracking",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: "$199",
    label: "For agencies managing multiple clients",
    popular: false,
    features: [
      "Everything in Pro",
      "5 team seats",
      "White-label PDF reports",
      "API access",
      "Client workspace management",
      "Dedicated support",
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
            Pay only when
            <br />
            you're ready to scale.
          </h2>
          <p>No contracts. Cancel anytime. 7-day free trial on all paid plans.</p>
        </div>

        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <article
              key={tier.name}
              className={`price-card ${tier.popular ? "is-popular" : ""} reveal reveal-delay-${i + 1}`}
            >
              {tier.popular && <span className="popular-badge">Most popular</span>}
              <h3>{tier.name}</h3>
              <p className="price">
                {tier.price} <span>/ month</span>
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
              <a className="btn" href="#final-cta">
                Start free trial
              </a>
            </article>
          ))}
        </div>

        <p className="pricing-note reveal">
          Annual pricing saves 20% · Indian payment methods supported including
          UPI, net banking, and all major cards
        </p>
      </div>
    </section>
  );
}
