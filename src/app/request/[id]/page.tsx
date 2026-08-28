import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { RequestStatusView } from "@/components/validate/RequestStatusView";

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="app-page">
        <div className="wrap narrow">
          <RequestStatusView id={id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
