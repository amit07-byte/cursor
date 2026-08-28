import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";

export const metadata = {
  title: "Pricing · Nexora",
  description: "Free validations, concierge packs, and Pro plans for Nexora.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="app-page pricing-intro">
          <div className="wrap narrow">
            <p className="eyebrow">Payments</p>
            <h1 className="page-title">Pay only after free credits are gone</h1>
            <p className="page-sub">
              Checkout happens on PayPal / Payoneer hosted pages — Nexora never touches card
              numbers. Razorpay for India is planned later.
            </p>
            <p className="page-sub">
              After a successful payment webhook, credits are added to your email automatically.
              If a paid run fails, we restore the credit.
            </p>
            <Link className="btn" href="/validate">
              Still have free credits? Validate now →
            </Link>
          </div>
        </section>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
