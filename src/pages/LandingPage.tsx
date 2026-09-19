import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ForBusinesses from '../components/ForBusinesses'
import ForCreators from '../components/ForCreators'
import WhyWhatsApp from '../components/WhyWhatsApp'
import SocialProof from '../components/SocialProof'
import FAQ from '../components/FAQ'
import ClosingCTA from '../components/ClosingCTA'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ForBusinesses />
        <ForCreators />
        <WhyWhatsApp />
        <SocialProof />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
