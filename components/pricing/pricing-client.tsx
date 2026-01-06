"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Sparkles, Zap } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SUPPORT_EMAIL } from "@/lib/site"
import { cn } from "@/lib/utils"

type BillingCycle = "monthly" | "yearly" | "once"
type CheckoutPlan = "basic" | "pro" | "max" | "starter_pack" | "growth_pack" | "professional_pack" | "enterprise_pack"

const PLANS: Array<{
  key: "basic" | "pro" | "max"
  name: string
  description: string
  highlighted?: boolean
  icon: React.ReactNode
  monthlyCredits: number
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
}> = [
  {
    key: "basic",
    name: "Basic",
    description: "For casual editing and exploring.",
    icon: <Sparkles className="h-6 w-6 text-banana-600" />,
    monthlyCredits: 200,
    monthlyPrice: 15,
    yearlyPrice: 144,
    features: ["200 credits / month", "All styles", "Standard speed", "JPG & PNG exports", "Basic support"],
  },
  {
    key: "pro",
    name: "Pro",
    description: "Great for creators shipping daily.",
    highlighted: true,
    icon: <Zap className="h-6 w-6 text-banana-700" />,
    monthlyCredits: 800,
    monthlyPrice: 39,
    yearlyPrice: 234,
    features: [
      "800 credits / month",
      "Priority speed",
      "Batch generation",
      "Image editing",
      "JPG, PNG & WebP exports",
      "Priority support",
    ],
  },
  {
    key: "max",
    name: "Max",
    description: "For teams and high volume workflows.",
    icon: <Sparkles className="h-6 w-6 text-banana-800" />,
    monthlyCredits: 3600,
    monthlyPrice: 160,
    yearlyPrice: 960,
    features: [
      "3600 credits / month",
      "Fastest speed",
      "API access",
      "Custom training",
      "Batch generation & editing",
      "Dedicated support",
    ],
  },
]

const CREDIT_PACKS: Array<{
  key: "starter_pack" | "growth_pack" | "professional_pack" | "enterprise_pack"
  name: string
  credits: number
  price: number
  features: string[]
}> = [
  {
    key: "starter_pack",
    name: "Starter Pack",
    credits: 500,
    price: 30,
    features: ["No expiry", "Instant delivery", "All features unlocked"],
  },
  {
    key: "growth_pack",
    name: "Growth Pack",
    credits: 1500,
    price: 80,
    features: ["No expiry", "Instant delivery", "All features unlocked", "Priority support"],
  },
  {
    key: "professional_pack",
    name: "Professional Pack",
    credits: 3600,
    price: 200,
    features: ["No expiry", "Instant delivery", "All features unlocked", "Priority support", "Batch processing"],
  },
  {
    key: "enterprise_pack",
    name: "Enterprise Pack",
    credits: 15000,
    price: 800,
    features: ["No expiry", "Instant delivery", "All features unlocked", "Dedicated support", "API access"],
  },
]

async function createCheckoutSession(params: { plan: CheckoutPlan; billingCycle: BillingCycle; units?: number }) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })

  const data = (await res.json().catch(() => ({}))) as { checkoutUrl?: string; error?: string; hint?: string }

  if (!res.ok) {
    throw new Error([data.error || "Failed to create checkout session.", data.hint].filter(Boolean).join("\n\n"))
  }
  if (!data.checkoutUrl) {
    throw new Error("Checkout URL is missing.")
  }
  return data.checkoutUrl
}

