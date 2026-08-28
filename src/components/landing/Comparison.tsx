"use client";
import { useReveal } from "@/hooks/useReveal";
import { IconCheck, IconPartial, IconX } from "@/components/ui/Icons";

type Cell = "yes" | "no" | "partial" | string;

const rows: { feature: string; values: Cell[] }[] = [
  { feature: "Sources scanned", values: ["16", "3–4", "1", "4–5"] },
  { feature: "Community forum signals", values: ["yes", "no", "no", "no"] },
  { feature: "Plain-English verdict", values: ["yes", "no", "no", "no"] },
  { feature: "Geo demand map", values: ["yes", "no", "no", "no"] },
  { feature: "Supplier finder", values: ["yes", "partial", "no", "partial"] },
  { feature: "AI-generated ad copy", values: ["yes", "no", "no", "no"] },
  { feature: "Zero-results intelligence", values: ["yes", "no", "no", "no"] },
  { feature: "India-specific coverage", values: ["yes", "no", "no", "no"] },
  {
    feature: "Price",
    values: ["From $29/mo", "$49–399/mo", "$149/mo", "$39/mo"],
  },
];

function CellValue({ value }: { value: Cell }) {
  if (value === "yes")
    return (
      <span className="cell-yes" aria-label="Yes">
        <IconCheck />
      </span>
    );
  if (value === "no")
    return (
      <span className="cell-no" aria-label="No">
        <IconX />
      </span>
    );
  if (value === "partial")
    return (
      <span className="cell-partial" aria-label="Partial">
        <IconPartial />
        <span>Partial</span>
      </span>
    );
  return <span>{value}</span>;
}

export function Comparison() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section comparison" ref={ref}>
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Nexora vs the rest</span>
          <h2>
            Every other tool shows you data.
            <br />
            We show you what to do.
          </h2>
        </div>

        <div className="table-scroll reveal">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" className="col-nexora">
                  Nexora
                </th>
                <th scope="col">Competitor A</th>
                <th scope="col">Competitor B</th>
                <th scope="col">Competitor C</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  {row.values.map((v, i) => (
                    <td key={i} className={i === 0 ? "col-nexora" : undefined}>
                      <CellValue value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
