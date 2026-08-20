import { useReveal } from "../hooks/useReveal";

export function FinalCTA() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="final-cta" id="final-cta" ref={ref}>
      <div className="wrap final-inner reveal">
        <span className="eyebrow">Start today</span>
        <h2>
          Your next winning product
          <br />
          is one validation away.
        </h2>
        <p>
          Join 500+ e-commerce sellers who stopped guessing and started knowing.
          First 10 validations are free. No credit card needed.
        </p>
        <a className="btn btn-lg" href="#pricing">
          Validate your first product free →
        </a>
        <p className="final-note">Takes 40 seconds · No credit card · Cancel anytime</p>
      </div>
    </section>
  );
}
