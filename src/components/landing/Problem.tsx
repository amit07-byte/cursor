"use client";
import { useReveal } from "@/hooks/useReveal";
import { IconBoxes, IconClock, IconMoney } from "@/components/ui/Icons";

const problems = [
  {
    icon: IconMoney,
    title: "Wasted ad spend",
    body: "You run $200 in paid ads on a product that was already dead. No data told you the trend peaked 6 months ago.",
  },
  {
    icon: IconBoxes,
    title: "Dead inventory",
    body: "You order 100 units of a product that has 4,000 sellers already competing in the same marketplace. You can't move it at any price.",
  },
  {
    icon: IconClock,
    title: "Months lost",
    body: "You spend 8 weeks building a store around a product nobody is searching for. You find out when the sales don't come.",
  },
];

export function Problem() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section problem" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">The real cost of guessing</span>
          <h2>Most sellers lose money on their first 3 products.</h2>
          <p>
            Not because they picked bad ideas. Because they had no way to know
            what was actually working — until they'd already paid for stock,
            ads, and shipping.
          </p>
        </div>

        <div className="problem-grid">
          {problems.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className={`problem-item reveal reveal-delay-${i + 1}`}
              >
                <Icon className="problem-icon" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
