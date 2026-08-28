import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Verdict } from "@/components/landing/Verdict";
import { Platforms } from "@/components/landing/Platforms";
import { GeoDemand } from "@/components/landing/GeoDemand";
import { WinItNextSteps } from "@/components/landing/WinItNextSteps";
import { ZeroResults } from "@/components/landing/ZeroResults";
import { Features } from "@/components/landing/Features";
import { Comparison } from "@/components/landing/Comparison";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Verdict />
        <Platforms />
        <GeoDemand />
        <WinItNextSteps />
        <ZeroResults />
        <Features />
        <Comparison />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
