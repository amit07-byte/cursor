import Link from "next/link"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Post a campaign",
    body: "A business describes the work, the city, and the deadline.",
  },
  {
    title: "Creators apply",
    body: "Creators browse published campaigns and send an application.",
  },
  {
    title: "Choose a creator",
    body: "The business reviews applications and accepts or declines.",
  },
]

const businessBenefits = [
  "Post a campaign when you need a creator.",
  "Review applications in one place.",
  "Accept or decline each creator yourself.",
]

const creatorBenefits = [
  "Browse campaigns from local businesses.",
  "Apply to work that fits your niche and city.",
  "See whether an application is pending, accepted, or declined.",
]

export default function HomePage() {
  return (
    <main id="main">
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-medium text-primary">Local campaigns</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Local businesses. Local creators.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Pathly is where a business posts a creator campaign and creators apply. The business
            reviews each application and decides who to work with.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup?role=business"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              I&apos;m a Business
            </Link>
            <Link
              href="/signup?role=creator"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              I&apos;m a Creator
            </Link>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-20" aria-labelledby="how-it-works-heading">
        <Container className="py-16 sm:py-24">
          <h2 id="how-it-works-heading" className="text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Three steps. No automatic matching. The business makes the choice.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full">
                  <CardHeader>
                    <p className="text-sm font-medium text-primary">0{index + 1}</p>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-6 text-muted-foreground">{step.body}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="businesses" className="scroll-mt-20 border-t border-border" aria-labelledby="businesses-heading">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">For businesses</p>
            <h2 id="businesses-heading" className="mt-3 text-3xl font-semibold tracking-tight">
              Post the work. Review who applies.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Describe the campaign, then read applications from creators who want the work. You
              accept or decline. Nothing is assigned for you.
            </p>
            <Link
              href="/signup?role=business"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 px-5")}
            >
              I&apos;m a Business
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What you can do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {businessBenefits.map((benefit) => (
                  <li key={benefit} className="leading-6">
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section id="creators" className="scroll-mt-20 border-t border-border" aria-labelledby="creators-heading">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">For creators</p>
            <h2 id="creators-heading" className="mt-3 text-3xl font-semibold tracking-tight">
              Find a campaign. Apply when it fits.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Browse published campaigns from businesses in your city and niche. Apply to the ones
              you want, then wait for the business to respond.
            </p>
            <Link
              href="/signup?role=creator"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 px-5")}
            >
              I&apos;m a Creator
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What you can do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {creatorBenefits.map((benefit) => (
                  <li key={benefit} className="leading-6">
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Container>
      </section>
    </main>
  )
}
