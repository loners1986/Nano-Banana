import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LEGAL_LAST_UPDATED, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site"

export const metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: `The terms that govern your use of ${SITE_NAME}.`,
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Using the service</h2>
            <p className="text-sm text-muted-foreground">
              {SITE_NAME} provides an interface that lets you upload images and submit prompts to generate edited images
              using third-party AI services (for example, OpenRouter and its upstream model providers). We are not
              affiliated with those providers. You are responsible for your content and your use of the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Prohibited content and conduct</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Do not upload illegal content, or content you do not have the right to use.</li>
              <li>Do not upload sensitive personal data or confidential information.</li>
              <li>Do not attempt to misuse, probe, or disrupt the service.</li>
              <li>
                Comply with the acceptable use rules and policies of any third-party providers used to deliver the AI
                functionality.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. AI outputs</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Outputs may be inaccurate, incomplete, or unexpected. Review before relying on them.</li>
              <li>You are responsible for how you use the outputs, including ensuring you have rights to publish them.</li>
              <li>We do not guarantee specific results, quality, or availability of any model.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Paid plans (if enabled)</h2>
            <p className="text-sm text-muted-foreground">
              If paid plans are enabled, prices and billing terms are shown on the <Link className="underline" href="/pricing">Pricing</Link>{" "}
              page and during checkout. Subscriptions renew automatically until canceled. Payments may be processed by a
              third-party provider.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Refunds and cancellations</h2>
            <p className="text-sm text-muted-foreground">
              Refund eligibility and cancellation handling depend on your plan type and the payment provider used for
              checkout. Contact{" "}
              <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>{" "}
              with your checkout details for assistance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Disclaimers and limitation of liability</h2>
            <p className="text-sm text-muted-foreground">
              The service is provided &quot;as is&quot; and &quot;as available&quot;. To the maximum extent permitted by law, we disclaim
              all warranties and limit liability for indirect or consequential damages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Contact</h2>
            <p className="text-sm text-muted-foreground">
              Questions about these terms? Email{" "}
              <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              . Also review our <Link className="underline" href="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
