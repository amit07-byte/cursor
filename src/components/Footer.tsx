const columns = [
  {
    title: "Product",
    links: [
      { href: "#how-it-works", label: "How it works" },
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Blog" },
      { href: "#", label: "Contact" },
      { href: "#", label: "Careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Terms of Service" },
      { href: "#", label: "Refund Policy" },
      { href: "#", label: "Security" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <a href="#top" className="nav-logo">
            Nexora
          </a>
          <p>Nexora — Know before you sell.</p>
        </div>

        <div className="footer-cols">
          {columns.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p>© 2025 Nexora. All rights reserved.</p>
        <p>Built for e-commerce sellers worldwide.</p>
      </div>
    </footer>
  );
}
