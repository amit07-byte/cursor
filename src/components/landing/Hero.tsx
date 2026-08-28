import Link from "next/link";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-brand">
      <div className="hero-visual" aria-hidden>
        <div className="hero-atmosphere" />
        <div className="hero-grid" />
        <div className="hero-panel">
          <div className="hero-panel-top">
            <span className="hero-dot win" />
            <span className="hero-dot wait" />
            <span className="hero-dot skip" />
            <span className="hero-panel-label">Live scan · Reddit · Trends · Ads</span>
          </div>
          <div className="hero-verdict">
            <span className="hero-verdict-badge">Opportunity</span>
            <p>Launch carefully — strongest fit in United States</p>
          </div>
          <div className="hero-bars">
            <div className="hero-bar">
              <span>Demand</span>
              <i style={{ width: "86%" }} />
            </div>
            <div className="hero-bar">
              <span>Competition</span>
              <i style={{ width: "28%" }} />
            </div>
            <div className="hero-bar">
              <span>Trend</span>
              <i style={{ width: "74%" }} />
            </div>
          </div>
          <div className="scan-line" />
        </div>
        <div className="hero-map">
          <span className="map-pulse p1" />
          <span className="map-pulse p2" />
          <span className="map-pulse p3" />
        </div>
      </div>

      <div className="wrap hero-content">
        <p className="hero-brand" id="hero-brand">
          Nexora
        </p>
        <div className="hero-copy">
          <h1>
            Stop guessing.
            <br />
            Know if your product
            <br />
            will sell — before
            <br />
            you spend a rupee.
          </h1>
          <p className="hero-sub">
            Paste a product URL or description. Nexora synthesizes Reddit, Google
            Trends, Meta ads, and the wider web into one clear verdict you can verify.
          </p>
        </div>
        <div className="hero-cta">
          <Link className="btn btn-lg" href="/validate">
            Validate your first product free →
          </Link>
          <p className="hero-note">No credit card · 3 free lifetime validations</p>
        </div>
      </div>
    </section>
  );
}
