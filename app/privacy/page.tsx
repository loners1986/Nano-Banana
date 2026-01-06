import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LEGAL_LAST_UPDATED, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site"

export const metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `How ${SITE_NAME} collects and uses information.`,
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p className="text-sm text-muted-foreground">
              {SITE_NAME} is an AI image editing web app. When you upload images and submit prompts, we send those inputs
              to third-party AI providers to generate outputs. We also use third-party services for authentication,
              analytics, and payments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Information we process</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Account data</span> (if you sign in): your email address
                and authentication metadata from our auth provider.
              </li>
              <li>
                <span className="font-medium text-foreground">User inputs</span>: images you upload and text prompts you
                submit for generation.
              </li>
              <li>
                <span className="font-medium text-foreground">Usage data</span>: basic analytics events and technical
                data (e.g., device/browser information) collected by our analytics provider.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">How we use information</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Provide the core product experience (AI image editing/generation).</li>
              <li>Authenticate users and keep sessions working.</li>
              <li>Operate payments and purchases (if enabled on this deployment).</li>
              <li>Monitor reliability, prevent abuse, and improve performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Third-party services</h2>
            <p className="text-sm text-muted-foreground">Depending on deployment configuration, we may use:</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                OpenRouter (AI routing) and its upstream model provider(s) (to process prompts and images and return
                generated outputs).
              </li>
              <li>Supabase and Google sign-in (authentication).</li>
              <li>Creem (checkout and billing, when payments are enabled).</li>
              <li>Vercel Analytics (usage analytics).</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              These providers process data on our behalf to deliver their services. Their privacy practices may differ
              from ours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Data retention</h2>
            <p className="text-sm text-muted-foreground">
              We process your inputs to generate outputs. We do not intend to store your uploaded images or prompts
              longer than necessary to provide the service, but third-party providers and standard server logs may
              retain data for limited periods for security, debugging, and compliance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Your choices</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Do not upload sensitive personal data or confidential information.</li>
              <li>
                If you have an account, you can sign out at any time. To request access or deletion, contact us at{" "}
                <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-sm text-muted-foreground">
              Questions about this policy? Email{" "}
              <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              . Also see our <Link className="underline" href="/terms">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
