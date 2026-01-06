import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return response
  if (!isValidHttpUrl(supabaseUrl)) return response

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) => {
        if (init?.signal) return fetch(input, init)
        return fetch(input, { ...init, signal: AbortSignal.timeout(2_000) })
      },
    },
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  try {
    await supabase.auth.getUser()
  } catch {
    return response
  }
  return response
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$|manifest\\.json$|manifest\\.webmanifest$|site\\.webmanifest$|sw\\.js$|apple-touch-icon\\.png$|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|woff2?|ttf|otf|eot)$).*)",
  ],
}
