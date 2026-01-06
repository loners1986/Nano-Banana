import { z } from "zod"

export const billingCycleSchema = z.enum(["monthly", "yearly", "once"])
export type BillingCycle = z.infer<typeof billingCycleSchema>

export const checkoutPlanSchema = z.enum([
  "basic",
  "pro",
  "max",
  "starter_pack",
  "growth_pack",
  "professional_pack",
  "enterprise_pack",
])
export type CheckoutPlan = z.infer<typeof checkoutPlanSchema>

export function getCreemApiBaseUrl() {
  const apiKey = process.env.CREEM_API_KEY?.trim()
  const configured = process.env.CREEM_API_BASE_URL?.trim()

  const isTestKey = Boolean(apiKey && apiKey.startsWith("creem_test_"))
  const testBaseUrl = "https://test-api.creem.io"
  const prodBaseUrl = "https://api.creem.io"

  if (configured) {
    if (isTestKey && configured.includes("api.creem.io") && !configured.includes("test-api")) {
      return testBaseUrl
    }
    if (!isTestKey && configured.includes("test-api.creem.io")) {
      return prodBaseUrl
    }
    return configured
  }

  return isTestKey ? testBaseUrl : prodBaseUrl
}

export function requireCreemApiKey() {
  const key = process.env.CREEM_API_KEY?.trim()
  if (!key) throw new Error("Missing CREEM_API_KEY")
  return key
}

export function isCreemPaymentsEnabled() {
  return process.env.CREEM_ENABLE_PAYMENTS?.trim().toLowerCase() === "true"
}

export function getCreemWebhookSecret() {
  return (process.env.CREEM_WEBHOOK_SECRET ?? process.env["CREEM WEBHOOK SECRET"])?.trim() || null
}

export function requireCreemWebhookSecret() {
  const secret = getCreemWebhookSecret()
  if (!secret) throw new Error("Missing CREEM_WEBHOOK_SECRET")
  return secret
}

export function getCreemProductId(plan: CheckoutPlan, billingCycle: BillingCycle) {
  if (!isCreemPaymentsEnabled()) return null

  function normalize(value: string | undefined) {
    const trimmed = value?.trim()
    if (!trimmed) return null
    if (trimmed.includes("...")) return null
    // Common misconfigurations: webhook secrets or API keys pasted into product ID env vars.
    if (trimmed.startsWith("whsec_")) return null
    if (trimmed.startsWith("pwhsec_")) return null
    if (trimmed.startsWith("creem_")) return null
    if (trimmed.length < 10) return null
    return trimmed
  }

  if (billingCycle === "once") {
    if (plan === "starter_pack") return normalize(process.env.CREEM_CREDIT_PACK_STARTER_PRODUCT_ID)
    if (plan === "growth_pack") return normalize(process.env.CREEM_CREDIT_PACK_GROWTH_PRODUCT_ID)
    if (plan === "professional_pack") return normalize(process.env.CREEM_CREDIT_PACK_PROFESSIONAL_PRODUCT_ID)
    if (plan === "enterprise_pack") return normalize(process.env.CREEM_CREDIT_PACK_ENTERPRISE_PRODUCT_ID)
    return null
  }

  if (plan === "basic") {
    return normalize(
      billingCycle === "monthly" ? process.env.CREEM_BASIC_MONTHLY_PRODUCT_ID : process.env.CREEM_BASIC_YEARLY_PRODUCT_ID,
    )
  }
  if (plan === "pro") {
    return normalize(
      billingCycle === "monthly" ? process.env.CREEM_PRO_MONTHLY_PRODUCT_ID : process.env.CREEM_PRO_YEARLY_PRODUCT_ID,
    )
  }
  if (plan === "max") {
    return normalize(
      billingCycle === "monthly" ? process.env.CREEM_MAX_MONTHLY_PRODUCT_ID : process.env.CREEM_MAX_YEARLY_PRODUCT_ID,
    )
  }

  return null
}
