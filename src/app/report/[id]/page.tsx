import Link from "next/link";
import { getRequest } from "@/lib/store";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ReportView } from "@/components/report/ReportView";

export const dynamic = "force-dynamic";

export default async function ReportPage({
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
          <div className="wrap report-shell">
            <h1>Report unavailable</h1>
            <p>This report link may be invalid or expired.</p>
            <Link className="btn" href="/validate">
              Start a new validation
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (request.status === "pending") {
    return (
      <>
        <Navbar />
        <main className="app-page">
          <div className="wrap report-shell">
            <p className="eyebrow">Full report</p>
            <h1>Still researching…</h1>
            <p className="lead">Your full report will appear when the Quick Verdict is ready.</p>
            <Link className="btn" href={`/request/${id}`}>
              Back to status →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (request.status === "failed" || !request.report) {
    return (
      <>
        <Navbar />
        <main className="app-page">
          <div className="wrap report-shell">
            <h1>Report unavailable</h1>
            <p>
              {request.errorMessage ||
                "Research failed before a report could be generated. Your credit was restored."}
            </p>
            <Link className="btn" href="/validate">
              Resubmit at no cost →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="app-page">
        <div className="wrap">
          <ReportView
            id={id}
            initial={{
              id: request.id,
              productUrl: request.productUrl,
              productDescription: request.productDescription,
              report: request.report,
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
