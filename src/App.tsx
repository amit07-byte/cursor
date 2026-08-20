import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { Solution } from "./components/Solution";
import { Verdict } from "./components/Verdict";
import { Platforms } from "./components/Platforms";
import { GeoDemand } from "./components/GeoDemand";
import { WinItNextSteps } from "./components/WinItNextSteps";
import { ZeroResults } from "./components/ZeroResults";
import { Features } from "./components/Features";
import { Comparison } from "./components/Comparison";
import { Pricing } from "./components/Pricing";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import "./App.css";

function TrustBand() {
  return (
    <div className="trust-band">
      <div className="wrap">
        <p>Trusted by 500+ dropshippers and e-commerce sellers</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBand />
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
