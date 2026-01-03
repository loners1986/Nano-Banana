import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const origin = url.origin
  const next = url.searchParams.get("next") || "/"

  try {
    const supabase = createSupabaseServerClient()
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

