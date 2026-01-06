import { NextResponse } from "next/server"
import { z } from "zod"

import { getBaseUrl } from "@/lib/get-base-url"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  billingCycleSchema,
  checkoutPlanSchema,
  getCreemApiBaseUrl,
  getCreemProductId,
  isCreemPaymentsEnabled,
  requireCreemApiKey,
} from "@/lib/creem"

export const runtime = "nodejs"

const checkoutRequestSchema = z.object({
  plan: checkoutPlanSchema,
  billingCycle: billingCycleSchema,
  units: z.number().int().positive().max(1000).optional(),
})

type CreateCheckoutResponse = {
  checkout_url?: string
}

export async function POST(req: Request) {
  const origin = getBaseUrl(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = checkoutRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request.", detail: parsed.error.flatten() }, { status: 400 })
  }

  const { plan, billingCycle, units } = parsed.data

  if (!isCreemPaymentsEnabled()) {
    return NextResponse.json(
      { error: "Payments are disabled.", hint: "Set CREEM_ENABLE_PAYMENTS=true to enable Creem checkouts." },
      { status: 501 },
    )
  }

  const productId = getCreemProductId(plan, billingCycle)
  if (!productId) {
    return NextResponse.json(
      {
        error: "Missing Creem product ID for this plan.",
        hint: `Set the appropriate CREEM_*_PRODUCT_ID env var for plan=${plan} billingCycle=${billingCycle}.`,
      },
      { status: 500 },
    )
  }

  let customerEmail: string | null = null
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    customerEmail = user?.email ?? null
  } catch {
    // ignore
  }

  let apiKey: string
  try {
    apiKey = requireCreemApiKey()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Missing CREEM_API_KEY" }, { status: 500 })
  }

  const requestId = crypto.randomUUID()
  const baseUrl = getCreemApiBaseUrl()

  const successUrl = new URL("/pricing/success", origin)
  successUrl.searchParams.set("plan", plan)

  const payload = {
    product_id: productId,
    request_id: requestId,
    units: units ?? 1,
    success_url: successUrl.toString(),
    metadata: {
      plan,
      billingCycle,
      origin,
    },
    ...(customerEmail ? { customer: { email: customerEmail } } : {}),
  }

  let creemRes: Response
  try {
    creemRes = await fetch(`${baseUrl}/v1/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    })
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to reach Creem API.", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    )
  }

  if (!creemRes.ok) {
    const text = await creemRes.text().catch(() => "")
    const baseUrlHint =
      creemRes.status === 403
        ? "If you are using a test key (creem_test_*), set CREEM_API_BASE_URL=https://test-api.creem.io (or leave it unset). Also ensure product_id values match the same Creem environment."
        : undefined
    const notFoundHint =
      creemRes.status === 404
        ? "Creem returned Product not found. This almost always means the CREEM_*_PRODUCT_ID values are from a different Creem environment than your CREEM_API_KEY (test vs live), the ID is wrong, or you've accidentally pasted a webhook secret (whsec_*) into a product ID env var."
        : undefined

    return NextResponse.json(
      {
        error: `Creem API error: ${creemRes.status}`,
        detail: text,
        hint: baseUrlHint ?? notFoundHint,
        debug: {
          creemApiBaseUrl: baseUrl,
          productId,
          plan,
          billingCycle,
        },
      },
      { status: 502 },
    )
  }

  const data = (await creemRes.json().catch(() => ({}))) as CreateCheckoutResponse
  if (!data.checkout_url) {
    return NextResponse.json({ error: "Creem response missing checkout_url." }, { status: 502 })
  }

  return NextResponse.json({ checkoutUrl: data.checkout_url })
}
