import { useReveal } from "../hooks/useReveal";

const verdicts = [
  {
    tone: "win",
    headline: "Win it — launch now",
    body: "Low competition. Rising trend. Strong demand. Good margin. The AI found a real opportunity before the market gets saturated. Here's your supplier, your price, and your first three ad angles.",
  },
  {
    tone: "wait",
    headline: "Wait — check back in 14 days",
    body: "The trend is early and demand signals are appearing but not confirmed yet. Don't spend money today. The AI will tell you when the window opens.",
  },
  {
    tone: "skip",
    headline: "Skip it — save your money",
    body: "Market is saturated, trend is dying, or demand is too thin. You just saved yourself weeks of work and hundreds of dollars in wasted ad spend.",
  },
];

export function Verdict() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section verdict" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Three verdicts. Zero guesswork.</span>
          <h2>
            Your AI tells you
            <br />
            what to do next —
            <br />
            not just what the numbers say.
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
