import { useReveal } from '../hooks/useReveal'

const examples = [
  {
    biz: 'Harbor Roasters',
    cat: 'Cafe',
    got: 'Morning-rush reel + Stories pack from a neighborhood food creator.',
    quote: '“Applicants with real work — not another stranger in my DMs.”',
    who: '— Maya, owner',
  },
  {
    biz: 'Cut & Co.',
    cat: 'Salon',
    got: 'Weekend photo set for a new color menu, handed off on WhatsApp same day.',
    quote: '“Clear offer up front. I knew what I was shooting before I said yes.”',
    who: '— Priya, creator',
  },
  {
    biz: 'Northside Books',
    cat: 'Retail',
    got: 'Two shelf-tour posts and a soft launch mention from a local reader.',
    quote: '“Felt like a bulletin board, not a marketplace pitch.”',
    who: '— Sam, manager',
  },
]

export default function SocialProof() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="proof" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">Early neighborhood</p>
        <h2 className="section-title">Representative matches</h2>
        <p className="section-lede">
          Pre-launch examples of the kind of work Pathly is built for — real shops, local creators, clear
          handoffs.
        </p>
        <div className="proof-grid">
          {examples.map((ex, i) => (
            <article
              key={ex.biz}
              className={`note${i === 1 ? ' note--tilt-left' : i === 2 ? ' note--tilt-right' : ''}`}
            >
              <span
                className={`pin${i === 1 ? ' pin--alt' : ''}`}
                style={{ top: '-6px', left: `${30 + i * 10}%` }}
              />
              <div className="proof-card__biz">{ex.biz}</div>
              <div className="proof-card__cat">{ex.cat}</div>
              <p className="proof-card__got">{ex.got}</p>
              <p className="proof-card__quote">
                {ex.quote} <span style={{ fontSize: '1.05rem', color: 'var(--ink-muted)' }}>{ex.who}</span>
              </p>
            </article>
          ))}
        </div>

        <aside className="note founder-note note--tilt-left">
          <span className="pin" style={{ top: '-6px', left: '12%' }} />
          <p className="section-kicker">Founder note</p>
          <h3 className="campaign-card__title" style={{ fontSize: '1.75rem' }}>
            Why we’re building this
          </h3>
          <p>
            Local businesses need content. Creators need real briefs nearby. Both already talk on WhatsApp.
            Pathly is the introduction — a neighborhood board, not another feed to babysit. Pick a path
            above when you’re ready to post or apply.
          </p>
        </aside>
      </div>
    </section>
  )
}
