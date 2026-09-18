import { useReveal } from '../hooks/useReveal'

const faqs = [
  {
    q: 'Is this free? Who pays for what?',
    a: 'Signing up and browsing is free. The offer on each campaign — cash, product, or both — is what the business pays the creator. Pathly may introduce optional paid tiers for businesses later; pricing won’t hide behind the match.',
  },
  {
    q: 'What happens if a creator doesn’t deliver?',
    a: 'The deliverable is agreed before WhatsApp. If something falls through, you close the campaign and pick another applicant — Pathly doesn’t auto-assign or hold funds in escrow at launch.',
  },
  {
    q: 'Do I need a business Instagram to post a campaign?',
    a: 'No. You need a way for creators to understand the shop and for the WhatsApp handoff to happen. An Instagram presence helps applicants evaluate fit, but it isn’t required to post.',
  },
  {
    q: 'What cities is this live in?',
    a: 'We’re launching neighborhood by neighborhood, starting with select NYC areas. If you’re elsewhere, join the waitlist with your city and role — we’ll open access as coverage expands.',
  },
]

export default function FAQ() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="faq" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">FAQ</p>
        <h2 className="section-title">Straight answers</h2>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
