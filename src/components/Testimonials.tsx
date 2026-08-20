import { useReveal } from "../hooks/useReveal";

const quotes = [
  {
    quote:
      "I was about to order 200 units of a product. Nexora told me the market was already saturated and trending down. Saved me at least ₹80,000.",
    name: "Rahul M.",
    title: "Dropshipper, Mumbai",
  },
  {
    quote:
      "The geo demand feature is insane. I found out my product was blowing up in Brazil before any of my competitors noticed. First to market, best margins.",
    name: "Priya S.",
    title: "Online Seller, Bangalore",
  },
  {
    quote:
      "I run validations every morning before deciding what to source that week. My win rate on new products went from 1 in 5 to 3 in 5.",
    name: "Arjun K.",
    title: "Store Owner, Delhi",
  },
  {
    quote:
      "Other tools give me data I still have to interpret myself. Nexora just tells me what to do. That's worth 10x the price.",
    name: "Siddharth R.",
    title: "E-commerce Agency, Chennai",
  },
];

export function Testimonials() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section testimonials" ref={ref}>
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">What sellers say</span>
          <h2>
            Real results from
            <br />
            real e-commerce sellers.
          </h2>
        </div>

        <div className="quote-grid">
          {quotes.map((q, i) => (
            <blockquote
              key={q.name}
              className={`quote reveal reveal-delay-${(i % 3) + 1}`}
            >
              <p>“{q.quote}”</p>
              <footer>
                <cite>{q.name}</cite>
                <span>{q.title}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
