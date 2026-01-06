import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getBaseUrl } from "@/lib/get-base-url"

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
