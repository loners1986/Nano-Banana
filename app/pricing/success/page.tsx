import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Payment successful | Nano Banana",
}

export default function PricingSuccessPage({
  searchParams,
}: {
  searchParams?: { plan?: string; checkout_id?: string }
}) {
  const plan = searchParams?.plan
  const checkoutId = searchParams?.checkout_id

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-banana-200/60 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-banana-100 text-2xl">
            🍌
          </div>
          <h1 className="text-2xl font-bold">Thanks for your purchase</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {plan ? (
              <>
                Your checkout for <span className="font-medium text-foreground">{plan}</span> is complete.
              </>
            ) : (
              "Your checkout is complete."
            )}
          </p>
          {checkoutId ? (
            <p className="mt-2 text-xs text-muted-foreground">Checkout ID: {checkoutId}</p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="bg-banana-400 text-banana-900 hover:bg-banana-500">
              <Link href="/">Go back home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

