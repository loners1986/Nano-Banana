import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getBaseUrl } from "@/lib/get-base-url"

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
