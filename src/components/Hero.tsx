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
            <span className="hero-panel-label">Live scan · 16 sources</span>
          </div>
          <div className="hero-verdict">
            <span className="hero-verdict-badge">Win it</span>
            <p>Launch now — demand rising in USA &amp; Brazil</p>
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
            We do the product research for you — so you always know whether to
            launch, wait, or skip before spending a single rupee.
          </p>
        </div>
        <div className="hero-cta">
          <a className="btn btn-lg" href="#pricing">
            Validate your first product free →
          </a>
          <p className="hero-note">No credit card required · 10 free validations</p>
        </div>
      </div>
    </section>
  );
}
