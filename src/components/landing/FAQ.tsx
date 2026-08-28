"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const faqs = [
  {
    q: "How is Nexora different from other research tools?",
    a: "Most tools dump raw charts. Nexora returns a plain-English Opportunity / Wait / Crowded verdict with confidence and best-fit market — and every answer opens into a full report you can verify yourself.",
  },
  {
    q: "What sources do you check?",
    a: "MVP pulls Reddit/Quora/general web via Exa, demand direction via Google Trends, and advertiser activity via Meta Ad Library, then synthesizes with Claude. If one source fails, we still return a partial result with lower confidence.",
  },
  {
    q: "How many free validations do I get?",
    a: "Three lifetime free validations per email. After that you’ll be directed to payment options. We also rate-limit submissions to prevent abuse.",
  },
  {
    q: "Do I need an account?",
    a: "For free tier MVP, email is enough to submit. Magic-link / OTP login (Supabase Auth) lets you return to reports later without passwords.",
  },
  {
    q: "What if research fails after I pay?",
    a: "We never leave paid failures unresolved: the payment is logged, you get an automatic credit or refund path, and the founder is alerted.",
  },
  {
    q: "Is my data safe?",
    a: "We only collect email + product input at MVP. API keys stay server-side. Payment cards are handled only on PayPal/Payoneer/Razorpay hosted checkout.",
  },
];

export function FAQ() {
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section faq" id="faq" ref={ref}>
      <div className="wrap faq-layout">
        <div className="section-head reveal">
          <span className="eyebrow">Questions</span>
          <h2>Everything you want to know.</h2>
        </div>

        <div className="faq-list reveal">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <button
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div className="faq-a" role="region" hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
