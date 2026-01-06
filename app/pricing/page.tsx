import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingClient } from "@/components/pricing/pricing-client"

export const metadata = {
  title: "Pricing | Nano Banana",
  description: "Choose the plan that fits your AI image editing needs.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-banana-800 bg-banana-100/80 backdrop-blur-sm border border-banana-200/80">
              🍌 Pro is now live
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-banana-700 via-banana-600 to-banana-800 bg-clip-text text-transparent mb-4">
            Simple pricing for every workflow
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Flexible plans for individuals and teams. Start editing with AI in minutes.
          </p>
        </div>

        <div className="mt-12">
          <PricingClient />
        </div>
      </div>
      <Footer />
    </main>
  )
}

