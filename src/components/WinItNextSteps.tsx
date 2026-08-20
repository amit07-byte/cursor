import { useReveal } from "../hooks/useReveal";

const cards = [
  {
    title: "Top 3 suppliers ranked",
    body: "Best wholesale suppliers for your product ranked by price, shipping speed, and rating. With one-click links to each.",
  },
  {
    title: "Suggested retail price",
    body: "Based on competitor pricing analysis. Includes a full margin breakdown: supplier cost + shipping + fees = your profit per unit.",
  },
  {
    title: "Top 3 marketing angles",
    body: "Real ad hooks written from actual buyer language found across forums and community discussions. Not generic copy — the exact words your customers already use.",
  },
  {
    title: "4-step launch checklist",
    body: "Order sample → Set up store → Film 3 short videos → Run a small test ad. Every step to go live in under a week.",
  },
];

export function WinItNextSteps() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section win-next" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">More than a verdict</span>
          <h2>
            When you get a Win it —
            <br />
            we hand you the
            <br />
            entire launch plan.
          </h2>
          <p>
            Most research tools stop at "this product is trending." Nexora goes
            four steps further.
          </p>
        </div>

        <div className="next-grid">
          {cards.map((c, i) => (
            <article key={c.title} className={`next-item reveal reveal-delay-${(i % 3) + 1}`}>
              <span className="next-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
