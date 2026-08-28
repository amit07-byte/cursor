import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import "./base.css";
import "./landing.css";
import "./app-ui.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nexora — Know before you sell",
  description:
    "AI product research for e-commerce sellers. Opportunity / Wait / Crowded verdicts backed by a transparent full report.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${figtree.variable}`} style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
