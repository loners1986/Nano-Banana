import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function Header() {
  let user: { email?: string | null } | null = null
  let authConfigured = true

  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()
    user = supabaseUser
  } catch {
    authConfigured = false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-banana-200/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold text-foreground">Nano Banana</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-banana-100 px-3 py-1 text-xs font-medium text-banana-700 sm:block">
            🍌 Pro is now live
          </div>
          {!authConfigured ? (
            <Button variant="outline" disabled>
              Auth not configured
            </Button>
          ) : user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
              <form action="/auth/sign-out" method="post">
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Button asChild className="bg-banana-400 text-banana-900 hover:bg-banana-500">
              <a href="/auth/sign-in">Sign in with Google</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
