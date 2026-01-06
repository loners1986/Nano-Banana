import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site"

export const metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: `How to contact ${SITE_NAME} support.`,
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
          <p className="text-sm text-muted-foreground">
            For support, billing questions, or privacy requests, email{" "}
            <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

