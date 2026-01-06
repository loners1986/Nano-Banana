import { Button } from "@/components/ui/button"
import { BananaDecoration } from "@/components/banana-decoration"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <BananaDecoration className="absolute -right-20 top-10 h-40 w-40 rotate-12 opacity-20" />
      <BananaDecoration className="absolute -left-16 bottom-20 h-32 w-32 -rotate-45 opacity-15" />
      <BananaDecoration className="absolute right-1/4 top-1/3 h-24 w-24 rotate-45 opacity-10" />

      <div className="container mx-auto px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-banana-100 px-4 py-2 text-sm font-medium text-banana-700">
          <span>New</span>
          <span>AI image editing in your browser</span>
          <a href="#generator" className="font-semibold hover:underline">
            Try now →
          </a>
        </div>

        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl">Nano Banana</h1>

        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Transform images with simple text prompts. Nano Banana routes your request to third-party AI models and
          returns edited outputs in seconds.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 bg-banana-400 px-8 text-banana-900 hover:bg-banana-500">
            <a href="#generator">
              Start Editing
              <span aria-hidden>→</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 bg-transparent">
            <a href="#showcase">View Examples</a>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            One-shot editing
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Multi-image support
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Natural language
          </div>
        </div>
      </div>
    </section>
  )
}
