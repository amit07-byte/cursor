"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Brand } from "./brand"
import { Container } from "./container"

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#businesses", label: "Businesses" },
  { href: "/#creators", label: "Creators" },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Brand />
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-10 px-3")}
            aria-current={pathname === "/login" ? "page" : undefined}
            onClick={closeMenu}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
            aria-current={pathname === "/signup" ? "page" : undefined}
            onClick={closeMenu}
          >
            Sign up
          </Link>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </Container>
      {open ? (
        <div id="mobile-navigation" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <nav aria-label="Mobile" className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-3 text-sm font-medium hover:bg-muted"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11")}
                onClick={closeMenu}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "lg" }), "h-11")}
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
