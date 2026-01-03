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
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/"

  if (!code) {
    return NextResponse.redirect(new URL("/", origin))
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(new URL(next, origin))
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
