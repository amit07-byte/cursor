import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ValidateForm } from "@/components/validate/ValidateForm";

export const metadata = {
  title: "Validate a product · Nexora",
  description: "Submit a product URL or description for a free Nexora validation.",
};

export default function ValidatePage() {
  return (
    <>
      <Navbar />
      <main className="app-page">
        <div className="wrap narrow">
          <p className="eyebrow">Free validation</p>
          <h1 className="page-title">
            Paste a product.
            <br />
            Get a sourced verdict.
          </h1>
          <p className="page-sub">
            Email only — no card required. We’ll research Reddit, Trends, and ad activity, then
            return Opportunity / Wait / Crowded with a full report.
          </p>
          <ValidateForm />
          <p className="page-foot">
            Out of free credits?{" "}
            <Link className="link-quiet" href="/pricing">
              See pricing
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
