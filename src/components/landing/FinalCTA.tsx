"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

export function FinalCTA() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="final-cta" id="final-cta" ref={ref}>
      <div className="wrap final-inner reveal">
        <span className="eyebrow">Start today</span>
        <h2>
          Your next launch decision
          <br />
          is one validation away.
        </h2>
        <p>
          Built for sellers about to spend on ads. Get a sourced verdict in minutes —
          not weeks of manual Reddit and Trends tab-hopping.
        </p>
        <Link className="btn btn-lg" href="/validate">
          Validate your first product free →
        </Link>
        <p className="final-note">About a minute · No credit card · 3 free validations</p>
      </div>
    </section>
  );
}
