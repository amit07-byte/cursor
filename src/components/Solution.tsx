import { useReveal } from "../hooks/useReveal";

const steps = [
  {
    n: "01",
    label: "You add your product",
    body: "Type a product name, paste a product URL, or upload a product image. That's all you do.",
  },
  {
    n: "02",
    label: "AI scans the entire internet",
    body: "Our engine searches across social media, marketplaces, ad networks, video platforms, forums, news sites, and buyer communities — all at the same time, all in under 40 seconds.",
  },
  {
    n: "03",
    label: "You get a clear verdict",
    body: "Not raw data. Not a spreadsheet to interpret. A plain-English answer: Win it, Wait, or Skip it — with the exact next steps to take.",
  },
];

export function Solution() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section solution" id="how-it-works" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">How Nexora works</span>
          <h2>
            Add a product.
            <br />
            Get a verdict in 40 seconds.
          </h2>
          <p>One input. The entire internet scanned. One clear answer.</p>
        </div>

        <ol className="steps">
          {steps.map((step, i) => (
            <li key={step.n} className={`step reveal reveal-delay-${i + 1}`}>
              <span className="step-n">{step.n}</span>
              <div>
                <h3>{step.label}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
