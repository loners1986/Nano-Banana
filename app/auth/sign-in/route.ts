import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function getBaseUrl(req: Request) {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (configured) {
    try {
      const url = new URL(configured)
      if (url.protocol === "http:" || url.protocol === "https:") return url.origin
    } catch {
      // ignore
    }
  }

  const forwardedProto = req.headers.get("x-forwarded-proto")
  const forwardedHost = req.headers.get("x-forwarded-host")
  const host = forwardedHost || req.headers.get("host")
  const proto = forwardedProto || "http"
  if (host) return `${proto}://${host}`

  return new URL(req.url).origin
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const origin = getBaseUrl(req)
  const next = url.searchParams.get("next") || "/"

  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data?.url) {
      return NextResponse.json({ error: "Missing OAuth URL" }, { status: 500 })
    }

    return NextResponse.redirect(data.url)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
