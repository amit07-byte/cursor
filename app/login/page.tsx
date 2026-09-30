import type { Metadata } from "next"
import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Pathly.",
}

export default function LoginPage() {
  return (
    <main id="main">
      <AuthShell
        title="Log in"
        description="Use the email and password for your Pathly account."
        footer={
          <p>
            New to Pathly?{" "}
            <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
              Create an account
            </Link>
          </p>
        }
      >
        <form className="flex flex-col gap-4" aria-describedby="login-note">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11"
            />
          </div>
          <Button type="submit" size="lg" className="h-11" disabled>
            Log in
          </Button>
          <p id="login-note" className="text-sm leading-6 text-muted-foreground">
            Sign-in is not connected yet. This screen is ready for Supabase Auth in the next step.
          </p>
        </form>
      </AuthShell>
    </main>
  )
}
