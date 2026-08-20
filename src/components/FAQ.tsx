import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const faqs = [
  {
    q: "How is Nexora different from other product research tools?",
    a: "Most research tools check a few ad libraries and databases and hand you a spreadsheet of numbers to interpret yourself. Nexora reads real buyer conversations happening across the internet — forums, review sites, community boards, video platforms — and uses AI to understand what people are actually saying. Then it tells you what to do, not just what the numbers are.",
  },
  {
    q: "How accurate are the verdicts?",
    a: "Our scoring is based on real signals from 16 sources, not guesses. No tool can guarantee a product will win — markets change. But Nexora gives you the best available picture of what the data says right now, with a confidence level shown on every result.",
  },
  {
    q: "What if my product has no internet presence at all?",
    a: "That's valuable information too. Nexora gives you one of four intelligent responses: Blue Ocean (first mover opportunity), Name Mismatch (try these alternative search terms), No Demand Signal (high risk — here's why), or Local Signal Only (strong in one region, invisible elsewhere).",
  },
  {
    q: "Does it work for Indian sellers and Indian marketplaces?",
    a: "Yes. Nexora is built with the Indian market in mind. It covers India-specific marketplaces and demand signals, and supports Indian payment methods including UPI, net banking, and all major cards.",
  },
  {
    q: "Can I use this for private label, not just dropshipping?",
    a: "Absolutely. Dropshippers, private label sellers, D2C brand founders, and e-commerce agencies all use Nexora. The verdict and supplier data are relevant to any seller model.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All data is encrypted in transit and at rest. Your validation history is private and only visible to you. We never sell your data or share it with third parties.",
  },
  {
    q: "How do I cancel?",
    a: "Cancel anytime from your account settings with one click. No forms, no emails, no questions. Your access continues until the end of your billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. If you're not satisfied within your first 7 days on a paid plan, contact us and we'll refund you in full. No questions asked.",
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
                <div
                  className="faq-a"
                  role="region"
                  hidden={!isOpen}
                >
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
