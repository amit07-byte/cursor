import { useReveal } from '../hooks/useReveal'

const examples = [
  {
    biz: 'Harbor Roasters',
    cat: 'Cafe',
    got: 'Morning-rush reel from a food creator who joined the campaign and opened chat the same day.',
    quote: '“Joins with real profiles — not another stranger in my DMs.”',
    who: '— Maya, owner',
  },
  {
    biz: 'Cut & Co.',
    cat: 'Salon',
    got: 'Weekend photo set for a new color menu, negotiated in Pathly chat.',
    quote: '“Clear budget up front. I knew what I was shooting before I said yes.”',
    who: '— Priya, creator',
  },
  {
    biz: 'Northside Fitness',
    cat: 'Gym',
    got: 'Story set covering free trial week — creator joined from the open feed.',
    quote: '“Felt like a bulletin board, not a marketplace pitch.”',
    who: '— Leo, manager',
  },
]

export default function SocialProof() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="proof" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">Early signal</p>
        <h2 className="section-title">Representative matches</h2>
        <p className="section-lede">
          The kind of work Pathly is built for — real businesses, real creators, a chat that gets the deal
          started.
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
                {ex.quote}{' '}
                <span style={{ fontSize: '1.05rem', color: 'var(--ink-muted)' }}>{ex.who}</span>
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
            Businesses need creators. Creators need paid brand work. Agencies are expensive and cold DMs
            don’t scale. Pathly is the open board in the middle — post, join, chat, then close the deal on
            your own terms.
          </p>
        </aside>
      </div>
    </section>
  )
}
