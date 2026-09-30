import type { Metadata } from "next"
import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, parseUserRole, type UserRole } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Pathly business or creator account.",
}

const roleCopy: Record<UserRole, { label: string; description: string }> = {
  BUSINESS: {
    label: "Business",
    description: "You will post campaigns and review creator applications.",
  },
  CREATOR: {
    label: "Creator",
    description: "You will browse published campaigns and apply.",
  },
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const role = parseUserRole((await searchParams).role)

  return (
    <main id="main">
      <AuthShell
        title="Create an account"
        description={
          role
            ? `Signing up as a ${roleCopy[role].label.toLowerCase()}.`
            : "Choose a role. A person has one role: business or creator."
        }
        footer={
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        }
      >
        {role ? <SignupForm role={role} /> : <RoleChooser />}
      </AuthShell>
    </main>
  )
}

function RoleChooser() {
  return (
    <div className="grid gap-3">
      <Link
        href="/signup?role=business"
        className={cn(buttonVariants({ size: "lg" }), "h-11")}
      >
        I&apos;m a Business
      </Link>
      <Link
        href="/signup?role=creator"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11")}
      >
        I&apos;m a Creator
      </Link>
    </div>
  )
}

function SignupForm({ role }: { role: UserRole }) {
  const copy = roleCopy[role]

  return (
    <form className="flex flex-col gap-4" aria-describedby="signup-note">
      <p className="rounded-lg bg-muted px-3 py-3 text-sm leading-6">
        <span className="font-medium text-foreground">{copy.label}.</span> {copy.description}{" "}
        <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
          Change role
        </Link>
      </p>
      <div className="flex flex-col gap-2">
        <Label htmlFor="display-name">Name</Label>
        <Input id="display-name" name="displayName" autoComplete="name" required className="h-11" />
      </div>
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
          autoComplete="new-password"
          required
          className="h-11"
        />
      </div>
      <input type="hidden" name="role" value={role} />
      <Button type="submit" size="lg" className="h-11" disabled>
        Create {copy.label.toLowerCase()} account
      </Button>
      <p id="signup-note" className="text-sm leading-6 text-muted-foreground">
        Account creation is not connected yet. This screen is ready for Supabase Auth in the next
        step.
      </p>
    </form>
  )
}
