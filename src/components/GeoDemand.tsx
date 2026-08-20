import { useReveal } from "../hooks/useReveal";
import { IconAvoid, IconGlobe, IconMap, IconRank, IconStore } from "./Icons";

const features = [
  {
    icon: IconMap,
    title: "Global demand heat map",
    body: "See demand levels country by country — high, medium, low, or untested — on a single visual map. Tap any country for its individual score.",
  },
  {
    icon: IconRank,
    title: "Top 3 markets to launch in first",
    body: 'AI ranks your best opportunities with a plain-English reason for each. "Search interest in the USA has grown 62% in 90 days with very low seller competition."',
  },
  {
    icon: IconStore,
    title: "Platform recommendation per country",
    body: "Every market has its own dominant selling platform. Nexora tells you exactly where to sell in each country — not just whether to sell.",
  },
  {
    icon: IconAvoid,
    title: "Countries to avoid for this product",
    body: "Save your ad budget. AI flags markets where competition is too high or demand is too thin before you waste a single dollar testing them.",
  },
  {
    icon: IconGlobe,
    title: "Sell anywhere — we track 9 regions",
    body: "North America · South America · Europe · South Asia · East Asia · Southeast Asia · Middle East · Africa · Oceania",
  },
];

export function GeoDemand() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section geo" ref={ref}>
      <div className="wrap geo-layout">
        <div className="section-head reveal">
          <span className="eyebrow">Geographic demand intelligence</span>
          <h2>
            Find out where in the
            <br />
            world your product sells —
            <br />
            before you pick a market.
          </h2>
          <p>
            Don't just know if a product is trending. Know where it's trending —
            and which market to enter first.
          </p>
        </div>

        <ul className="feature-rows">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={f.title} className={`feature-row reveal reveal-delay-${(i % 3) + 1}`}>
                <Icon className="feature-row-icon" />
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
