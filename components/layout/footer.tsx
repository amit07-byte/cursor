import { Container } from "./container"

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#businesses", label: "Businesses" },
  { href: "/#creators", label: "Creators" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Sign up" },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold tracking-tight">Pathly</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A marketplace where local businesses post creator campaigns and creators apply.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
      <Container className="border-t border-border py-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Pathly</p>
      </Container>
    </footer>
  )
}
