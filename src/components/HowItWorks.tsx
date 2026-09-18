import { useReveal } from '../hooks/useReveal'

const steps = [
  {
    num: '01',
    title: 'Post or find a campaign',
    body: 'Businesses spell out the deliverable and offer. Creators browse nearby openings with distance and payout shown up front.',
  },
  {
    num: '02',
    title: 'Match on offer and fit',
    body: 'Creators apply with niche and past work. Businesses pick who to talk to — nothing is automatic.',
  },
  {
    num: '03',
    title: 'Hand off and get it done',
    body: 'Tap Message on WhatsApp. The brief is already locked, so you’re coordinating — not renegotiating.',
  },
]

export default function HowItWorks() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="how-it-works" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">How it works</p>
        <h2 className="section-title">Three steps. Then you’re off the app.</h2>
        <p className="section-lede">
          Pathly qualifies the match — right creator, right business, clear offer, agreed deliverable —
          and leaves the conversation where it already lives.
        </p>
        <div className="steps">
          {steps.map((step, i) => (
            <article
              key={step.num}
              className={`note step${i === 1 ? ' note--tilt-right' : i === 2 ? ' note--tilt-left' : ''}`}
            >
              <span className="pin" style={{ top: '-6px', left: `${28 + i * 12}%` }} />
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
