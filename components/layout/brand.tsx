import Image from "next/image"
import Link from "next/link"

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-md font-semibold tracking-tight text-foreground ${className ?? ""}`}
    >
      <Image
        src="/favicon.png"
        alt=""
        width={28}
        height={28}
        className="size-7"
        priority
      />
      <span className="text-lg">Pathly</span>
    </Link>
  )
}
