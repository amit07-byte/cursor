/** Waitlist delivery — FormSubmit emails you each signup. Override with VITE_WAITLIST_ENDPOINT if you switch to Formspree. */
export const WAITLIST_ENDPOINT =
  import.meta.env.VITE_WAITLIST_ENDPOINT?.trim() ||
  'https://formsubmit.co/ajax/amrai0583@gmail.com'

export type WaitlistPayload = {
  name: string
  email: string
}

export async function submitWaitlist({ name, email }: WaitlistPayload): Promise<void> {
  const res = await fetch(WAITLIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      _subject: 'Pathly — new waitlist signup',
      _template: 'table',
      _captcha: 'false',
      source: 'pathly-landing',
    }),
  })

  if (!res.ok) {
    let message = 'Could not join the waitlist. Please try again.'
    try {
      const data = (await res.json()) as { message?: string; error?: string }
      message = data.message || data.error || message
    } catch {
      // keep default message
    }
    throw new Error(message)
  }
}