export function PricingClient() {
  const [billingCycle, setBillingCycle] = React.useState<Exclude<BillingCycle, "once">>("yearly")
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null)
  const [config, setConfig] = React.useState<{
    ready: boolean
    missing: string[]
    plans: Record<"basic" | "pro" | "max", Record<Exclude<BillingCycle, "once">, boolean>>
    packs: Record<Exclude<CheckoutPlan, "basic" | "pro" | "max">, boolean>
  } | null>(null)

  const missingConfigMessage = React.useMemo(() => {
    if (!config || config.ready) return null
    return `Creem is not configured yet.\n\nMissing env vars in .env.local:\n- ${config.missing.join("\n- ")}\n\nAfter updating, restart \`pnpm dev\`.`
  }, [config])

  const paymentsEnabled = React.useMemo(() => {
    if (!config) return false
    const hasAnyPlan = Object.values(config.plans).some((cycles) => Object.values(cycles).some(Boolean))
    const hasAnyPack = Object.values(config.packs).some(Boolean)
    return hasAnyPlan || hasAnyPack
  }, [config])

  React.useEffect(() => {
    let cancelled = false
    fetch("/api/checkout/config")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        setConfig(json)
      })
      .catch(() => {
        if (cancelled) return
        setConfig(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function onMissingConfig() {
    if (missingConfigMessage) alert(missingConfigMessage)
  }

  function onPaymentsDisabled() {
    alert("Payments are not enabled for this deployment.")
  }

  async function onSubscribe(plan: "basic" | "pro" | "max") {
    setLoadingPlan(plan)
    try {
      const checkoutUrl = await createCheckoutSession({ plan, billingCycle })
      window.location.href = checkoutUrl
    } catch (e) {
      alert(e instanceof Error ? e.message : "Checkout failed.")
    } finally {
      setLoadingPlan(null)
    }
  }

  async function onBuyPack(plan: CheckoutPlan) {
    setLoadingPlan(plan)
    try {
      const checkoutUrl = await createCheckoutSession({ plan, billingCycle: "once" })
      window.location.href = checkoutUrl
    } catch (e) {
      alert(e instanceof Error ? e.message : "Checkout failed.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-14">
      {config && !config.ready ? (
        <Alert className="border-banana-200/60 bg-banana-50">
          <AlertTitle>Creem is not configured yet</AlertTitle>
          <AlertDescription>
            <p>Set the missing env vars in `.env.local`, then restart `pnpm dev`.</p>
            <p className="text-xs">Missing: {config.missing.join(", ")}</p>
          </AlertDescription>
        </Alert>
      ) : config && !paymentsEnabled ? (
        <Alert className="border-banana-200/60 bg-banana-50">
          <AlertTitle>Payments are not enabled</AlertTitle>
          <AlertDescription>
            <p className="text-sm">This deployment does not have Creem product IDs configured.</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex rounded-full border border-banana-200/60 bg-banana-50 px-2 py-1 text-sm">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium transition-colors",
              billingCycle === "monthly" ? "bg-banana-400 text-banana-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium transition-colors",
              billingCycle === "yearly" ? "bg-banana-400 text-banana-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Yearly <span className="ml-1 text-xs">(save 20%)</span>
          </button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Switch to yearly anytime. Payments handled securely by Creem.
        </p>
        <p className="max-w-xl text-center text-xs text-muted-foreground">
          Prices shown in USD. Subscriptions renew automatically until canceled. By purchasing you agree to our{" "}
          <Link className="underline underline-offset-2" href="/terms">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
          . Questions? Email{" "}
          <a className="underline underline-offset-2" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
          const priceSuffix = billingCycle === "monthly" ? "/mo" : "/yr"
          const primary = Boolean(plan.highlighted)
          const isLoading = loadingPlan === plan.key
          const canCheckout = config ? config.plans[plan.key][billingCycle] : false
          const missingRequiredConfig = Boolean(config && !config.ready)

          return (
            <Card
              key={plan.key}
              className={cn(
                "relative overflow-hidden border-banana-200/60",
                primary && "border-banana-300 shadow-md shadow-banana-200/40",
              )}
            >
              {primary ? (
                <div className="absolute right-4 top-4 rounded-full bg-banana-400 px-3 py-1 text-xs font-semibold text-banana-900">
                  Popular
                </div>
              ) : null}

              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-banana-100">{plan.icon}</span>
                  <span>{plan.name}</span>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="pb-1 text-sm text-muted-foreground">{priceSuffix}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Includes {plan.monthlyCredits.toLocaleString()} credits / month
                  </div>
                </div>

                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-banana-700" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={cn(
                    "w-full",
                    primary ? "bg-banana-400 text-banana-900 hover:bg-banana-500" : "bg-foreground text-background",
                  )}
                  disabled={isLoading || (!missingRequiredConfig && !canCheckout)}
                  onClick={missingRequiredConfig ? onMissingConfig : canCheckout ? () => onSubscribe(plan.key) : onPaymentsDisabled}
                >
                  {isLoading ? "Redirecting..." : missingRequiredConfig ? "Set up Creem" : canCheckout ? "Get started" : "Coming soon"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Need credits without a subscription?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Buy a pack once. Credits never expire.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKS.map((pack) => {
            const isLoading = loadingPlan === pack.key
            const enabled = config ? config.packs[pack.key] : false
            const missingRequiredConfig = Boolean(config && !config.ready)
            return (
              <Card key={pack.key} className="border-banana-200/60">
                <CardHeader>
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  <CardDescription>{pack.credits.toLocaleString()} credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">${pack.price}</div>
                  <ul className="space-y-2 text-sm">
                    {pack.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-banana-700" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-banana-400 text-banana-900 hover:bg-banana-500"
                    disabled={isLoading || (!missingRequiredConfig && !enabled)}
                    onClick={missingRequiredConfig ? onMissingConfig : enabled ? () => onBuyPack(pack.key) : onPaymentsDisabled}
                  >
                    {isLoading ? "Redirecting..." : missingRequiredConfig ? "Set up Creem" : enabled ? "Buy once" : "Coming soon"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
