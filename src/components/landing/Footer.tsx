import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/validate", label: "Validate a product" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "mailto:amrai0583@gmail.com", label: "Contact" },
      { href: "/#verdicts", label: "Verdicts" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/pricing", label: "Payments" },
      { href: "/#faq", label: "Security" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <Link href="/" className="nav-logo">
            Nexora
          </Link>
          <p>Nexora — Know before you sell.</p>
        </div>

        <div className="footer-cols">
          {columns.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p>© {new Date().getFullYear()} Nexora. All rights reserved.</p>
        <p>Built for e-commerce sellers and dropshippers.</p>
      </div>
    </footer>
  );
}
