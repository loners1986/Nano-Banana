import Link from "next/link"

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
            <Link href="#generator" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Editor
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#showcase" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Showcase
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nano Banana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
