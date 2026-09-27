import { useReveal } from '../hooks/useReveal'

const steps = [
  {
    num: '01',
    title: 'Post or browse a campaign',
    body: 'Businesses spell out goal, niche, deliverable, budget, and deadline. Creators browse the open feed with filters.',
  },
  {
    num: '02',
    title: 'Join and connect',
    body: 'Creators hit Join on campaigns that fit. That creates a connection and opens an in-app chat with the business.',
  },
  {
    num: '03',
    title: 'Chat and close the deal',
    body: 'Negotiate rate, deliverables, timeline, and payment in Pathly chat. Close the deal outside the platform — no forced payments in v1.',
  },
]

export default function HowItWorks() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="how-it-works" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">How it works</p>
        <h2 className="section-title">Three steps to a real conversation.</h2>
        <p className="section-lede">
          Pathly is an open marketplace for brand work. Browse or post, join when it’s a fit, then take
          the deal into chat.
        </p>
        <div className="steps">
          {steps.map((step, i) => (
            <article
              key={step.num}
              className={`note step${i === 1 ? ' note--tilt-right' : i === 2 ? ' note--tilt-left' : ''}`}
            >
              {i === 1 ? <span className="tape tape--skew" /> : <span className="tape" />}
              <span
                className={`pin${i === 0 ? ' pin--brand' : i === 2 ? ' pin--alt' : ''}`}
                style={{ top: '-7px', left: `${28 + i * 12}%` }}
              />
              <div className="step__num">{step.num}</div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
