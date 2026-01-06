import Link from "next/link"
import { SUPPORT_EMAIL } from "@/lib/site"

export function Footer() {
  return (
    <footer className="border-t border-banana-200/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍌</span>
            <span className="text-lg font-bold text-foreground">Nano Banana</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/#generator" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Editor
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>

          <div className="space-y-1 text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Support:{" "}
              <a className="underline underline-offset-2" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Nano Banana. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
