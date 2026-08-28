import Link from "next/link";
import { getRequest } from "@/lib/store";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { RequestStatusClient } from "@/components/validate/RequestStatusClient";

export const dynamic = "force-dynamic";

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) {
    return (
      <>
        <Navbar />
        <main className="app-page">
          <div className="wrap narrow status-panel">
            <h1>Request not found</h1>
            <p>This validation link may be invalid or expired.</p>
            <Link className="btn" href="/validate">
              Start a new validation
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const initial = {
    id: request.id,
    status: request.status,
    errorMessage: request.errorMessage,
    productUrl: request.productUrl,
    productDescription: request.productDescription,
    verdict: request.report
      ? {
          label: request.report.verdict,
          confidence: request.report.confidence,
          confidenceScore: request.report.confidenceScore,
          bestFitMarket: request.report.bestFitMarket,
          summary: request.report.summary,
        }
      : null,
  };

  return (
    <>
      <Navbar />
      <main className="app-page">
        <div className="wrap narrow">
          <RequestStatusClient id={id} initial={initial} />
        </div>
      </main>
      <Footer />
    </>
  );
}
