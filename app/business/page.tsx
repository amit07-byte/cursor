import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Business",
  description: "Business workspace for Pathly campaigns.",
}

export default function BusinessPage() {
  return (
    <main id="main">
      <Container className="py-12 sm:py-16">
        <p className="text-sm font-medium text-primary">Business</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your campaigns</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          This is where a business will post campaigns, read applications, and accept or decline
          creators.
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">No campaigns yet</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <p className="leading-6 text-muted-foreground">
              Campaign posting is not available in this foundation step.
            </p>
            <Link
              href="/signup?role=business"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              I&apos;m a Business
            </Link>
          </CardContent>
        </Card>
      </Container>
    </main>
  )
}
