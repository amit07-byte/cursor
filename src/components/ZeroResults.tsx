import { useReveal } from "../hooks/useReveal";

const outcomes = [
  {
    tone: "win",
    title: "Blue ocean opportunity",
    body: "Zero competition found anywhere. You might be first to market. AI recommends a low-cost organic content test before you commit any money.",
  },
  {
    tone: "ocean",
    title: "Try these names instead",
    body: "We couldn't find your exact product but found similar ones under different names. One click re-validates under the better search term.",
  },
  {
    tone: "wait",
    title: "Nobody is searching yet",
    body: "High risk. No search volume, no social content, no buyer questions found. Not recommended without a paid education campaign.",
  },
  {
    tone: "local",
    title: "Strong in one region only",
    body: "Big in one market, invisible everywhere else. AI recommends a geo-specific launch strategy before going global.",
  },
];

export function ZeroResults() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section zero" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Even nothing tells you something</span>
          <h2>
            Product has no internet presence?
            <br />
            That's actually useful data.
          </h2>
          <p>
            Other tools show an error. Nexora shows you what it means — and what
            to do about it.
          </p>
        </div>

        <div className="zero-grid">
          {outcomes.map((o, i) => (
            <article
              key={o.title}
              className={`zero-card tone-${o.tone} reveal reveal-delay-${(i % 3) + 1}`}
            >
              <h3>{o.title}</h3>
              <p>{o.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
