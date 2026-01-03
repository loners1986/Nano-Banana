import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function requireEnv(name: "SUPABASE_URL" | "SUPABASE_ANON_KEY"): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function createFetchWithTimeout(timeoutMs: number): typeof fetch {
  return (input, init) => {
    if (init?.signal) return fetch(input, init)
    return fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) })
  }
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_ANON_KEY"), {
    global: {
      fetch: createFetchWithTimeout(10_000),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })
}
