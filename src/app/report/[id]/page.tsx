import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ReportView } from "@/components/report/ReportView";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="app-page">
        <div className="wrap">
          <ReportView id={id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
