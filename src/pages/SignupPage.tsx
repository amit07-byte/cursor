import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

type Role = 'business' | 'creator'

const copy: Record<
  Role,
  { title: string; lede: string; next: string; fields: { name: string; label: string; type: string; placeholder: string }[] }
> = {
  business: {
    title: 'Post your first campaign',
    lede: 'Tell us about your shop. You’ll set the deliverable and offer next — then nearby creators can apply.',
    next: 'Continue to campaign setup',
    fields: [
      { name: 'name', label: 'Your name', type: 'text', placeholder: 'Maya Chen' },
      { name: 'business', label: 'Business name', type: 'text', placeholder: 'Harbor Roasters' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'maya@harbor.coffee' },
      { name: 'city', label: 'City / neighborhood', type: 'text', placeholder: 'Brooklyn, NY' },
    ],
  },
  creator: {
    title: 'Browse campaigns near you',
    lede: 'Share your niche and neighborhood. We’ll show open campaigns sorted by distance, with the offer up front.',
    next: 'Continue to discovery',
    fields: [
      { name: 'name', label: 'Your name', type: 'text', placeholder: 'Jordan Lee' },
      { name: 'handle', label: 'Instagram handle', type: 'text', placeholder: '@jordan.eats' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'jordan@email.com' },
      { name: 'city', label: 'City / neighborhood', type: 'text', placeholder: 'Brooklyn, NY' },
      { name: 'niche', label: 'Niche', type: 'text', placeholder: 'Food, cafes, local finds' },
    ],
  },
}

export default function SignupPage({ role }: { role: Role }) {
  const [done, setDone] = useState(false)
  const content = copy[role]

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDone(true)
  }

  return (
    <div className="signup-page">
      <Navbar />
      <main className="signup-main">
        <div className="container">
          <div className="note signup-card">
            <span className="pin" style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
            <Link className="back-link" to="/">
              ← Back to Pathly
            </Link>
            <h1>{content.title}</h1>
            <p>{content.lede}</p>
            {done ? (
              <p className="form-success" role="status">
                You’re in. We’ll email next steps to finish {role === 'business' ? 'your first campaign' : 'setting up discovery'}.
              </p>
            ) : (
              <form className="signup-form" onSubmit={onSubmit}>
                {content.fields.map((field) => (
                  <div className="field" key={field.name}>
                    <label htmlFor={`${role}-${field.name}`}>{field.label}</label>
                    <input
                      id={`${role}-${field.name}`}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      autoComplete={field.name === 'email' ? 'email' : 'on'}
                    />
                  </div>
                ))}
                <button className="btn btn--forest" type="submit">
                  {content.next}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
