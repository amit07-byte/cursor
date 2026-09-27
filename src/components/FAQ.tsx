import { useReveal } from '../hooks/useReveal'

const faqs = [
  {
    q: 'Is this free? Who pays for what?',
    a: 'Signing up, posting, browsing, and chatting are free in the MVP. The budget on each campaign is what the business intends to pay the creator — negotiated and paid off-platform.',
  },
  {
    q: 'Does Pathly handle payments?',
    a: 'Not in v1. There is no escrow or payout tracking. You negotiate and pay on your own terms after connecting in chat.',
  },
  {
    q: 'What happens after a creator joins?',
    a: 'Pathly creates a connection and opens an in-app chat between that creator and the business. From there you talk deliverables, rate, and timeline.',
  },
  {
    q: 'How do you handle spam or bad actors?',
    a: 'Report or block from chat. Admins can view users and campaigns and remove accounts. Terms acceptance is required at sign-up.',
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
