import { NextResponse } from "next/server"

import { getCreemProductId, isCreemPaymentsEnabled, requireCreemApiKey, requireCreemWebhookSecret } from "@/lib/creem"

export const runtime = "nodejs"

export async function GET() {
  const missing: string[] = []

  try {
    requireCreemApiKey()
  } catch {
    missing.push("CREEM_API_KEY")
  }

  try {
    requireCreemWebhookSecret()
  } catch {
    missing.push("CREEM_WEBHOOK_SECRET")
  }

  const paymentsEnabled = isCreemPaymentsEnabled()

  const basicMonthly = getCreemProductId("basic", "monthly")
  const basicYearly = getCreemProductId("basic", "yearly")
  const proMonthly = getCreemProductId("pro", "monthly")
  const proYearly = getCreemProductId("pro", "yearly")
  const maxMonthly = getCreemProductId("max", "monthly")
  const maxYearly = getCreemProductId("max", "yearly")

  if (paymentsEnabled) {
    if (!basicMonthly) missing.push("CREEM_BASIC_MONTHLY_PRODUCT_ID")
    if (!basicYearly) missing.push("CREEM_BASIC_YEARLY_PRODUCT_ID")
    if (!proMonthly) missing.push("CREEM_PRO_MONTHLY_PRODUCT_ID")
    if (!proYearly) missing.push("CREEM_PRO_YEARLY_PRODUCT_ID")
    if (!maxMonthly) missing.push("CREEM_MAX_MONTHLY_PRODUCT_ID")
    if (!maxYearly) missing.push("CREEM_MAX_YEARLY_PRODUCT_ID")
  }

  const starterPack = getCreemProductId("starter_pack", "once")
  const growthPack = getCreemProductId("growth_pack", "once")
  const professionalPack = getCreemProductId("professional_pack", "once")
  const enterprisePack = getCreemProductId("enterprise_pack", "once")

  const packs = {
    starter_pack: paymentsEnabled && Boolean(starterPack),
    growth_pack: paymentsEnabled && Boolean(growthPack),
    professional_pack: paymentsEnabled && Boolean(professionalPack),
    enterprise_pack: paymentsEnabled && Boolean(enterprisePack),
  }

  if (paymentsEnabled) {
    if (!starterPack) missing.push("CREEM_CREDIT_PACK_STARTER_PRODUCT_ID")
    if (!growthPack) missing.push("CREEM_CREDIT_PACK_GROWTH_PRODUCT_ID")
    if (!professionalPack) missing.push("CREEM_CREDIT_PACK_PROFESSIONAL_PRODUCT_ID")
    if (!enterprisePack) missing.push("CREEM_CREDIT_PACK_ENTERPRISE_PRODUCT_ID")
  }

  return NextResponse.json({
    ready: missing.length === 0,
    missing,
    plans: {
      basic: { monthly: paymentsEnabled && Boolean(basicMonthly), yearly: paymentsEnabled && Boolean(basicYearly) },
      pro: { monthly: paymentsEnabled && Boolean(proMonthly), yearly: paymentsEnabled && Boolean(proYearly) },
      max: { monthly: paymentsEnabled && Boolean(maxMonthly), yearly: paymentsEnabled && Boolean(maxYearly) },
    },
    packs,
  })
}
